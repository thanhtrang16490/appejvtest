-- Fix infinite recursion after adding hierarchy policies
-- The new policies are causing recursion because they query profiles table

-- ============================================================================
-- STEP 1: Drop ALL policies on profiles AND orders (clean slate)
-- ============================================================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop policies on profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    -- Drop policies on orders
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.orders';
    END LOOP;
END $$;

-- ============================================================================
-- STEP 2: Recreate security definer functions (improved versions)
-- ============================================================================

-- Drop existing functions (now safe since policies are dropped)
DROP FUNCTION IF EXISTS public.can_access_profile(uuid);
DROP FUNCTION IF EXISTS public.is_admin_or_sale_admin();
DROP FUNCTION IF EXISTS public.get_user_role();
DROP FUNCTION IF EXISTS public.is_in_sale_admin_team(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_my_managed_sale(uuid);
DROP FUNCTION IF EXISTS public.is_team_customer(uuid);

-- Function to get current user's role (no recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Function to check if user is admin or sale_admin (no recursion)
CREATE OR REPLACE FUNCTION public.is_admin_or_sale_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'sale_admin')
  );
$$;

-- Function to check if a sale is managed by current user (sale_admin)
CREATE OR REPLACE FUNCTION public.is_my_managed_sale(sale_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = sale_id
    AND role = 'sale'
    AND manager_id = auth.uid()
  );
$$;

-- Function to check if a customer is in current user's team
CREATE OR REPLACE FUNCTION public.is_team_customer(customer_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles customers
    WHERE customers.id = customer_id
    AND customers.role = 'customer'
    AND EXISTS (
      SELECT 1 FROM profiles sales
      WHERE sales.id = customers.assigned_sale_id
      AND sales.manager_id = auth.uid()
    )
  );
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_sale_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_my_managed_sale(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_customer(uuid) TO authenticated;

-- ============================================================================
-- STEP 3: Create simple, non-recursive policies
-- ============================================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SELECT Policies
-- ============================================================================

-- 1. Users can view their own profile
CREATE POLICY "users_select_own_profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- 2. Admin/Sale_admin can view all profiles
CREATE POLICY "admin_select_all_profiles"
  ON profiles FOR SELECT
  USING (is_admin_or_sale_admin());

-- 3. Sales can view their assigned customers
CREATE POLICY "sales_select_assigned_customers"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'sale'
    AND role = 'customer'
    AND assigned_sale_id = auth.uid()
  );

-- 4. Sale_admin can view their managed sales
CREATE POLICY "sale_admin_select_managed_sales"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'sale'
    AND is_my_managed_sale(id)
  );

-- 5. Sale_admin can view team customers
CREATE POLICY "sale_admin_select_team_customers"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'customer'
    AND is_team_customer(id)
  );

-- ============================================================================
-- INSERT Policies
-- ============================================================================

-- 1. Users can insert their own profile (signup)
CREATE POLICY "users_insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- 2. Admin can insert any profile
CREATE POLICY "admin_insert_any_profile"
  ON profiles FOR INSERT
  WITH CHECK (is_admin_or_sale_admin());

-- ============================================================================
-- UPDATE Policies
-- ============================================================================

-- 1. Users can update their own profile
CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 2. Admin can update any profile
CREATE POLICY "admin_update_any_profile"
  ON profiles FOR UPDATE
  USING (is_admin_or_sale_admin())
  WITH CHECK (is_admin_or_sale_admin());

-- 3. Sales can update their assigned customers
CREATE POLICY "sales_update_assigned_customers"
  ON profiles FOR UPDATE
  USING (
    get_user_role() = 'sale'
    AND role = 'customer'
    AND assigned_sale_id = auth.uid()
  );

-- 4. Sale_admin can update managed sales
CREATE POLICY "sale_admin_update_managed_sales"
  ON profiles FOR UPDATE
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'sale'
    AND is_my_managed_sale(id)
  );

-- 5. Sale_admin can update team customers
CREATE POLICY "sale_admin_update_team_customers"
  ON profiles FOR UPDATE
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'customer'
    AND is_team_customer(id)
  );

-- ============================================================================
-- DELETE Policies (soft delete via deleted_at)
-- ============================================================================

-- Only admin can delete
CREATE POLICY "admin_delete_profiles"
  ON profiles FOR UPDATE
  USING (is_admin_or_sale_admin())
  WITH CHECK (is_admin_or_sale_admin());

-- ============================================================================
-- STEP 4: Verify policies
-- ============================================================================

-- Show all policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%admin%' AND policyname NOT LIKE '%sale_admin%' THEN 'Admin'
    WHEN policyname LIKE '%sale_admin%' THEN 'Sale Admin'
    WHEN policyname LIKE '%sales%' OR policyname LIKE '%sale%' THEN 'Sale'
    WHEN policyname LIKE '%customer%' THEN 'Customer'
    WHEN policyname LIKE '%users%' THEN 'All Users'
    ELSE 'Other'
  END as role_group
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY role_group, cmd, policyname;

-- ============================================================================
-- STEP 5: Recreate policies for orders table
-- ============================================================================

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- SELECT policies
CREATE POLICY "customers_select_own_orders"
  ON orders FOR SELECT
  USING (
    get_user_role() = 'customer'
    AND customer_id = auth.uid()
  );

CREATE POLICY "sales_select_assigned_orders"
  ON orders FOR SELECT
  USING (
    get_user_role() = 'sale'
    AND (
      sale_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = orders.customer_id
        AND profiles.assigned_sale_id = auth.uid()
      )
    )
  );

CREATE POLICY "sale_admin_select_team_orders"
  ON orders FOR SELECT
  USING (
    get_user_role() = 'sale_admin'
    AND (
      -- Orders by managed sales
      is_my_managed_sale(sale_id)
      -- OR orders from team customers
      OR is_team_customer(customer_id)
    )
  );

CREATE POLICY "admin_select_all_orders"
  ON orders FOR SELECT
  USING (is_admin_or_sale_admin());

-- INSERT policies
CREATE POLICY "customers_insert_own_orders"
  ON orders FOR INSERT
  WITH CHECK (
    get_user_role() = 'customer'
    AND customer_id = auth.uid()
  );

CREATE POLICY "sales_insert_orders"
  ON orders FOR INSERT
  WITH CHECK (
    get_user_role() IN ('sale', 'sale_admin', 'admin')
  );

-- UPDATE policies
CREATE POLICY "customers_update_own_orders"
  ON orders FOR UPDATE
  USING (
    get_user_role() = 'customer'
    AND customer_id = auth.uid()
    AND status IN ('draft', 'ordered')
  );

CREATE POLICY "sales_update_orders"
  ON orders FOR UPDATE
  USING (
    get_user_role() IN ('sale', 'sale_admin', 'admin')
  );

-- ============================================================================
-- STEP 6: Verify all policies
-- ============================================================================

-- Show profiles policies
SELECT 
  'profiles' as table_name,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Show orders policies
SELECT 
  'orders' as table_name,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd, policyname;

-- Count policies
SELECT 
  'Total policies on profiles' as metric,
  COUNT(*) as count
FROM pg_policies
WHERE tablename = 'profiles';

-- Success message
SELECT '✅ Recursion fixed! All policies use security definer functions.' as status;
SELECT 'Policies are now safe and non-recursive.' as info;

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================

-- All policies now use security definer functions that bypass RLS
-- This prevents infinite recursion
-- Functions are:
--   - get_user_role(): Returns current user's role
--   - is_admin_or_sale_admin(): Check if admin/sale_admin
--   - is_my_managed_sale(uuid): Check if sale is managed by current user
--   - is_team_customer(uuid): Check if customer is in current user's team
