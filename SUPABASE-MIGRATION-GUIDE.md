# Supabase Migration Guide

## Cập nhật Database Schema

### Các thay đổi trong migration này:

1. **Bảng `products`:**
   - Thêm cột `description` (TEXT) - Mô tả sản phẩm
   - Thêm cột `specifications` (TEXT) - Thông số kỹ thuật

2. **Bảng `orders`:**
   - Cập nhật status enum từ: `pending`, `processing`, `shipping`, `completed`, `cancelled`
   - Sang: `draft`, `ordered`, `shipping`, `paid`, `completed`, `cancelled`
   - Workflow mới: draft → ordered → shipping → paid → completed

3. **Indexes:**
   - Thêm index cho `products.category`
   - Thêm index cho `orders.status`
   - Thêm index cho `orders.sale_id`
   - Thêm index cho `customers.assigned_sale`

### Cách chạy migration:

#### Option 1: Sử dụng Supabase Dashboard (Khuyến nghị)

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** (biểu tượng database ở sidebar)
4. Tạo một query mới
5. Copy toàn bộ nội dung file `supabase-migrations.sql`
6. Paste vào SQL Editor
7. Click **Run** để thực thi

#### Option 2: Sử dụng Supabase CLI

```bash
# Cài đặt Supabase CLI (nếu chưa có)
npm install -g supabase

# Login vào Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Chạy migration
supabase db push
```

#### Option 3: Chạy từng phần (Nếu gặp lỗi)

Nếu gặp lỗi khi chạy toàn bộ, hãy chạy từng phần:

**Bước 1: Thêm cột mới cho products**
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS specifications TEXT;
```

**Bước 2: Cập nhật status cho orders**
```sql
-- Cập nhật dữ liệu hiện có
UPDATE orders SET status = 'ordered' WHERE status = 'pending';
UPDATE orders SET status = 'paid' WHERE status = 'processing';

-- Xóa constraint cũ
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Thêm constraint mới
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('draft', 'ordered', 'shipping', 'paid', 'completed', 'cancelled'));
```

**Bước 3: Thêm indexes**
```sql
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_sale_id ON orders(sale_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_sale ON customers(assigned_sale);
```

### Kiểm tra sau khi migration:

```sql
-- Kiểm tra cột mới trong products
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('description', 'specifications');

-- Kiểm tra constraint mới trong orders
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'orders_status_check';

-- Kiểm tra indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('products', 'orders', 'customers');
```

### Rollback (Nếu cần)

Nếu cần rollback các thay đổi:

```sql
-- Xóa cột mới từ products
ALTER TABLE products 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS specifications;

-- Khôi phục status cũ cho orders
UPDATE orders SET status = 'pending' WHERE status = 'ordered';
UPDATE orders SET status = 'processing' WHERE status = 'paid';

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'shipping', 'completed', 'cancelled'));

-- Xóa indexes
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_sale_id;
DROP INDEX IF EXISTS idx_customers_assigned_sale;
```

### Lưu ý quan trọng:

1. **Backup trước khi chạy:** Luôn backup database trước khi chạy migration
2. **Test trên staging:** Nên test trên môi trường staging trước
3. **Downtime:** Migration này không yêu cầu downtime
4. **Data migration:** Các đơn hàng hiện có sẽ được tự động chuyển đổi status
5. **RLS Policies:** Không ảnh hưởng đến Row Level Security policies hiện có

### Troubleshooting:

**Lỗi: "constraint already exists"**
- Bỏ qua, constraint đã tồn tại

**Lỗi: "column already exists"**
- Bỏ qua, cột đã tồn tại (do dùng IF NOT EXISTS)

**Lỗi: "permission denied"**
- Đảm bảo bạn có quyền admin trên database
- Sử dụng service role key nếu cần

### Hỗ trợ:

Nếu gặp vấn đề, kiểm tra:
1. Supabase logs trong Dashboard
2. PostgreSQL error messages
3. RLS policies có thể ảnh hưởng đến queries

---

**Ngày tạo:** 2026-02-07
**Version:** 1.0.0
**Tác giả:** APPE JV Development Team
