# Supabase Storage Setup Guide

## Thiết lập Storage cho Product Images

### Bước 1: Tạo Storage Bucket

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Storage** (biểu tượng folder ở sidebar)
4. Click **New bucket**
5. Điền thông tin:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Check (để ảnh có thể truy cập công khai)
   - **File size limit**: 5MB (hoặc tùy chỉnh)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`
6. Click **Create bucket**

### Bước 2: Thiết lập Storage Policies

Vào tab **Policies** của bucket `product-images` và tạo các policies sau:

#### Policy 1: Public Read Access (Cho phép mọi người xem ảnh)

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

Hoặc qua UI:
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'product-images'`

#### Policy 2: Admin Upload (Chỉ admin upload được)

```sql
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'role')::text = 'admin'
);
```

Hoặc qua UI:
- Policy name: `Admin can upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: 
  ```sql
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'role')::text = 'admin'
  ```

#### Policy 3: Admin Delete (Chỉ admin xóa được)

```sql
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'role')::text = 'admin'
);
```

Hoặc qua UI:
- Policy name: `Admin can delete`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- USING expression:
  ```sql
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'role')::text = 'admin'
  ```

### Bước 3: Cấu hình CORS (Nếu cần)

Nếu gặp lỗi CORS khi upload, thêm domain của bạn vào allowed origins:

1. Vào **Settings** → **API**
2. Tìm phần **CORS**
3. Thêm domain của bạn (ví dụ: `https://appejv.app`)

### Bước 4: Test Upload

Sau khi setup xong, test bằng cách:

1. Đăng nhập với tài khoản admin
2. Vào trang Inventory
3. Click vào một sản phẩm
4. Click nút Edit (icon bút chì)
5. Click vào khung upload ảnh
6. Chọn một file ảnh (JPG, PNG, hoặc WEBP)
7. Ảnh sẽ được upload và hiển thị preview

### Cấu trúc thư mục

Ảnh sẽ được lưu theo cấu trúc:
```
product-images/
  └── products/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.png
      └── ...
```

### Giới hạn và Quy tắc

- **Kích thước file tối đa**: 5MB
- **Định dạng cho phép**: JPG, JPEG, PNG, WEBP
- **Quyền upload**: Chỉ admin
- **Quyền xem**: Public (mọi người)
- **Quyền xóa**: Chỉ admin

### Troubleshooting

#### Lỗi: "new row violates row-level security policy"

**Nguyên nhân**: RLS policies chưa được thiết lập đúng

**Giải pháp**: 
1. Kiểm tra lại policies trong Storage
2. Đảm bảo user có role 'admin' trong bảng profiles
3. Kiểm tra JWT token có chứa role không

#### Lỗi: "Failed to upload image"

**Nguyên nhân**: Bucket chưa được tạo hoặc tên bucket sai

**Giải pháp**:
1. Kiểm tra bucket name là `product-images`
2. Đảm bảo bucket là public
3. Kiểm tra file size và type

#### Lỗi: CORS

**Nguyên nhân**: Domain chưa được thêm vào allowed origins

**Giải pháp**:
1. Vào Settings → API → CORS
2. Thêm domain của bạn
3. Restart application

### SQL Script để tạo policies (Alternative)

Nếu muốn tạo tất cả policies bằng SQL:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Admin upload
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  ) = 'admin'
);

-- Admin delete
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  ) = 'admin'
);

-- Admin update
CREATE POLICY "Admin can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  ) = 'admin'
);
```

### Monitoring và Maintenance

- **Xem usage**: Storage → product-images → Usage
- **Xem files**: Storage → product-images → Files
- **Xóa files cũ**: Có thể setup lifecycle policies để tự động xóa files không dùng

---

**Ngày tạo:** 2026-02-07
**Version:** 1.0.0
**Tác giả:** APPE JV Development Team
