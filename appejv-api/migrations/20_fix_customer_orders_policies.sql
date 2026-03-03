-- Migration 20: Fix orders RLS policies for new customer structure
-- After migration 10-11, customer_id references customers table, not auth.users
-- Need to update policies to check via customers.user_id

BEGIN;

-- Drop old customer order policies
DROP POLICY IF EXISTS "customers_insert_own_orders" ON orders;
DROP POLICY IF EXISTS "customers_select_own_orders" ON orders;
DROP POLICY IF EXISTS "customers_update_own_orders" ON orders;

-- Create new policies that work with customers table

-- SELECT: Customers can view their own orders
CREATE POLICY "customers_select_own_orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = orders.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- INSERT: Customers can create orders for themselves
CREATE POLICY "customers_insert_own_orders" ON orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = orders.customer_id
      AND customers.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'customer'
    )
  );

-- UPDATE: Customers can update their own draft orders
CREATE POLICY "customers_update_own_orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = orders.customer_id
      AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = orders.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Add comments
COMMENT ON POLICY "customers_select_own_orders" ON orders IS 
  'Allows customers to view their own orders via customers.user_id';
COMMENT ON POLICY "customers_insert_own_orders" ON orders IS 
  'Allows customers to create orders for themselves via customers.user_id';
COMMENT ON POLICY "customers_update_own_orders" ON orders IS 
  'Allows customers to update their own orders via customers.user_id';

COMMIT;

-- Verification
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'orders'
  AND policyname LIKE 'customers_%'
ORDER BY policyname;
