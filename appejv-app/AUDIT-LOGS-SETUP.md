# Hướng dẫn cài đặt Audit Logs

## ✅ Đã hoàn thành

### 1. Database Migration
- Tạo bảng `audit_logs` với đầy đủ các trường cần thiết
- Tạo RLS policies (chỉ admin có quyền xem)
- Tạo triggers tự động log cho products, customers, orders
- Tạo helper functions: `log_audit_event`, `get_user_activity_summary`, `cleanup_old_audit_logs`
- Tạo views: `recent_audit_logs`, `failed_audit_logs`, `security_audit_logs`

**File**: `supabase-add-audit-logs-migration.sql`

### 2. Database Types
- Thêm type definition cho bảng `audit_logs`
- Hỗ trợ đầy đủ các trường: event_type, user_id, user_email, ip_address, user_agent, resource, action, success, error_message, metadata

**File**: `types/database.types.ts`

### 3. Security Audit Library
- Cập nhật `logAuditEvent()` để lưu vào database thay vì chỉ console.log
- Tự động lưu audit logs vào Supabase
- Xử lý lỗi gracefully để không ảnh hưởng main flow
- Sử dụng type casting `(supabase as any)` để tránh lỗi type inference

**File**: `lib/security/audit.ts`

### 4. Audit Logs Page
- Trang xem lịch sử hoạt động với UI đẹp
- Tìm kiếm theo user, event, resource, action
- Lọc theo trạng thái (success/failed)
- Lọc theo resource type
- Hiển thị metadata chi tiết
- Format thời gian bằng tiếng Việt (date-fns)
- Refresh button để tải lại dữ liệu

**File**: `app/sales/audit-logs/page.tsx`

### 5. Header Menu
- Thêm link "Lịch sử thao tác" vào HeaderMenu
- Chỉ hiển thị cho admin (role-based filtering)
- Icon Shield để dễ nhận biết
- Mô tả: "Xem nhật ký hệ thống"

**File**: `components/layout/HeaderMenu.tsx`

## 📋 Cần thực hiện

### Bước 1: Chạy Migration
Chạy file SQL trong Supabase SQL Editor:

```bash
# Copy nội dung file này và chạy trong Supabase Dashboard > SQL Editor
supabase-add-audit-logs-migration.sql
```

### Bước 2: Kiểm tra RLS Policies
Đảm bảo user hiện tại có role `admin` để xem được audit logs:

```sql
-- Kiểm tra role của user
SELECT id, full_name, role FROM profiles WHERE id = auth.uid();

-- Nếu cần, update role thành admin
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
```

### Bước 3: Test Audit Logs
1. Đăng nhập với tài khoản admin
2. Thực hiện một số thao tác (tạo/sửa/xóa sản phẩm, khách hàng, đơn hàng)
3. Mở HeaderMenu (icon Menu ở góc phải)
4. Click vào "Lịch sử thao tác"
5. Kiểm tra xem các logs có hiển thị đúng không

### Bước 4: Kiểm tra Auto-logging
Triggers sẽ tự động log các thay đổi:

- **Products**: INSERT, UPDATE, DELETE
- **Customers**: INSERT, UPDATE, DELETE  
- **Orders**: INSERT, UPDATE, DELETE

Thử tạo/sửa/xóa một sản phẩm và kiểm tra trong audit logs.

## 🔍 Cách sử dụng

### Xem Audit Logs
1. Đăng nhập với tài khoản admin
2. Click icon Menu ở header
3. Chọn "Lịch sử thao tác"

### Tìm kiếm và lọc
- **Tìm kiếm**: Nhập từ khóa để tìm theo user, event, resource, action
- **Lọc trạng thái**: Chọn "Thành công" hoặc "Thất bại"
- **Lọc resource**: Chọn loại resource cụ thể (products, customers, orders)
- **Làm mới**: Click nút "Làm mới" để tải lại dữ liệu

### Log thủ công từ code
Sử dụng `logAuditEvent()` trong code:

```typescript
import { logAuditEvent, AuditEventType } from '@/lib/security/audit'

// Ví dụ: Log khi user login thành công
await logAuditEvent({
  eventType: AuditEventType.LOGIN_SUCCESS,
  userId: user.id,
  userEmail: user.email,
  ipAddress: getClientIP(request),
  userAgent: getUserAgent(request),
  success: true,
  metadata: { loginMethod: 'email' }
})

// Ví dụ: Log khi có lỗi unauthorized
await logAuditEvent({
  eventType: AuditEventType.UNAUTHORIZED_ACCESS,
  userId: user?.id,
  userEmail: user?.email,
  resource: 'customers',
  action: 'view',
  success: false,
  errorMessage: 'User does not have permission',
  metadata: { attemptedResource: '/sales/customers' }
})
```

## 🎨 UI Features

### Badge Colors
- **LOGIN_SUCCESS**: Xanh lá (green)
- **LOGIN_FAILED**: Đỏ (red)
- **LOGOUT**: Xám (gray)
- **DATA_MODIFICATION**: Xanh dương (blue)
- **DATA_ACCESS**: Tím (purple)
- **UNAUTHORIZED_ACCESS**: Đỏ (red)
- **RATE_LIMIT_EXCEEDED**: Vàng (yellow)

### Icons
- Success: CheckCircle (xanh lá)
- Failed: XCircle (đỏ)
- User: User icon
- Resource: Activity icon
- Time: Calendar icon

### Time Format
Sử dụng `date-fns` với locale tiếng Việt:
- "vừa xong"
- "2 phút trước"
- "1 giờ trước"
- "3 ngày trước"

## 🔒 Security

### RLS Policies
Chỉ admin có quyền:
- SELECT audit_logs
- Không ai có quyền INSERT/UPDATE/DELETE trực tiếp (chỉ qua functions)

### Auto-logging
Triggers tự động log mọi thay đổi:
- Ghi lại user_id, timestamp, action
- Lưu old_data và new_data vào metadata
- Không thể bypass (chạy ở database level)

### Cleanup
Function `cleanup_old_audit_logs()` để xóa logs cũ hơn 90 ngày:

```sql
-- Chạy thủ công
SELECT cleanup_old_audit_logs();

-- Hoặc setup cron job trong Supabase
```

## 📊 Views có sẵn

### recent_audit_logs
Logs trong 7 ngày gần nhất:
```sql
SELECT * FROM recent_audit_logs LIMIT 50;
```

### failed_audit_logs
Chỉ các logs thất bại:
```sql
SELECT * FROM failed_audit_logs LIMIT 50;
```

### security_audit_logs
Chỉ các logs liên quan security:
```sql
SELECT * FROM security_audit_logs LIMIT 50;
```

## 🎯 Next Steps

1. ✅ Chạy migration SQL
2. ✅ Kiểm tra role admin
3. ✅ Test tạo/sửa/xóa dữ liệu
4. ✅ Xem audit logs trong UI
5. ⏳ Setup cron job để cleanup logs cũ (optional)
6. ⏳ Thêm audit logging vào các API routes khác (optional)

## 🐛 Troubleshooting

### Không thấy audit logs
- Kiểm tra role: `SELECT role FROM profiles WHERE id = auth.uid()`
- Phải là `admin` mới xem được
- Kiểm tra RLS policies đã chạy chưa

### Logs không tự động tạo
- Kiểm tra triggers đã được tạo: `SELECT * FROM pg_trigger WHERE tgname LIKE 'audit_%'`
- Kiểm tra functions: `SELECT * FROM pg_proc WHERE proname LIKE 'log_audit_%'`

### Type errors
- Sử dụng `(supabase as any)` khi insert audit_logs
- Đảm bảo `types/database.types.ts` đã được update

## 📝 Notes

- Audit logs chỉ lưu 200 bản ghi gần nhất trong UI (có thể tăng nếu cần)
- Database lưu toàn bộ, UI chỉ hiển thị subset
- Metadata được lưu dạng JSONB, có thể query được
- Timestamps sử dụng timezone UTC
