-- Script to create a warehouse user
-- Run this after the warehouse migration is complete

-- Step 1: Create user in auth.users (Supabase Auth)
-- Note: This needs to be done via Supabase Dashboard or API
-- Go to: Authentication > Users > Add User
-- Email: warehouse@appejv.com
-- Password: (set a strong password)
-- Auto Confirm User: Yes

-- Step 2: After creating the auth user, get the user ID and insert profile
-- Replace [USER_ID] with the actual UUID from auth.users

-- Example: Insert warehouse profile
-- First, find the user ID:
SELECT id, email FROM auth.users WHERE email = 'warehouse@appejv.com';

-- Then insert/update the profile (replace [USER_ID] with actual ID):
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
    '[USER_ID]',  -- Replace with actual user ID from above query
    'warehouse@appejv.com',
    'Nhân viên Kho',
    'warehouse',
    NOW(),
    NOW()
)
ON CONFLICT (id) 
DO UPDATE SET
    role = 'warehouse',
    full_name = 'Nhân viên Kho',
    updated_at = NOW();

-- Step 3: Verify the user was created correctly
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at
FROM public.profiles p
WHERE p.role = 'warehouse';

-- Step 4: Test permissions (login as warehouse user first)
-- These queries should work:
SELECT COUNT(*) FROM orders WHERE status = 'ordered';
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM profiles WHERE role IN ('customer', 'sale');

-- These should fail or be restricted:
-- INSERT INTO products (name, price) VALUES ('Test', 100);  -- Should fail
-- UPDATE products SET price = 999 WHERE id = 1;  -- Should fail
-- UPDATE orders SET total_amount = 999 WHERE id = 1;  -- Should fail
