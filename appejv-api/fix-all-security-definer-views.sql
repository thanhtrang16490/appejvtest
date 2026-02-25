-- Fix All Security Definer Views
-- Run this in Supabase SQL Editor to fix all views at once

-- ============================================
-- 1. Fix recent_audit_logs view
-- ============================================
DROP VIEW IF EXISTS public.recent_audit_logs CASCADE;

CREATE OR REPLACE VIEW public.recent_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
ORDER BY created_at DESC
LIMIT 100;

GRANT SELECT ON public.recent_audit_logs TO authenticated;

COMMENT ON VIEW public.recent_audit_logs IS 
'View showing recent audit log entries. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';

-- ============================================
-- 2. Fix active_orders view
-- ============================================
DROP VIEW IF EXISTS public.active_orders CASCADE;

CREATE OR REPLACE VIEW public.active_orders
WITH (security_invoker = true)
AS
SELECT *
FROM public.orders
WHERE status NOT IN ('completed', 'cancelled', 'delivered')
ORDER BY created_at DESC;

GRANT SELECT ON public.active_orders TO authenticated;

COMMENT ON VIEW public.active_orders IS 
'View showing active orders (not completed, cancelled, or delivered). Uses SECURITY INVOKER to enforce RLS policies of the querying user.';

-- ============================================
-- 3. Fix security_audit_logs view
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
-- 4. Fix active_customers view
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
-- 5. Fix failed_audit_logs view
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
-- 6. Fix active_profiles view
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

-- ============================================
-- Verify all views are fixed
-- ============================================
SELECT 
  schemaname,
  viewname,
  CASE 
    WHEN definition LIKE '%security_invoker%' THEN '✅ SECURITY INVOKER (Safe)'
    ELSE '⚠️ SECURITY DEFINER (Warning)'
  END as security_mode
FROM pg_views 
WHERE schemaname = 'public'
  AND viewname IN (
    'recent_audit_logs', 
    'active_orders', 
    'security_audit_logs',
    'active_customers',
    'failed_audit_logs',
    'active_profiles'
  )
ORDER BY viewname;

-- ============================================
-- Check for any other SECURITY DEFINER views
-- ============================================
SELECT 
  schemaname,
  viewname,
  '⚠️ May need fixing' as status
FROM pg_views 
WHERE schemaname = 'public'
  AND definition NOT LIKE '%security_invoker%'
  AND viewname NOT LIKE 'pg_%'
ORDER BY viewname;
