-- Verification script for customers table migration

-- 1. Check customers table exists and has data
SELECT 
    'Customers table' as check_name,
    COUNT(*) as count,
    'Should have migrated customer records' as expected
FROM public.customers;

-- 2. Check sample customer data
SELECT 
    'Sample customers' as check_name,
    id, email, full_name, phone, assigned_to
FROM public.customers
LIMIT 5;

-- 3. Compare counts (should be equal if all migrated)
SELECT 
    'Customer count comparison' as check_name,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'customer') as profiles_customers,
    (SELECT COUNT(*) FROM public.customers) as customers_table,
    CASE 
        WHEN (SELECT COUNT(*) FROM public.profiles WHERE role = 'customer') = 
             (SELECT COUNT(*) FROM public.customers)
        THEN '✓ Counts match'
        ELSE '✗ Counts do not match'
    END as status;

-- 4. Check RLS policies on customers table
SELECT 
    'RLS Policies' as check_name,
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'customers'
ORDER BY policyname;

-- 5. Check indexes on customers table
SELECT 
    'Indexes' as check_name,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'customers'
AND schemaname = 'public';

-- 6. Check customers with assigned sales
SELECT 
    'Customers with assigned sales' as check_name,
    COUNT(*) as count,
    COUNT(DISTINCT assigned_to) as unique_sales
FROM public.customers
WHERE assigned_to IS NOT NULL;

-- 7. Check email formats
SELECT 
    'Email formats' as check_name,
    COUNT(*) as total,
    COUNT(CASE WHEN email LIKE '%@customer.local' THEN 1 END) as default_emails,
    COUNT(CASE WHEN email NOT LIKE '%@customer.local' THEN 1 END) as real_emails
FROM public.customers;

-- 8. Check foreign key to profiles (assigned_to)
SELECT 
    'Foreign key check' as check_name,
    c.id as customer_id,
    c.full_name as customer_name,
    c.assigned_to as sale_id,
    p.full_name as sale_name,
    p.role as sale_role
FROM public.customers c
LEFT JOIN public.profiles p ON c.assigned_to = p.id
WHERE c.assigned_to IS NOT NULL
LIMIT 5;

-- 9. Check triggers
SELECT 
    'Triggers' as check_name,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'customers'
AND trigger_schema = 'public';

-- 10. Test RLS - Check if policies work (run as different users)
-- This shows the policy definitions
SELECT 
    'RLS Policy Summary' as check_name,
    COUNT(*) as total_policies,
    STRING_AGG(policyname, ', ') as policy_names
FROM pg_policies 
WHERE tablename = 'customers';

-- Summary
SELECT 
    '=== MIGRATION SUMMARY ===' as summary,
    (SELECT COUNT(*) FROM public.customers) as total_customers,
    (SELECT COUNT(*) FROM public.customers WHERE assigned_to IS NOT NULL) as assigned_customers,
    (SELECT COUNT(DISTINCT assigned_to) FROM public.customers WHERE assigned_to IS NOT NULL) as unique_sales,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'customers') as rls_policies,
    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'customers' AND schemaname = 'public') as indexes;
