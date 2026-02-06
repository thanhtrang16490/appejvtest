-- ============================================
-- STEP 1: Add new columns to products table
-- ============================================
-- Run this first, it's safe and won't affect existing data

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS specifications TEXT;

COMMENT ON COLUMN products.description IS 'Detailed product description';
COMMENT ON COLUMN products.specifications IS 'Technical specifications and usage instructions';

-- Verify Step 1
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('description', 'specifications');

-- ============================================
-- STEP 2: Drop old constraint on orders
-- ============================================
-- This removes the old constraint that's blocking us

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Verify Step 2 - should return no rows
SELECT constraint_name
FROM information_schema.check_constraints
WHERE constraint_name = 'orders_status_check';

-- ============================================
-- STEP 3: Update existing order statuses
-- ============================================
-- Convert old status values to new ones

-- Check current status values first
SELECT DISTINCT status, COUNT(*) 
FROM orders 
GROUP BY status;

-- Update to new status values
UPDATE orders SET status = 'ordered' WHERE status = 'pending';
UPDATE orders SET status = 'paid' WHERE status = 'processing';

-- Verify Step 3 - check new status distribution
SELECT DISTINCT status, COUNT(*) 
FROM orders 
GROUP BY status;

-- ============================================
-- STEP 4: Add new constraint with new values
-- ============================================
-- Now add the constraint with the new status values

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('draft', 'ordered', 'shipping', 'paid', 'completed', 'cancelled'));

COMMENT ON COLUMN orders.status IS 'Order status: draft -> ordered -> shipping -> paid -> completed';

-- Verify Step 4
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'orders_status_check';

-- ============================================
-- STEP 5: Add performance indexes
-- ============================================
-- These improve query performance

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_sale_id ON orders(sale_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_sale ON customers(assigned_sale);

-- Verify Step 5
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('products', 'orders', 'customers')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================
-- FINAL VERIFICATION
-- ============================================

-- Check products table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check orders constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'orders_status_check';

-- Check order status distribution
SELECT status, COUNT(*) as count
FROM orders 
GROUP BY status
ORDER BY count DESC;

-- Success message
SELECT 'Migration completed successfully!' as message;
