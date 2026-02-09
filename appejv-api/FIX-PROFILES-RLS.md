# Fix Profiles RLS Infinite Recursion

## Vấn đề

Lỗi: `infinite recursion detected in policy for relation "profiles"`

Lỗi này xảy ra khi RLS policy trên bảng `profiles` tham chiếu chính nó, tạo ra vòng lặp đệ quy vô hạn.

## Nguyên nhân

RLS policy hiện tại có thể đang sử dụng subquery tham chiếu lại bảng `profiles`, ví dụ:
```sql
-- ❌ Gây infinite recursion
CREATE POLICY "policy_name" ON profiles
USING (
  id IN (SELECT id FROM profiles WHERE ...)
);
```

## Giải pháp

Sử dụng **Security Definer Function** để bypass RLS khi kiểm tra quyền truy cập.

### Bước 1: Chạy Migration

**Cách 1: Qua Supabase Dashboard (Khuyến nghị)**

1. Mở [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project: `mrcmratcnlsoxctsbalt`
3. Vào **SQL Editor** (menu bên trái)
4. Copy toàn bộ nội dung file `migrations/fix_profiles_rls_recursion.sql`
5. Paste vào SQL Editor
6. Click **Run** để thực thi

**Cách 2: Qua CLI (Nếu có Supabase CLI)**

```bash
cd appejv-api
supabase db push
```

### Bước 2: Verify

Sau khi chạy migration, test lại:

```bash
# Restart API server
# Ctrl+C để stop server hiện tại, sau đó:
make run

# Hoặc nếu đang dùng process background:
# Kill process và start lại
```

Test login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "thanhtrang16490@gmail.com",
    "password": "your-password"
  }'
```

## Chi tiết kỹ thuật

Migration này thực hiện:

1. **Xóa các policy cũ** có thể gây recursion
2. **Tạo security definer function** `can_access_profile()`:
   - Function này bypass RLS
   - Kiểm tra quyền truy cập profile
   - User có thể xem profile của chính mình
   - Admin/sale_admin có thể xem tất cả profiles
3. **Tạo policies mới** sử dụng function trên:
   - SELECT: Dùng `can_access_profile(id)`
   - UPDATE: Chỉ cho phép update profile của chính mình
   - INSERT: Chỉ cho phép insert profile của chính mình

## Tham khảo

- [Supabase Discussion #3328](https://github.com/orgs/supabase/discussions/3328)
- [Supabase RLS Security Definer Functions](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions)

## Lưu ý

⚠️ **Security Definer Functions** chạy với quyền của owner (postgres), nên cần:
- Validate input cẩn thận
- Set `search_path` để tránh schema injection
- Giới hạn logic đơn giản, rõ ràng

✅ Migration này đã tuân thủ các best practices trên.
