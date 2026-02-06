# Các bước tiếp theo

## ✅ Đã hoàn thành
1. ✅ Cập nhật database types với trường `slug`, `description`, `specifications`
2. ✅ Tạo migration SQL với auto-generate slug function
3. ✅ Đổi tên folder từ `[id]` sang `[slug]`
4. ✅ Cập nhật code để query bằng slug
5. ✅ Cập nhật sitemap để bao gồm tất cả sản phẩm
6. ✅ Build thành công
7. ✅ Commit và push lên Git

## 🔄 Cần thực hiện ngay

### 1. Chạy Migration trong Supabase (QUAN TRỌNG!)
**File**: `supabase-add-slug-migration.sql`

**Các bước**:
1. Mở Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)
4. Copy toàn bộ nội dung file `supabase-add-slug-migration.sql`
5. Paste vào SQL Editor
6. Click **Run** để thực thi
7. Kiểm tra kết quả:
   - Sẽ hiển thị 10 sản phẩm đầu với slug
   - Verify constraint đã được tạo

**Lưu ý**: Migration này sẽ:
- Thêm cột `slug` vào bảng `products`
- Tạo function chuyển đổi tiếng Việt sang slug
- Auto-generate slug cho tất cả sản phẩm hiện có
- Thêm unique constraint và index
- Tạo trigger tự động cho sản phẩm mới

### 2. Kiểm tra sau khi chạy Migration

```sql
-- Kiểm tra tất cả sản phẩm có slug
SELECT id, name, slug 
FROM products 
ORDER BY id;

-- Kiểm tra không có sản phẩm nào thiếu slug
SELECT COUNT(*) as missing_slug
FROM products 
WHERE slug IS NULL;
-- Kết quả phải là 0
```

### 3. Test trên môi trường Development

```bash
# Chạy dev server
yarn dev

# Hoặc
npm run dev
```

**Test cases**:
1. Truy cập `/san-pham` - Danh sách sản phẩm
2. Click vào một sản phẩm
3. Kiểm tra URL có dạng: `/san-pham/thuc-an-heo-con-cao-cap-123`
4. Trang chi tiết hiển thị đúng thông tin
5. Thử thêm sản phẩm mới từ admin
6. Kiểm tra slug tự động được tạo

### 4. Test Sitemap

```bash
# Truy cập sitemap
curl http://localhost:3000/sitemap.xml

# Hoặc mở trình duyệt
http://localhost:3000/sitemap.xml
```

Kiểm tra:
- Sitemap có chứa tất cả sản phẩm
- URL sử dụng slug: `https://appejv.app/san-pham/thuc-an-heo-con-cao-cap-123`

### 5. Deploy lên Production

Sau khi test thành công:

```bash
# Code đã được push lên Git
# Nếu dùng Vercel/Railway/etc, deploy sẽ tự động

# Hoặc deploy thủ công
git push origin main
```

**Lưu ý**: Đảm bảo đã chạy migration trong Supabase production trước khi deploy!

## 📋 Checklist triển khai

- [ ] Backup database Supabase
- [ ] Chạy migration SQL trong Supabase
- [ ] Verify tất cả sản phẩm có slug
- [ ] Test local: danh sách sản phẩm
- [ ] Test local: trang chi tiết sản phẩm
- [ ] Test local: thêm sản phẩm mới
- [ ] Test local: sitemap.xml
- [ ] Deploy lên production
- [ ] Test production: URL với slug
- [ ] Test production: sitemap
- [ ] Monitor logs sau deploy

## 🐛 Troubleshooting

### Lỗi: "Property 'slug' does not exist"
- Chưa chạy migration trong Supabase
- Giải pháp: Chạy `supabase-add-slug-migration.sql`

### Lỗi: 404 khi truy cập /san-pham/[slug]
- Slug chưa được tạo cho sản phẩm
- Giải pháp: Chạy migration để generate slug

### Lỗi: "duplicate key value violates unique constraint"
- Có 2 sản phẩm cùng slug
- Giải pháp: Migration đã thêm ID vào slug để tránh trùng

### Sản phẩm mới không có slug
- Trigger chưa được tạo
- Giải pháp: Chạy lại phần trigger trong migration

## 📚 Tài liệu tham khảo

- `SLUG-IMPLEMENTATION-GUIDE.md` - Hướng dẫn chi tiết
- `supabase-add-slug-migration.sql` - Migration SQL
- `SUPABASE-STORAGE-SETUP.md` - Setup storage cho ảnh
- `SUPABASE-MIGRATION-GUIDE.md` - Hướng dẫn migration chung

## 🎯 Kết quả mong đợi

Sau khi hoàn thành:
- ✅ URL sản phẩm thân thiện: `/san-pham/thuc-an-heo-con-cao-cap-123`
- ✅ SEO tốt hơn với từ khóa trong URL
- ✅ Sitemap bao gồm tất cả sản phẩm
- ✅ Tự động tạo slug cho sản phẩm mới
- ✅ Không ảnh hưởng đến chức năng hiện tại

---

**Trạng thái hiện tại**: Code đã sẵn sàng, cần chạy migration trong Supabase
**Ưu tiên**: 🔴 CAO - Cần chạy migration trước khi deploy
**Thời gian ước tính**: 10-15 phút
