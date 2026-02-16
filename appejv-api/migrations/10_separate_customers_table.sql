-- Migration: Separate customers into dedicated table
-- Description: Create customers table and migrate customer data from profiles

-- Step 1: Drop existing customers view if exists
DROP VIEW IF EXISTS public.customers CASCADE;

-- Step 2: Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    notes TEXT,
    company TEXT,
    tax_code TEXT,
    
    -- Constraints
    CONSTRAINT customers_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON public.customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);

-- Step 4: Migrate existing customer data from profiles
-- Note: Set default email using UUID since profiles don't have email
INSERT INTO public.customers (id, email, full_name, phone, address, assigned_to, created_at, updated_at)
SELECT 
    p.id,
    COALESCE(u.email, p.id::text || '@customer.local') as email, -- Get from auth.users or use default
    p.full_name,
    p.phone,
    p.address,
    p.manager_id as assigned_to,
    p.created_at,
    p.created_at as updated_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'customer'
ON CONFLICT (id) DO NOTHING;

-- Step 5: Update orders table to use customer_id properly
-- (orders.customer_id should already reference profiles.id, now it will reference customers.id)
-- No change needed if foreign key is flexible

-- Step 5: Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for customers table

-- Admin can do everything
CREATE POLICY "admin_all_customers" ON public.customers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Sale can view their assigned customers
CREATE POLICY "sale_view_assigned_customers" ON public.customers
    FOR SELECT
    TO authenticated
    USING (
        assigned_to = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('sale', 'sale_admin')
        )
    );

-- Sale Admin can view team customers
CREATE POLICY "sale_admin_view_team_customers" ON public.customers
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'sale_admin'
            AND (
                assigned_to = auth.uid()
                OR assigned_to IN (
                    SELECT id FROM public.profiles
                    WHERE manager_id = auth.uid()
                )
            )
        )
    );

-- Sale can create customers
CREATE POLICY "sale_create_customers" ON public.customers
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('sale', 'sale_admin')
        )
    );

-- Sale can update their assigned customers
CREATE POLICY "sale_update_assigned_customers" ON public.customers
    FOR UPDATE
    TO authenticated
    USING (
        assigned_to = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'sale_admin')
        )
    );

-- Warehouse can view all customers (for order processing)
CREATE POLICY "warehouse_view_customers" ON public.customers
    FOR SELECT
    TO authenticated
    USING (is_warehouse());

-- Step 7: Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at_trigger
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

-- Step 8: Add comments
COMMENT ON TABLE public.customers IS 'Dedicated table for customer data, separate from system users';
COMMENT ON COLUMN public.customers.assigned_to IS 'Sale person assigned to this customer';
COMMENT ON COLUMN public.customers.email IS 'Customer email (not for login, just contact)';

-- Step 9: Optional - Remove customer role from profiles
-- WARNING: This will delete customer profiles! Only run if you're sure.
-- DELETE FROM public.profiles WHERE role = 'customer';

-- Step 10: Update role enum to remove customer (optional)
-- This requires careful consideration as it's a breaking change
-- ALTER TYPE user_role RENAME TO user_role_old;
-- CREATE TYPE user_role AS ENUM ('admin', 'sale_admin', 'sale', 'warehouse');
-- ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::text::user_role;
-- DROP TYPE user_role_old;

-- Migration completed
-- Next steps:
-- 1. Update application code to use customers table
-- 2. Update orders queries to join with customers table
-- 3. Update customer management UI
-- 4. Test all customer-related features
-- 5. Consider removing customer role from profiles (Step 9)
