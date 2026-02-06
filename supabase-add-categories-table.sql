-- ============================================
-- Create categories table and update products
-- ============================================

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE categories IS 'Product categories for organizing inventory';
COMMENT ON COLUMN categories.name IS 'Category name (unique)';
COMMENT ON COLUMN categories.display_order IS 'Order for displaying categories (lower number = higher priority)';

-- Step 2: Insert default categories
INSERT INTO categories (name, description, display_order) VALUES
    ('Thức ăn heo', 'Thức ăn chăn nuôi cho heo', 1),
    ('Thức ăn gia cầm', 'Thức ăn cho gà, vịt, ngan, ngỗng', 2),
    ('Thức ăn thủy sản', 'Thức ăn cho cá, tôm', 3),
    ('Phụ gia', 'Vitamin, khoáng chất, enzyme', 4),
    ('Thuốc thú y', 'Thuốc điều trị và phòng bệnh', 5)
ON CONFLICT (name) DO NOTHING;

-- Step 3: Update products table to use category_id instead of category text
-- First, add the new column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id);

-- Step 4: Migrate existing category data
-- Map text categories to category IDs
UPDATE products 
SET category_id = (
    SELECT id FROM categories 
    WHERE categories.name = products.category
)
WHERE products.category IS NOT NULL;

-- Step 5: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Step 6: Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories - everyone can read
CREATE POLICY "Anyone can view categories"
    ON categories
    FOR SELECT
    TO authenticated
    USING (true);

-- Only admin can modify categories
CREATE POLICY "Admin can manage categories"
    ON categories
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Step 7: Verify the changes
SELECT 
    c.id,
    c.name,
    c.display_order,
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.deleted_at IS NULL
GROUP BY c.id, c.name, c.display_order
ORDER BY c.display_order;

-- Success message
SELECT 'Categories table created and products updated successfully!' as message;
