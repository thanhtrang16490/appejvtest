-- Migration 19: Allow customers to create their own customer record
-- This enables self-registration for customer users who don't have a customer record yet

BEGIN;

-- Add INSERT policy for customers to create their own record
CREATE POLICY "customers_self_insert" ON customers
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'customer'
    )
  );

-- Add comment
COMMENT ON POLICY "customers_self_insert" ON customers IS 
  'Allows customer users to create their own customer record during first login';

COMMIT;

-- Verification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'customers'
  AND policyname = 'customers_self_insert';
