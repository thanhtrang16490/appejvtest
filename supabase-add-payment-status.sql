-- ============================================
-- Add payment_status column to orders table
-- ============================================

-- Add payment_status column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid'));

-- Add comment for documentation
COMMENT ON COLUMN orders.payment_status IS 'Payment status: unpaid or paid';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'payment_status';

-- Success message
SELECT 'payment_status column added successfully!' as message;
