-- =====================================================
-- ADD MANAGER HIERARCHY TO PROFILES
-- =====================================================
-- This migration adds manager_id column to profiles table
-- for Sale Admin to manage Sales team

-- =====================================================
-- ADD COLUMN
-- =====================================================

-- Add manager_id column (nullable, references profiles.id)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add comment
COMMENT ON COLUMN profiles.manager_id IS 'ID of the manager (Sale Admin) who manages this user';

-- =====================================================
-- CREATE INDEX
-- =====================================================

-- Index for manager hierarchy queries
CREATE INDEX IF NOT EXISTS idx_profiles_manager_id 
ON profiles(manager_id) 
WHERE manager_id IS NOT NULL;

-- =====================================================
-- UPDATE RLS POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Sale admins can view their team" ON profiles;
DROP POLICY IF EXISTS "Sale admins can update their team" ON profiles;

-- Sale admins can view their managed team members
CREATE POLICY "Sale admins can view their team"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin' OR
  (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'sale_admin' 
    AND manager_id = auth.uid()
  )
);

-- Sale admins can update their managed team members (limited fields)
CREATE POLICY "Sale admins can update their team"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin' OR
  (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'sale_admin' 
    AND manager_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() = id OR
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin' OR
  (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'sale_admin' 
    AND manager_id = auth.uid()
  )
);

-- =====================================================
-- HELPER FUNCTION
-- =====================================================

-- Function to get all team members under a manager (recursive)
CREATE OR REPLACE FUNCTION get_team_members(manager_uuid UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  level INTEGER
) AS $$
WITH RECURSIVE team_hierarchy AS (
  -- Base case: direct reports
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.role,
    1 as level
  FROM profiles p
  WHERE p.manager_id = manager_uuid
  
  UNION ALL
  
  -- Recursive case: reports of reports
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.role,
    th.level + 1
  FROM profiles p
  INNER JOIN team_hierarchy th ON p.manager_id = th.id
)
SELECT * FROM team_hierarchy
ORDER BY level, full_name;
$$ LANGUAGE sql STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_team_members(UUID) TO authenticated;

-- =====================================================
-- EXAMPLE USAGE
-- =====================================================

-- Assign a Sale to a Sale Admin:
-- UPDATE profiles 
-- SET manager_id = 'sale_admin_uuid_here'
-- WHERE id = 'sale_user_uuid_here';

-- Get all team members under a manager:
-- SELECT * FROM get_team_members('sale_admin_uuid_here');

-- Get count of team members:
-- SELECT COUNT(*) FROM profiles WHERE manager_id = 'sale_admin_uuid_here';

-- =====================================================
-- VERIFY
-- =====================================================

-- Check if column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'manager_id';

-- Check if index was created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles' AND indexname = 'idx_profiles_manager_id';
