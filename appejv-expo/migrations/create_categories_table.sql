-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read for authenticated users" ON categories;
DROP POLICY IF EXISTS "Allow insert for admin/sale_admin" ON categories;
DROP POLICY IF EXISTS "Allow update for admin/sale_admin" ON categories;
DROP POLICY IF EXISTS "Allow delete for admin/sale_admin" ON categories;

-- RLS Policies
CREATE POLICY "Allow read for authenticated users"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for admin/sale_admin"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'sale_admin')
    )
  );

CREATE POLICY "Allow update for admin/sale_admin"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'sale_admin')
    )
  );

CREATE POLICY "Allow delete for admin/sale_admin"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'sale_admin')
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default categories
INSERT INTO categories (name, description) VALUES
  ('Thức ăn chăn nuôi', 'Các loại thức ăn cho gia súc, gia cầm'),
  ('Thuốc thú y', 'Thuốc điều trị và phòng bệnh cho động vật'),
  ('Vaccine', 'Vaccine phòng bệnh cho gia súc, gia cầm'),
  ('Thiết bị chăn nuôi', 'Dụng cụ và thiết bị phục vụ chăn nuôi'),
  ('Phụ gia thức ăn', 'Vitamin, khoáng chất, chất bổ sung'),
  ('Hóa chất', 'Hóa chất khử trùng, vệ sinh chuồng trại')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions
GRANT ALL ON categories TO authenticated;
GRANT ALL ON categories TO service_role;
