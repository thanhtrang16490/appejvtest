# Hướng dẫn sửa các Security Warnings còn lại

## Tổng quan
Còn 6 security warnings cần xử lý. Hướng dẫn này sẽ giúp bạn sửa từng warning một cách an toàn.

---

## 1. Fix RLS Policies (3 warnings) - KHUYẾN NGHỊ SỬA

### Vấn đề
Ba bảng có policies quá permissive, cho phép public INSERT/UPDATE/DELETE:
- `products` - "Public access" (ALL)
- `order_items` - "Public access" (ALL)  
- `customer_details` - "Public access" (ALL)

### Giải pháp
Thay thế policy "Public access" bằng các policies cụ thể:
- **Public**: Chỉ cho phép SELECT (đọc)
- **Authenticated**: Cho phép INSERT/UPDATE/DELETE

### Cách sửa

#### Option 1: Chạy Migration (Khuyến nghị)
```bash
# Chạy trong Supabase SQL Editor
# Copy nội dung file: migrations/16_fix_rls_policies.sql
```

#### Option 2: Sửa thủ công từng bảng

**Bước 1: Vào Supabase Dashboard**
1. Mở project của bạn
2. Vào **Database** > **Policies**

**Bước 2: Sửa từng bảng**

##### A. Products Table
```sql
-- 1. Xóa policy cũ
DROP POLICY "Public access" ON public.products;

-- 2. Tạo policy mới
-- Public chỉ đọc
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  T