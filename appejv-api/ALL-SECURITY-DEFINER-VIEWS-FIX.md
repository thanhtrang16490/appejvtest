# Fix All Security Definer Views - Hướng dẫn

## Tổng quan
Supabase phát hiện 6 views được định nghĩa với `SECURITY DEFINER`, gây ra vấn đề bảo mật. Tất cả cần được sửa thành `SECURITY INVOKER`.

## Danh sách Views cần sửa

1. ✅ `recent_audit_logs` - Đã sửa (migration 12)
2. ⚠️ `active_orders` - Cần sửa
3. ⚠️ `security_audit_logs` - Cần sửa
4. ⚠️ `active_customers` - Cần sửa
5. ⚠️ `failed_audit_logs` - Cần sửa
6. ⚠️ `active_profiles` - Cần sửa

## Cách sửa nhanh (Khuyến nghị)

### Phương án 1: Chạy script tổng hợp trong Supabase SQL Editor

1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy toàn bộ nội dung file `fix-all-security-definer-views.sql`
4. Paste và chạy
5. Kiểm tra kết quả

### Phương án 2: Chạy từng migration

```bash
# Migration 13: Fix active_orders
psql "$SUPABASE_DB_URL" -f migrations/13_fix_active_orders_view.sql

# Migration 14: Fix các views còn lại
psql "$SUPABASE_DB_URL" -f migrations/14_fix_all_remaining_security_definer_views.sql
```

### Phương án 3: Chạy script bash tự động

```bash
chmod +x run-security-fixes.sh
./run-security-fixes.sh
```

## Chi tiết từng View

### 1. recent_audit_logs
**Mục đích**: Hiển thị 100 audit logs gần nhất
**Trạng thái**: ✅ Đã sửa
**Migration**: `12_fix_security_definer_view.sql`

### 2. active_orders
**Mục đích**: Hiển thị đơn hàng đang hoạt động (chưa hoàn thành/hủy)
**Trạng thái**: ⚠️ Cần sửa
**Migration**: `13_fix_active_orders_view.sql`
**Filter**: `status NOT IN ('completed', 'cancelled', 'delivered')`

### 3. security_audit_logs
**Mục đích**: Hiển thị audit logs liên quan đến bảo mật
**Trạng thái**: ⚠️ Cần sửa
**Migration**: `14_fix_all_remaining_security_definer_views.sql`
**Filter**: `action IN ('login', 'logout', 'password_change', 'permission_change', 'role_change')`

### 4. active_customers
**Mục đích**: Hiển thị khách hàng đang hoạt động (chưa xóa)
**Trạng thái**: ⚠️ Cần sửa
**Migration**: `14_fix_all_remaining_security_definer_views.sql`
**Filter**: `deleted_at IS NULL`

### 5. failed_audit_logs
**Mục đích**: Hiển thị audit logs về lỗi/thất bại
**Trạng thái**: ⚠️ Cần sửa
**Migration**: `14_fix_all_remaining_security_definer_views.sql`
**Filter**: `action LIKE '%failed%' OR action LIKE '%error%'`

### 6. active_profiles
**Mục đích**: Hiển thị profiles đang hoạt động (chưa xóa)
**Trạng thái**: ⚠️ Cần sửa
**Migration**: `14_fix_all_remaining_security_definer_views.sql`
**Filter**: `deleted_at IS NULL`

## Kiểm tra sau khi sửa

Chạy query sau để verify:

```sql
SELECT 
  schemaname,
  viewname,
  CASE 
    WHEN definition LIKE '%security_invoker%' THEN '✅ SECURITY INVOKER (Safe)'
    ELSE '⚠️ SECURITY DEFINER (Warning)'
  END as security_mode
FROM pg_views 
WHERE schemaname = 'public'
  AND viewname IN (
    'recent_audit_logs', 
    'active_orders', 
    'security_audit_logs',
    'active_customers',
    'failed_audit_logs',
    'active_profiles'
  )
ORDER BY viewname;
```

Kết quả mong đợi: Tất cả 6 views đều hiển thị "✅ SECURITY INVOKER (Safe)"

## Lợi ích sau khi sửa

1. **Bảo mật tốt hơn**: Mỗi user chỉ xem được dữ liệu họ có quyền
2. **Tuân thủ RLS**: Row Level Security policies được áp dụng đúng
3. **Audit trail chính xác**: Không thể xem dữ liệu của người khác
4. **Best practice**: Theo khuyến nghị của Supabase
5. **Loại bỏ cảnh báo**: Supabase Security Advisor sẽ không còn cảnh báo

## Files liên quan

- `migrations/12_fix_security_definer_view.sql` - Fix recent_audit_logs
- `migrations/13_fix_active_orders_view.sql` - Fix active_orders
- `migrations/14_fix_all_remaining_security_definer_views.sql` - Fix 4 views còn lại
- `fix-all-security-definer-views.sql` - Script tổng hợp (chạy trong SQL Editor)
- `run-security-fixes.sh` - Bash script tự động

## Troubleshooting

### Lỗi: Column không tồn tại
Nếu gặp lỗi về column không tồn tại, kiểm tra cấu trúc bảng thực tế:

```sql
-- Kiểm tra cấu trúc bảng
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'tên_bảng';
```

Sau đó điều chỉnh view definition cho phù hợp.

### Lỗi: View không tồn tại
Nếu view không tồn tại, script sẽ tự động bỏ qua (DROP IF EXISTS).

### Lỗi: Permission denied
Đảm bảo user có quyền CREATE VIEW và DROP VIEW trên schema public.

## Ngày cập nhật
Tháng 12, 2024
