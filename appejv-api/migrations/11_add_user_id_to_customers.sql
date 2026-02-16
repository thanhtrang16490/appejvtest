-- Migration 11: Add user_id to customers table for authentication link
-- This allows customers to have optional login accounts

BEGIN;

-- 1. Create helper functions if not exist

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Function to check if user is sale
CREATE OR REPLACE FUNCTION public.is_sale()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'sale'
  );
$$;

-- Function to check if user is sale_admin
CREATE OR REPLACE FUNCTION public.is_sale_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'sale_admin'
  );
$$;

-- 2. Add user_id column to customers table (nullable - not all customers need login)
ALTER TABLE customers 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Create unique index on user_id (one user can only be one customer)
CREATE UNIQUE INDEX idx_customers_user_id ON customers(user_id) WHERE user_id IS NOT NULL;

-- 4. Migrate existing customers that have auth accounts
-- Link customers to their auth accounts based on email match
UPDATE customers c
SET user_id = au.id
FROM auth.users au
WHERE c.email = au.email
  AND c.user_id IS NULL;

-- 5. Create function to sync email changes between auth.users and customers
CREATE OR REPLACE FUNCTION sync_customer_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- When customer email changes and they have a user_id, update auth.users
  IF NEW.email IS DISTINCT FROM OLD.email AND NEW.user_id IS NOT NULL THEN
    -- Note: Updating auth.users.email requires admin privileges
    -- This should be done through Supabase Admin API in application code
    -- We'll just log this for now
    RAISE NOTICE 'Customer email changed from % to % for user_id %', OLD.email, NEW.email, NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. Create trigger to sync email changes
DROP TRIGGER IF EXISTS trigger_sync_customer_email ON customers;
CREATE TRIGGER trigger_sync_customer_email
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION sync_customer_email();

-- 7. Update RLS policies to include user_id checks

-- Drop existing customer policies
DROP POLICY IF EXISTS "customers_admin_all" ON customers;
DROP POLICY IF EXISTS "customers_sale_view_assigned" ON customers;
DROP POLICY IF EXISTS "customers_sale_update_assigned" ON customers;
DROP POLICY IF EXISTS "customers_sale_admin_view_team" ON customers;
DROP POLICY IF EXISTS "customers_sale_admin_update_team" ON customers;
DROP POLICY IF EXISTS "customers_warehouse_view" ON customers;

-- Recreate policies with user_id support

-- Admin: full access
CREATE POLICY "customers_admin_all" ON customers
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Customers can view and update their own data if they have user_id
CREATE POLICY "customers_self_view" ON customers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "customers_self_update" ON customers
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Sale: view assigned customers
CREATE POLICY "customers_sale_view_assigned" ON customers
  FOR SELECT
  USING (
    is_sale() AND assigned_to = auth.uid()
  );

-- Sale: update assigned customers
CREATE POLICY "customers_sale_update_assigned" ON customers
  FOR UPDATE
  USING (
    is_sale() AND assigned_to = auth.uid()
  )
  WITH CHECK (
    is_sale() AND assigned_to = auth.uid()
  );

-- Sale Admin: view team customers
CREATE POLICY "customers_sale_admin_view_team" ON customers
  FOR SELECT
  USING (
    is_sale_admin() AND (
      assigned_to = auth.uid()
      OR assigned_to IN (
        SELECT id FROM profiles WHERE manager_id = auth.uid()
      )
    )
  );

-- Sale Admin: update team customers
CREATE POLICY "customers_sale_admin_update_team" ON customers
  FOR UPDATE
  USING (
    is_sale_admin() AND (
      assigned_to = auth.uid()
      OR assigned_to IN (
        SELECT id FROM profiles WHERE manager_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    is_sale_admin() AND (
      assigned_to = auth.uid()
      OR assigned_to IN (
        SELECT id FROM profiles WHERE manager_id = auth.uid()
      )
    )
  );

-- Warehouse: view all customers (read-only)
CREATE POLICY "customers_warehouse_view" ON customers
  FOR SELECT
  USING (is_warehouse());

-- 8. Add comment
COMMENT ON COLUMN customers.user_id IS 'Optional link to auth.users for customers who can login';

COMMIT;

-- Verification queries
SELECT 
  'Customers with auth accounts' as description,
  COUNT(*) as count
FROM customers 
WHERE user_id IS NOT NULL;

SELECT 
  'Customers without auth accounts' as description,
  COUNT(*) as count
FROM customers 
WHERE user_id IS NULL;
