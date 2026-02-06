-- ============================================
-- Create order_items table (SIMPLE VERSION)
-- ============================================

-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_order DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Add comments for documentation
COMMENT ON TABLE order_items IS 'Order line items - products in each order';
COMMENT ON COLUMN order_items.order_id IS 'Reference to the order';
COMMENT ON COLUMN order_items.product_id IS 'Reference to the product';
COMMENT ON COLUMN order_items.quantity IS 'Quantity of product ordered';
COMMENT ON COLUMN order_items.price_at_order IS 'Product price at the time of order (historical price)';

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_items (SIMPLE VERSION)

-- Admin can do everything
CREATE POLICY "Admin full access to order_items"
    ON order_items
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Sale can view their own order items
CREATE POLICY "Sale can view own order items"
    ON order_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.sale_id = auth.uid()
        )
    );

-- Sale Admin can view all order items
CREATE POLICY "Sale Admin can view all order items"
    ON order_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'sale_admin'
        )
    );

-- Sale can insert order items for their own orders
CREATE POLICY "Sale can insert own order items"
    ON order_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.sale_id = auth.uid()
        )
    );

-- Sale Admin can insert any order items
CREATE POLICY "Sale Admin can insert order items"
    ON order_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'sale_admin'
        )
    );

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- Success message
SELECT 'order_items table created successfully!' as message;
