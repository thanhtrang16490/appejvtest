# Orders Foreign Key Fix

## Vấn đề

Sau khi chạy migration 19 và 20, customers vẫn không thể tạo orders với lỗi foreign key constraint.

### Lỗi

```
Error creating order: {
  "code": "23503", 
  "details": "Key is not present in table \"profiles\".", 
  "hint": null, 
  "message": "insert or update on table \"orders\" violates foreign key constraint \"fk_orders_customer\""
}
```

### Nguyên nhân

Bảng `orders` có foreign key constraint `fk_orders_customer` vẫn reference đến bảng `profiles`:

```sql
-- ❌ Hiện tại (SAI)
orders.customer_id -> profiles.id
```

Nhưng sau migration 10, `customer_id` nên reference đến bảng `customers`:

```sql
-- ✅ Cần phải (ĐÚNG)
orders.customer_id -> customers.id
```

Khi customer tạo order với `customer_id` từ bảng `customers`, database check foreign key và không tìm thấy ID đó trong bảng `profiles`, nên báo lỗi.

## Giải pháp

### Migration 21: Fix Orders Customer Foreign Key

File: `migrations/21_fix_orders_customer_fk.sql`

Các bước:
1. Drop foreign key constraint cũ (reference đến profiles)
2. Tạo foreign key constraint mới (reference đến customers)
3. Thêm index cho performance
4. Verify constraint mới

## Cách chạy

### Option 1: Bash Script (Recommended)

```bash
cd appejv-api
chmod +x run-orders-customer-fk-fix.sh
./run-orders-customer-fk-fix.sh
```

### Option 2: Direct SQL

```bash
cd appejv-api
psql "$SUPABASE_DB_URL" -f migrations/21_fix_orders_customer_fk.sql
```

### Option 3: Supabase Dashboard

1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy nội dung file `migrations/21_fix_orders_customer_fk.sql`
4. Paste và Run

## Verification

Sau khi chạy migration, verify foreign key:

```sql
SELECT 
  conname AS constraint_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint 
WHERE conrelid = 'orders'::regclass 
  AND contype = 'f' 
  AND conname LIKE '%customer%';
```

Kết quả mong đợi:
```
constraint_name      | referenced_table
---------------------|------------------
fk_orders_customer   | customers
```

## Testing

1. Đăng nhập với user customer trong appejv-expo
2. Vào trang Selling (Đặt hàng)
3. Thêm sản phẩm vào giỏ
4. Nhấn "Xong" để tạo order
5. Verify order được tạo thành công
6. Check console không có lỗi foreign key

## Migration Sequence

Thứ tự chạy migrations (QUAN TRỌNG!):

1. ✅ Migration 10: `10_separate_customers_table.sql` - Tách customers table
2. ✅ Migration 11: `11_add_user_id_to_customers.sql` - Thêm user_id link
3. ✅ Migration 19: `19_allow_customer_self_registration.sql` - Customer self-registration
4. ✅ Migration 20: `20_fix_customer_orders_policies.sql` - Fix orders RLS policies
5. ⚠️ Migration 21: `21_fix_orders_customer_fk.sql` - Fix orders FK (THIS ONE - REQUIRED!)

## Impact

### Before Migration 21
- ❌ Customers cannot create orders (FK violation)
- ❌ Cannot insert orders with customer_id from customers table
- ✅ Can view dashboard
- ✅ Can browse products

### After Migration 21
- ✅ Customers can create orders
- ✅ Orders properly reference customers table
- ✅ All customer features work correctly
- ✅ Data integrity maintained

## Data Migration

⚠️ **Important**: Nếu có existing orders với customer_id từ profiles:

```sql
-- Check existing orders
SELECT 
  o.id,
  o.customer_id,
  CASE 
    WHEN EXISTS (SELECT 1 FROM customers WHERE id = o.customer_id) THEN 'customers'
    WHEN EXISTS (SELECT 1 FROM profiles WHERE id = o.customer_id) THEN 'profiles'
    ELSE 'orphaned'
  END AS customer_id_source
FROM orders o
LIMIT 10;
```

Nếu có orders với customer_id từ profiles, cần migrate data trước:

```sql
-- Migrate orders from profiles to customers
-- (Only if you have existing orders with customer_id from profiles)
UPDATE orders o
SET customer_id = c.id
FROM profiles p
JOIN customers c ON c.user_id = p.id
WHERE o.customer_id = p.id
  AND p.role = 'customer'
  AND EXISTS (SELECT 1 FROM customers WHERE user_id = p.id);
```

## Rollback (nếu cần)

Nếu cần rollback (không khuyến khích):

```sql
BEGIN;

-- Drop new FK
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_customer;

-- Restore old FK to profiles
ALTER TABLE orders 
  ADD CONSTRAINT fk_orders_customer 
  FOREIGN KEY (customer_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

COMMIT;
```

⚠️ **Warning**: Rollback sẽ làm customers không thể tạo orders nữa!

## Notes

- Migration này PHẢI chạy sau migration 19 và 20
- Không ảnh hưởng đến existing orders (nếu data đã được migrate đúng)
- Foreign key có ON DELETE CASCADE để tự động xóa orders khi customer bị xóa
- Index được tạo để improve query performance
