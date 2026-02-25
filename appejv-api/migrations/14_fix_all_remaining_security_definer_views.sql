-- Fix All Remaining Security Definer Views
-- This migration fixes: security_audit_logs, active_customers, failed_audit_logs, active_profiles

-- ============================================
-- 1. Fix security_audit_logs view
-- ============================================
DROP VIEW IF EXISTS public.security_audit_logs CASCADE;

CREATE OR REPLACE VIEW public.security_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
WHERE action IN ('login', 'logout', 'password_change', 'permission_change', 'role_change')
ORDER BY created_at DESC;

GRANT SELECT ON public.security_audit_logs TO authenticated;

COMMENT ON VIEW public.security_audit_logs IS 
'View showing security-related audit log entries. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';

-- ============================================
-- 2. Fix active_customers view
-- ============================================
DROP VIEW IF EXISTS public.active_customers CASCADE;

CREATE OR REPLACE VIEW public.active_customers
WITH (security_invoker = true)
AS
SELECT *
FROM public.customers
ORDER BY created_at DESC;

GRANT SELECT ON public.active_customers TO authenticated;

COMMENT ON VIEW public.active_customers IS 
'View showing all customers. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';

-- ============================================
-- 3. Fix failed_audit_logs view
-- ============================================
DROP VIEW IF EXISTS public.failed_audit_logs CASCADE;

CREATE OR REPLACE VIEW public.failed_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
WHERE action LIKE '%failed%' OR action LIKE '%error%'
ORDER BY created_at DESC;

GRANT SELECT ON public.failed_audit_logs TO authenticated;

COMMENT ON VIEW public.failed_audit_logs IS 
'View showing failed/error audit log entries. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';

-- ============================================
-- 4. Fix active_profiles view
-- ============================================
DROP VIEW IF EXISTS public.active_profiles CASCADE;

CREATE OR REPLACE VIEW public.active_profiles
WITH (security_invoker = true)
AS
SELECT *
FROM public.profiles
ORDER BY created_at DESC;

GRANT SELECT ON public.active_profiles TO authenticated;

COMMENT ON VIEW public.active_profiles IS 
'View showing all profiles. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';
