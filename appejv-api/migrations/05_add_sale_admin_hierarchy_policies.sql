-- Add RLS Policies for Sale_admin Hierarchy
-- This migration adds policies so sale_admin can manage their team

-- ============================================================================
-- STEP 1: Add policies for sale_admin to view their managed sales
-- ============================================================================

-- Sale_admin can view sales they manage
CREATE POLICY "sale_admin_select_managed_sales"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'sale'
    AND manager_id = auth.uid()
  );

-- Sale_admin can update their managed sales
CREATE POLICY "sale_admin_update_managed_sales"
  ON profiles FOR UPDATE
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'sale'
    AND manager_id = auth.uid()
  )
  WITH CHECK (
    get_user_role() = 'sale_admin'
    AND role = 'sale'
    AND manager_id = auth.uid()
  );

-- ============================================================================
-- STEP 2: Add policies for sale_admin to view team customers
-- ============================================================================

-- Sale_admin can view customers assigned to their sales team
CREATE POLICY "sale_admin_select_team_customers"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'customer'
    AND EXISTS (
      SELECT 1 FROM profiles sales
      WHERE sales.id = assigned_sale_id
      AND sales.manager_id = auth.uid()
      AND sales.role = 'sale'
    )
  );

-- Sale_admin can update team customers (reassign, edit details)
CREATE POLICY "sale_admin_update_team_customers"
  ON profiles FOR UPDATE
  USING (
    get_user_role() = 'sale_admin'
    AND role = 'customer'
    AND EXISTS (
      SELECT 1 FROM profiles sales
      WHERE sales.id = assigned_sale_id
      AND sales.manager_id = auth.uid()
      AND sales.role = 'sale'
    )
  );

-- ============================================================================
-- STEP 3: Add policies for sale_admin to view team orders
-- ============================================================================

-- Sale_admin can view orders from their team
CREATE POLICY "sale_admin_select_team_orders"
  ON orders FOR SELECT
  USING (
    get_user_role() = 'sale_admin'
    AND (
      -- Orders created by sales in their team
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = orders.sale_id
        AND profiles.manager_id = auth.uid()
        AND profiles.role = 'sale'
      )
      -- OR orders from customers assigned to their team
      OR EXISTS (
        SELECT 1 FROM profiles customers
        JOIN profiles sales ON sales.id = customers.assigned_sale_id
        WHERE customers.id = orders.customer_id
        AND customers.role = 'customer'
        AND sales.manager_id = auth.uid()
        AND sales.role = 'sale'
      )
    )
  );

-- Sale_admin can update team orders
CREATE POLICY "sale_admin_update_team_orders"
  ON orders FOR UPDATE
  USING (
    get_user_role() = 'sale_admin'
    AND (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = orders.sale_id
        AND profiles.manager_id = auth.uid()
        AND profiles.role = 'sale'
      )
      OR EXISTS (
        SELECT 1 FROM profiles customers
        JOIN profiles sales ON sales.id = customers.assigned_sale_id
        WHERE customers.id = orders.customer_id
        AND customers.role = 'customer'
        AND sales.manager_id = auth.uid()
        AND sales.role = 'sale'
      )
    )
  );

-- ============================================================================
-- STEP 4: Add helper function for checking team membership
-- ============================================================================

-- Function to check if a user is in sale_admin's team
CREATE OR REPLACE FUNCTION public.is_in_sale_admin_team(user_id uuid, sale_admin_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'sale'
    AND manager_id = sale_admin_id
  );
$$;

-- Grant permission
GRANT EXECUTE ON FUNCTION public.is_in_sale_admin_team(uuid, uuid) TO authenticated;

COMMENT ON FUNCTION public.is_in_sale_admin_team IS 
  'Check if a user (sale) is managed by a specific sale_admin';

-- ============================================================================
-- STEP 5: Add policies for admin to manage sale_admins
-- ============================================================================

-- Admin can view all sale_admins (already covered by admin_select_all_profiles)
-- But let's add explicit policy for clarity

CREATE POLICY "admin_select_sale_admins"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'admin'
    AND role = 'sale_admin'
  );

CREATE POLICY "admin_update_sale_admins"
  ON profiles FOR UPDATE
  USING (
    get_user_role() = 'admin'
    AND role = 'sale_admin'
  )
  WITH CHECK (
    get_user_role() = 'admin'
    AND role = 'sale_admin'
  );

-- ============================================================================
-- STEP 6: Verify policies
-- ============================================================================

-- Show all policies on profiles
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%admin%' THEN 'Admin'
    WHEN policyname LIKE '%sale_admin%' THEN 'Sale Admin'
    WHEN policyname LIKE '%sales%' OR policyname LIKE '%sale%' THEN 'Sale'
    WHEN policyname LIKE '%customer%' THEN 'Customer'
    ELSE 'Other'
  END as role_group
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY role_group, cmd, policyname;

-- Show all policies on orders
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%admin%' THEN 'Admin'
    WHEN policyname LIKE '%sale_admin%' THEN 'Sale Admin'
    WHEN policyname LIKE '%sales%' OR policyname LIKE '%sale%' THEN 'Sale'
    WHEN policyname LIKE '%customer%' THEN 'Customer'
    ELSE 'Other'
  END as role_group
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY role_group, cmd, policyname;

-- ============================================================================
-- STEP 7: Test scenarios (for documentation)
-- ============================================================================

-- Scenario 1: Sale_admin views their sales
-- Expected: See only sales with manager_id = sale_admin.id

-- Scenario 2: Sale_admin views team customers
-- Expected: See customers where assigned_sale_id IN (team sales)

-- Scenario 3: Sale_admin views team orders
-- Expected: See orders where sale_id IN (team sales) OR customer_id IN (team customers)

-- Scenario 4: Admin views all sale_admins
-- Expected: See all profiles with role = 'sale_admin'

-- Success message
SELECT '✅ Sale_admin hierarchy policies added successfully!' as status;
SELECT 'Sale_admin can now:' as info;
SELECT '  - View and manage their sales team' as capability;
SELECT '  - View and manage team customers' as capability;
SELECT '  - View and manage team orders' as capability;
SELECT 'Admin can:' as info;
SELECT '  - View and manage all sale_admins' as capability;

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================

-- Hierarchy structure:
-- Admin
--   └── Sale_admin (manager_id = null or admin.id)
--         └── Sale (manager_id = sale_admin.id)
--               └── Customer (assigned_sale_id = sale.id)

-- Permissions:
-- - Admin: Full access to everything
-- - Sale_admin: Access to their team (sales + customers + orders)
-- - Sale: Access to their assigned customers + customer orders
-- - Customer: Access to own profile + own orders
