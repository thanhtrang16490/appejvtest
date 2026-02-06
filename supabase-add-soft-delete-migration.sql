-- Migration: Add soft delete support to main tables

-- ============================================
-- STEP 1: Add deleted_at columns
-- ============================================

-- Add to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Add to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Add to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Add to orders table (optional - already has 'cancelled' status)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- ============================================
-- STEP 2: Add indexes for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- STEP 3: Add comments
-- ============================================

COMMENT ON COLUMN products.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';
COMMENT ON COLUMN customers.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';
COMMENT ON COLUMN profiles.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';
COMMENT ON COLUMN orders.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';

-- ============================================
-- STEP 4: Create helper functions
-- ============================================

-- Function to soft delete a product
CREATE OR REPLACE FUNCTION soft_delete_product(p_product_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE products 
    SET deleted_at = NOW() 
    WHERE id = p_product_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a product
CREATE OR REPLACE FUNCTION restore_product(p_product_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE products 
    SET deleted_at = NULL 
    WHERE id = p_product_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete a customer
CREATE OR REPLACE FUNCTION soft_delete_customer(p_customer_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE customers 
    SET deleted_at = NOW() 
    WHERE id = p_customer_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a customer
CREATE OR REPLACE FUNCTION restore_customer(p_customer_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE customers 
    SET deleted_at = NULL 
    WHERE id = p_customer_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete a profile (disable user)
CREATE OR REPLACE FUNCTION soft_delete_profile(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles 
    SET deleted_at = NOW() 
    WHERE id = p_user_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a profile (enable user)
CREATE OR REPLACE FUNCTION restore_profile(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles 
    SET deleted_at = NULL 
    WHERE id = p_user_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 5: Create views for active records only
-- ============================================

-- View for active products
CREATE OR REPLACE VIEW active_products AS
SELECT * FROM products WHERE deleted_at IS NULL;

-- View for active customers
CREATE OR REPLACE VIEW active_customers AS
SELECT * FROM customers WHERE deleted_at IS NULL;

-- View for active profiles
CREATE OR REPLACE VIEW active_profiles AS
SELECT * FROM profiles WHERE deleted_at IS NULL;

-- View for active orders
CREATE OR REPLACE VIEW active_orders AS
SELECT * FROM orders WHERE deleted_at IS NULL;

-- ============================================
-- STEP 6: Add comments to views
-- ============================================

COMMENT ON VIEW active_products IS 'View showing only non-deleted products';
COMMENT ON VIEW active_customers IS 'View showing only non-deleted customers';
COMMENT ON VIEW active_profiles IS 'View showing only non-deleted profiles';
COMMENT ON VIEW active_orders IS 'View showing only non-deleted orders';

-- ============================================
-- STEP 7: Create function to permanently delete old soft-deleted records
-- ============================================

-- Function to hard delete products that have been soft-deleted for more than X days
CREATE OR REPLACE FUNCTION cleanup_old_deleted_products(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM products 
    WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to hard delete customers that have been soft-deleted for more than X days
CREATE OR REPLACE FUNCTION cleanup_old_deleted_customers(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM customers 
    WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 8: Create trigger to prevent updates on deleted records
-- ============================================

CREATE OR REPLACE FUNCTION prevent_update_deleted_records()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot update deleted record. Restore it first.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products
DROP TRIGGER IF EXISTS trigger_prevent_update_deleted_products ON products;
CREATE TRIGGER trigger_prevent_update_deleted_products
    BEFORE UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION prevent_update_deleted_records();

-- Apply trigger to customers
DROP TRIGGER IF EXISTS trigger_prevent_update_deleted_customers ON customers;
CREATE TRIGGER trigger_prevent_update_deleted_customers
    BEFORE UPDATE ON customers
    FOR EACH ROW
    WHEN (OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION prevent_update_deleted_records();

-- ============================================
-- STEP 9: Verify the changes
-- ============================================

-- Check columns added
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name = 'deleted_at'
AND table_name IN ('products', 'customers', 'profiles', 'orders')
ORDER BY table_name;

-- Check indexes created
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE '%deleted_at%'
ORDER BY tablename;

-- Check views created
SELECT 
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name LIKE 'active_%'
ORDER BY table_name;

-- ============================================
-- STEP 10: Usage examples (commented out)
-- ============================================

/*
-- Soft delete a product
SELECT soft_delete_product(1);

-- Restore a product
SELECT restore_product(1);

-- Get all active products
SELECT * FROM active_products;

-- Get all products including deleted
SELECT * FROM products;

-- Get only deleted products
SELECT * FROM products WHERE deleted_at IS NOT NULL;

-- Cleanup old deleted records (older than 90 days)
SELECT cleanup_old_deleted_products(90);
SELECT cleanup_old_deleted_customers(90);
*/

-- Success message
SELECT 'Soft delete migration completed successfully!' as message;
SELECT 'Remember to update your application queries to filter by deleted_at IS NULL' as reminder;
