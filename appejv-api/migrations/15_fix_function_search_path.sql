-- Fix Function Search Path Mutable Issue
-- Add SET search_path to all functions to prevent search path injection attacks

-- This migration adds "SET search_path = public, pg_temp" to all functions
-- This prevents malicious users from hijacking function behavior by manipulating search_path

-- Note: You need to recreate each function with the same definition but add SET search_path
-- Since we don't have the original function definitions, this file provides a template

-- Template for fixing a function:
-- ALTER FUNCTION function_name() SET search_path = public, pg_temp;

-- However, ALTER FUNCTION SET search_path only works if the function already exists
-- For functions created with CREATE FUNCTION, we need to use this syntax:

-- List of all functions that need fixing:
DO $$
DECLARE
    func_name TEXT;
    func_names TEXT[] := ARRAY[
        'cleanup_expired_reset_tokens',
        'generate_slug',
        'auto_generate_product_slug',
        'update_notifications_updated_at',
        'create_notification',
        'notify_admins',
        'notify_assigned_sale',
        'validate_warehouse_order_update',
        'get_team_members',
        'soft_delete_product',
        'restore_product',
        'soft_delete_customer',
        'restore_customer',
        'soft_delete_profile',
        'restore_profile',
        'cleanup_old_deleted_products',
        'cleanup_old_deleted_customers',
        'prevent_update_deleted_records',
        'validate_warehouse_product_update',
        'update_customers_updated_at',
        'log_audit_event',
        'get_user_activity_summary',
        'cleanup_old_audit_logs',
        'log_product_changes',
        'log_customer_changes',
        'log_order_changes'
    ];
BEGIN
    FOREACH func_name IN ARRAY func_names
    LOOP
        BEGIN
            -- Try to set search_path for the function
            -- This works for functions with any signature
            EXECUTE format('
                ALTER FUNCTION public.%I SET search_path = public, pg_temp
            ', func_name);
            
            RAISE NOTICE 'Fixed search_path for function: %', func_name;
        EXCEPTION
            WHEN undefined_function THEN
                RAISE NOTICE 'Function % does not exist or has multiple signatures, skipping', func_name;
            WHEN OTHERS THEN
                RAISE NOTICE 'Error fixing function %: %', func_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Verify the fix
SELECT 
    p.proname as function_name,
    CASE 
        WHEN p.proconfig IS NOT NULL AND 'search_path=public, pg_temp' = ANY(p.proconfig) THEN '✅ Fixed'
        WHEN p.proconfig IS NOT NULL THEN '⚠️ Has config but not fixed'
        ELSE '❌ Not fixed'
    END as status,
    p.proconfig
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'cleanup_expired_reset_tokens',
    'generate_slug',
    'auto_generate_product_slug',
    'update_notifications_updated_at',
    'create_notification',
    'notify_admins',
    'notify_assigned_sale',
    'validate_warehouse_order_update',
    'get_team_members',
    'soft_delete_product',
    'restore_product',
    'soft_delete_customer',
    'restore_customer',
    'soft_delete_profile',
    'restore_profile',
    'cleanup_old_deleted_products',
    'cleanup_old_deleted_customers',
    'prevent_update_deleted_records',
    'validate_warehouse_product_update',
    'update_customers_updated_at',
    'log_audit_event',
    'get_user_activity_summary',
    'cleanup_old_audit_logs',
    'log_product_changes',
    'log_customer_changes',
    'log_order_changes'
  )
ORDER BY p.proname;
