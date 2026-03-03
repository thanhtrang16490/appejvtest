-- Migration 21: Fix orders.customer_id foreign key to reference customers table
-- Currently it references profiles, but after migration 10 it should reference customers

BEGIN;

-- Step 1: Check current foreign key constraint
DO $$ 
BEGIN
  RAISE NOTICE 'Current foreign key constraints on orders table:';
END $$;

SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table,
  a.attname AS column_name,
  af.attname AS referenced_column
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE c.conrelid = 'orders'::regclass
  AND c.contype = 'f'
  AND a.attname = 'customer_id';

-- Step 2: Drop old foreign key constraint if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_customer;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

-- Step 3: Add new foreign key constraint to customers table
ALTER TABLE orders 
  ADD CONSTRAINT fk_orders_customer 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

-- Step 4: Add index for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Step 5: Add comment
COMMENT ON CONSTRAINT fk_orders_customer ON orders IS 
  'Foreign key to customers table (not profiles)';

COMMIT;

-- Verification
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table,
  a.attname AS column_name,
  af.attname AS referenced_column
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE c.conrelid = 'orders'::regclass
  AND c.contype = 'f'
  AND a.attname = 'customer_id';
