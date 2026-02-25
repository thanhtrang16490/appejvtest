-- Final Fix for All Security Definer Views
-- This version explicitly drops and recreates views

-- ============================================
-- 1. Fix recent_audit_logs
-- ============================================
DROP VIEW IF EXISTS public.recent_audit_logs CASCADE;

CREATE VIEW public.recent_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
ORDER BY created_at DESC
LIMIT 100;

GRANT SELECT ON public.recent_audit_logs TO authenticated;

-- ============================================
-- 2. Fix active_orders
-- ============================================
DROP VIEW IF EXISTS public.active_orders CASCADE;

CREATE VIEW public.active_orders
WITH (security_invoker = true)
AS
SELECT *
FROM public.orders
WHERE status NOT IN ('completed', 'cancelled', 'delivered')
ORDER BY created_at DESC;

GRANT SELECT ON public.active_orders TO authenticated;

-- ============================================
-- 3. Fix security_audit_logs
-- ============================================
DROP VIEW IF EXISTS public.security_audit_logs CASCADE;

CREATE VIEW public.security_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
WHERE action IN ('login', 'logout', 'password_change', 'permission_change', 'role_change')
ORDER BY created_at DESC;

GRANT SELECT ON public.security_audit_logs TO authenticated;

-- ============================================
-- 4. Fix active_customers
-- ============================================
DROP VIEW IF EXISTS public.active_customers CASCADE;

CREATE VIEW public.active_customers
WITH (security_invoker = true)
AS
SELECT *
FROM public.customers
ORDER BY created_at DESC;

GRANT SELECT ON public.active_customers TO authenticated;

-- ============================================
-- 5. Fix failed_audit_logs
-- ============================================
DROP VIEW IF EXISTS public.failed_audit_logs CASCADE;

CREATE VIEW public.failed_audit_logs
WITH (security_invoker = true)
AS
SELECT *
FROM public.audit_logs
WHERE action LIKE '%failed%' OR action LIKE '%error%'
ORDER BY created_at DESC;

GRANT SELECT ON public.failed_audit_logs TO authenticated;

-- ============================================
-- 6. Fix active_profiles
-- ============================================
DROP VIEW IF EXISTS public.active_profiles CASCADE;

CREATE VIEW public.active_profiles
WITH (security_invoker = true)
AS
SELECT *
FROM public.profiles
ORDER BY created_at DESC;

GRANT SELECT ON public.active_profiles TO authenticated;

-- ============================================
-- Verify the fix using pg_views
-- ============================================
SELECT 
  schemaname,
  viewname,
  CASE 
    WHEN definition LIKE '%security_invoker%' OR definition LIKE '%security_invoker = true%' THEN '✅ SECURITY INVOKER'
    ELSE '⚠️ May need fixing'
  END as status
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
-- Alternative verification using pg_class
-- ============================================
SELECT 
  c.relname as viewname,
  CASE 
    WHEN c.reloptions::text LIKE '%security_invoker=true%' THEN '✅ SECURITY INVOKER'
    ELSE '⚠️ SECURITY DEFINER'
  END as security_mode,
  c.reloptions
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'v'
  AND c.relname IN (
    'recent_audit_logs', 
    'active_orders', 
    'security_audit_logs',
    'active_customers',
    'failed_audit_logs',
    'active_profiles'
  )
ORDER BY c.relname;
