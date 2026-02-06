-- Migration: Add description and specifications to products table
-- Add description and specifications columns to products table

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS specifications TEXT;

-- Add comments for documentation
COMMENT ON COLUMN products.description IS 'Detailed product description';
COMMENT ON COLUMN products.specifications IS 'Technical specifications and usage instructions';

-- Migration: Update orders status enum
-- Step 1: Drop the old constraint first
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Update existing order statuses to new workflow
UPDATE orders SET status = 'ordered' WHERE status = 'pending';
UPDATE orders SET status = 'paid' WHERE status = 'processing';
-- 'completed' stays as 'completed'
-- 'cancelled' stays as 'cancelled'
-- 'shipping' stays as 'shipping'

-- Step 3: Add new constraint with updated status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('draft', 'ordered', 'shipping', 'paid', 'completed', 'cancelled'));

-- Add comment for documentation
COMMENT ON COLUMN orders.status IS 'Order status: draft -> ordered -> shipping -> paid -> completed';

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_sale_id ON orders(sale_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_sale ON customers(assigned_sale);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('description', 'specifications');

SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'orders_status_check';
