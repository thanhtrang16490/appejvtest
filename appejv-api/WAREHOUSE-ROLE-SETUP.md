# Warehouse Role Setup Guide

## Bước 1: Thêm 'warehouse' vào role column

### Option A: Nếu role là TEXT type
Không cần làm gì, có thể dùng trực tiếp giá trị 'warehouse'

### Option B: Nếu role là ENUM type
Cần thêm 'warehouse' vào enum values:

#### Cách 1: Qua Supabase Dashboard (Khuyến nghị)
1. Vào Supabase Dashboard
2. Database > Tables > profiles
3. Click vào column "role"
4. Thêm 'warehouse' vào danh sách allowed values
5. Save

#### Cách 2: Qua SQL
```sql
-- Kiểm tra xem role có phải enum không
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname LIKE '%role%';

-- Nếu có enum, thêm warehouse value
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'warehouse';
-- Hoặc nếu enum có tên khác:
ALTER TYPE [tên_enum] ADD VALUE IF NOT EXISTS 'warehouse';
```

#### Cách 3: Đổi sang TEXT type (Nếu cần)
```sql
-- Backup data trước
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Đổi column type
ALTER TABLE profiles 
ALTER COLUMN role TYPE TEXT;

-- Verify
SELECT DISTINCT role FROM profiles;
```

## Bước 2: Chạy Migration

```bash
cd appejv-api
./run-warehouse-migration.sh
```

Hoặc:

```bash
psql "$SUPABASE_DB_URL" -f migrations/09_add_warehouse_role.sql
```

## Bước 3: Tạo User Warehouse Test

### Qua Supabase Dashboard:
1. Authentication > Users > Add User
2. Email: warehouse@test.com
3. Password: (tạo password mạnh)
4. Confirm

### Update Profile:
```sql
-- Tìm user_id vừa tạo
SELECT id, email FROM auth.users WHERE email = 'warehouse@test.com';

-- Update profile
UPDATE profiles 
SET 
    role = 'warehouse',
    full_name = 'Nhân viên Kho',
    updated_at = NOW()
WHERE id = '[user_id_vừa_tìm]';
```

## Bước 4: Test Permissions

### Test 1: Login
- Đăng nhập với warehouse@test.com
- Kiểm tra redirect đến /(warehouse)/dashboard

### Test 2: View Orders
```sql
-- Login as warehouse user, then:
SELECT * FROM orders WHERE status = 'ordered';
-- Should return results
```

### Test 3: Update Order Status
```sql
-- Should work:
UPDATE orders 
SET status = 'shipping', updated_at = NOW()
WHERE id = [order_id] AND status = 'ordered';

-- Should fail:
UPDATE orders 
SET total_amount = 1000000
WHERE id = [order_id];
-- Error: Warehouse role can only update status field
```

### Test 4: View Products
```sql
SELECT * FROM products;
-- Should return all products
```

### Test 5: Update Product Stock
```sql
-- Should work:
UPDATE products 
SET stock = 100, updated_at = NOW()
WHERE id = [product_id];

-- Should fail:
UPDATE products 
SET price = 50000
WHERE id = [product_id];
-- Error: Warehouse role can only update stock field
```

## Troubleshooting

### Lỗi: "type user_role does not exist"
- Database không có enum user_role
- Giải pháp: Thêm warehouse value qua Dashboard (Bước 1)

### Lỗi: "new row violates check constraint"
- Role column có constraint không cho phép 'warehouse'
- Giải pháp: Xóa constraint hoặc thêm 'warehouse' vào allowed values

### Lỗi: "permission denied for table"
- RLS policies chưa được tạo
- Giải pháp: Chạy lại migration (Bước 2)

### User không thấy data
- Kiểm tra role đã được set đúng chưa:
```sql
SELECT id, email, role FROM profiles WHERE id = auth.uid();
```

## Verify Setup

Chạy script này để verify:

```sql
-- 1. Check if warehouse role exists in profiles
SELECT COUNT(*) as warehouse_users 
FROM profiles 
WHERE role = 'warehouse';

-- 2. Check policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE policyname LIKE '%warehouse%';

-- 3. Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%warehouse%';

-- Expected results:
-- - At least 1 warehouse user
-- - 7 warehouse policies
-- - 2 warehouse triggers
```

## Security Notes

Warehouse role có các giới hạn:
- ✅ Xem tất cả orders, products, customers
- ✅ Cập nhật order status (ordered → shipping only)
- ✅ Cập nhật product stock only
- ❌ Không được tạo/xóa orders
- ❌ Không được tạo/xóa/sửa products (trừ stock)
- ❌ Không được xem/sửa users
- ❌ Không được xem báo cáo tài chính
