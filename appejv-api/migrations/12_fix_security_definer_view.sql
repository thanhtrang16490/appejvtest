-- Fix Security Definer View Issue
-- Drop and recreate recent_audit_logs view without SECURITY DEFINER

-- First, get the current view definition to preserve it
DO $$
DECLARE
  view_definition TEXT;
BEGIN
  -- Get current view definition
  SELECT pg_get_viewdef('public.recent_audit_logs', true) INTO view_definition;
  
  -- Drop the view
  DROP VIEW IF EXISTS public.recent_audit_logs CASCADE;
  
  -- Recreate with SECURITY INVOKER
  -- Extract the SELECT part from the definition
  EXECUTE format('
    CREATE VIEW public.recent_audit_logs
    WITH (security_invoker = true)
    AS %s
  ', view_definition);
  
  RAISE NOTICE 'View recreated successfully with SECURITY INVOKER';
  
EXCEPTION
  WHEN undefined_table THEN
    RAISE NOTICE 'View recent_audit_logs does not exist, skipping';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
END $$;

-- Grant appropriate permissions
GRANT SELECT ON public.recent_audit_logs TO authenticated;

-- Add comment explaining the security model
COMMENT ON VIEW public.recent_audit_logs IS 
'View showing recent audit log entries. 
Uses SECURITY INVOKER to enforce RLS policies of the querying user.
Users can only see audit logs they have permission to access based on RLS policies.';
