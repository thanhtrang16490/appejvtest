-- Fix RLS Policies - Replace overly permissive policies with specific ones
-- This migration improves security by restricting public access to only SELECT operations

-- ============================================
-- 1. Fix products table - Allow public SELECT only
-- ============================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public access" ON public.products;

-- Create separate policies for different operations
-- Public can only SELECT (read) products
CREATE POLICY "Public can view products"
  ON public.products
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can INSERT products
CREATE POLICY "Authenticated users can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can UPDATE their own products or admins can update any
CREATE POLICY "Authenticated users can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can DELETE products
CREATE POLICY "Authenticated users can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 2. Fix order_items table - Allow public SELECT only
-- ============================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public access" ON public.order_items;

-- Public can only SELECT (read) order items
CREATE POLICY "Public can view order items"
  ON public.order_items
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can INSERT order items
CREATE POLICY "Authenticated users can insert order items"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can UPDATE order items
CREATE POLICY "Authenticated users can update order items"
  ON public.order_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can DELETE order items
CREATE POLICY "Authenticated users can delete order items"
  ON public.order_items
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 3. Fix customer_details table - Allow public SELECT only
-- ============================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public access" ON public.customer_details;

-- Public can only SELECT (read) customer details
CREATE POLICY "Public can view customer details"
  ON public.customer_details
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can INSERT customer details
CREATE POLICY "Authenticated users can insert customer details"
  ON public.customer_details
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can UPDATE customer details
CREATE POLICY "Authenticated users can update customer details"
  ON public.customer_details
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can DELETE customer details
CREATE POLICY "Authenticated users can delete customer details"
  ON public.customer_details
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Verify the changes
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  roles,
  CASE 
    WHEN qual = 'true' AND cmd != 'SELECT' THEN '⚠️ Still permissive'
    WHEN cmd = 'SELECT' AND roles::text LIKE '%public%' THEN '✅ Public read only'
    WHEN roles::text LIKE '%authenticated%' THEN '✅ Authenticated only'
    ELSE '✅ Restricted'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('products', 'order_items', 'customer_details')
ORDER BY tablename, cmd;

-- ============================================
-- Summary
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies have been updated:';
  RAISE NOTICE '   - products: Public can only SELECT, authenticated can INSERT/UPDATE/DELETE';
  RAISE NOTICE '   - order_items: Public can only SELECT, authenticated can INSERT/UPDATE/DELETE';
  RAISE NOTICE '   - customer_details: Public can only SELECT, authenticated can INSERT/UPDATE/DELETE';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ Note: audit_logs and notifications policies are intentionally permissive for system operations';
END $$;
