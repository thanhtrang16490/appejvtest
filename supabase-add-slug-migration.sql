-- Migration: Add slug column to products table

-- Step 1: Add slug column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase
    slug := LOWER(text_input);
    
    -- Replace Vietnamese characters
    slug := TRANSLATE(slug, 
        'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
    );
    
    -- Replace spaces and special characters with hyphens
    slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading/trailing hyphens
    slug := TRIM(BOTH '-' FROM slug);
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 3: Generate slugs for existing products
UPDATE products 
SET slug = generate_slug(name) || '-' || id
WHERE slug IS NULL;

-- Step 4: Add unique constraint on slug
ALTER TABLE products 
ADD CONSTRAINT products_slug_unique UNIQUE (slug);

-- Step 5: Add index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Step 6: Create trigger to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if slug is null or empty
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_slug(NEW.name) || '-' || NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_auto_generate_product_slug ON products;

-- Create trigger
CREATE TRIGGER trigger_auto_generate_product_slug
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_product_slug();

-- Add comment
COMMENT ON COLUMN products.slug IS 'URL-friendly slug for SEO (auto-generated from name)';

-- Verify the changes
SELECT id, name, slug 
FROM products 
ORDER BY id 
LIMIT 10;

-- Check constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'products' 
AND constraint_name = 'products_slug_unique';
