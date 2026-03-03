# Customer Orders RLS Policies Fix

## Vấn đề

Sau khi chạy migration 19 (customer self-registration), customers vẫn không thể tạo orders vì RLS policies của bảng `orders` vẫn đang check `customer_id = auth.uid()`.

### Lỗi

```
Error creating order: {"code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"orders\""}
```

### Nguyên nhân

Sau migration 10-11:
- `customer_id` trong orders table reference đến `customers.id` (UUID)
- Không còn reference trực tiếp đến `auth.uid()` nữa

Nhưng RLS policies vẫn đang check:
```sql
customer_id = auth.uid()  -- ❌ Sai
```

Cần check qua bảng customers:
```sql
EXISTS (
  SELECT 1 FROM customers
  WHERE customers.id = orders.customer_id
  AND customers.user_id = auth.uid()
)  -- ✅ Đúng
```

## Giải pháp

### Migration 20: Fix Customer Orders Policies

File: `migrations/20_fix_customer_orders_policies.sql`

Cập nhật 3 policies:
1. `customers_select_own_orders` - Xem orders của mình
2. `customers_insert_own_orders` - Tạo orders mới
3. `customers_update_own_orders` - Cập nhật orders của mình

Tất cả đều check qua `customers.user_id = auth.uid()` thay vì `customer_id = auth.uid()`

## Cách chạy

### Option 1: Bash Script (Recommended)

```bash
cd appejv-api
chmod +x run-customer-orders-policies-fix.sh
./run-customer-orders-policies-fix.sh
```

### Option 2: Direct SQL

```bash
cd appejv-api
psql "$SUPABASE_DB_URL" -f migrations/20_fix_customer_orders_policies.sql
```

### Option 3: Supabase Dashboard

1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy nội dung file `migrations/20_fix_customer_orders_policies.sql`
4. Paste và Run

## Verification

Sau khi chạy migration, verify policies:

```sql
SELECT 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'orders'
  AND policyname LIKE 'customers_%'
ORDER BY policyname;
```

Kết quả mong đợi:
- `customers_insert_own_orders` - INSERT
- `customers_select_own_orders` - SELECT  
- `customers_update_own_orders` - UPDATE

## Testing

1. Đăng nhập với user customer trong appejv-expo
2. Vào trang Selling (Đặt hàng)
3. Thêm sản phẩm vào giỏ
4. Nhấn "Xong" để tạo order
5. Verify order được tạo thành công
6. Check console không có lỗi RLS

## Related Migrations

- Migration 10: `10_separate_customers_table.sql` - Tách customers table
- Migration 11: `11_add_user_id_to_customers.sql` - Thêm user_id link
- Migration 19: `19_allow_customer_self_registration.sql` - Cho phép tự tạo customer record
- Migration 20: `20_fix_customer_orders_policies.sql` - Fix orders policies (THIS ONE)

## Notes

- Migration này PHẢI chạy sau migration 19
- Không ảnh hưởng đến sales/admin policies
- Chỉ update customer-related policies
- Backward compatible với existing orders

## Rollback (nếu cần)

Nếu cần rollback, restore policies cũ:

```sql
BEGIN;

DROP POLICY IF EXISTS "customers_insert_own_orders" ON orders;
DROP POLICY IF EXISTS "customers_select_own_orders" ON orders;
DROP POLICY IF EXISTS "customers_update_own_orders" ON orders;

-- Restore old policies (from migration 06)
CREATE POLICY "customers_select_own_orders"
  ON orders FOR SELECT
  USING (
    get_user_role() = 'customer'
    AND customer_id = auth.uid()
  );

CREATE POLICY "customers_insert_own_orders"
  ON orders FOR INSERT
  WITH CHECK (
    get_user_role() = 'customer'
    AND customer_id = auth.uid()
  );

CREATE POLICY "customers_update_own_orders"
  ON orders FOR UPDATE
  USING (
    get_user_role() = 'customer'
    AND customer_id = auth.uid()
  );

COMMIT;
```

⚠️ **Warning**: Rollback sẽ làm customers không thể tạo/xem orders nữa!
