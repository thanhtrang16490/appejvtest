-- Simple fix for Security Definer View Issue
-- Run this directly in Supabase SQL Editor

-- Step 1: Check current view definition
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE viewname = 'recent_audit_logs';

-- Step 2: Drop the existing view
DROP VIEW IF EXISTS public.recent_audit_logs CASCADE;

-- Step 3: Recreate the view with SECURITY INVOKER
-- Note: Adjust the SELECT statement based on your actual audit_logs table structure
-- Common structures:

-- Option A: If your audit_logs has these columns
CREATE OR REPLACE VIEW public.recent_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
ORDER BY created_at DESC
LIMIT 100;

-- Step 4: Grant permissions
GRANT SELECT ON public.recent_audit_logs TO authenticated;

-- Step 5: Add comment
COMMENT ON VIEW public.recent_audit_logs IS 
'View showing recent audit log entries. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';

-- Step 6: Verify the fix
SELECT 
  viewname,
  viewowner,
  CASE 
    WHEN definition LIKE '%security_invoker%' THEN '✅ SECURITY INVOKER (Safe)'
    ELSE '⚠️ SECURITY DEFINER (Warning)'
  END as security_mode
FROM pg_views 
WHERE viewname = 'recent_audit_logs';
