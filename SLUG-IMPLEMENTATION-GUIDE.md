# Hướng dẫn triển khai Slug cho Sản phẩm

## Tổng quan
Đã cập nhật hệ thống để sử dụng slug thay vì ID cho URL sản phẩm công khai, giúp SEO tốt hơn.

## Thay đổi đã thực hiện

### 1. Database Types
- ✅ Đã thêm trường `slug: string | null` vào `products` table trong `types/database.types.ts`

### 2. Migration SQL
- ✅ Đã tạo file `supabase-add-slug-migration.sql` với:
  - Thêm cột `slug` vào bảng `products`
  - Hàm `generate_slug()` để chuyển đổi tiếng Việt sang slug
  - Auto-generate slug cho sản phẩm hiện có (format: `ten-san-pham-{id}`)
  - Unique constraint trên cột `slug`
  - Index cho tìm kiếm nhanh
  - Trigger tự động tạo slug khi insert/update

### 3. Public Product Pages
- ✅ Đã đổi tên folder từ `[id]` sang `[slug]`
- ✅ Cập nhật `app/san-pham/[slug]/page.tsx`:
  - Query sản phẩm bằng `slug` thay vì `id`
  - Sử dụng `params.slug` thay vì `params.id`
  - Tự động cập nhật document title khi load sản phẩm
- ✅ Cập nhật `app/san-pham/page.tsx`:
  - Link sử dụng `product.slug || product.id` (fallback cho trường hợp chưa có slug)

### 4. SEO Improvements
- ✅ Cập nhật `app/sitemap.ts`:
  - Tự động thêm tất cả sản phẩm vào sitemap
  - Sử dụng slug trong URL
  - Bao gồm lastModified date từ created_at

### 5. Admin Product Management
- ⚠️ `components/sales/ProductDialog.tsx` - Không cần thay đổi
  - Slug sẽ được tự động tạo bởi database trigger
  - Admin không cần nhập slug thủ công

## Cách chạy Migration

### Bước 1: Backup Database
```bash
# Tạo backup trước khi chạy migration
# Vào Supabase Dashboard > Database > Backups
```

### Bước 2: Chạy Migration SQL
1. Mở Supabase Dashboard
2. Vào **SQL Editor**
3. Copy toàn bộ nội dung file `supabase-add-slug-migration.sql`
4. Paste vào SQL Editor
5. Click **Run** để thực thi

### Bước 3: Kiểm tra kết quả
Migration sẽ tự động hiển thị:
- 10 sản phẩm đầu tiên với slug đã được tạo
- Thông tin constraint đã được thêm

Hoặc chạy query kiểm tra:
```sql
-- Kiểm tra tất cả sản phẩm có slug
SELECT id, name, slug 
FROM products 
WHERE slug IS NOT NULL
ORDER BY id;

-- Kiểm tra sản phẩm chưa có slug (không nên có)
SELECT id, name, slug 
FROM products 
WHERE slug IS NULL;
```

## Testing

### Test 1: Kiểm tra slug tự động tạo
```sql
-- Thêm sản phẩm mới
INSERT INTO products (code, name, price, stock, unit, category)
VALUES ('TEST001', 'Thức ăn heo con cao cấp', 250000, 100, 'Bao', 'Pig Feed');

-- Kiểm tra slug đã được tạo
SELECT id, name, slug FROM products WHERE code = 'TEST001';
-- Kết quả mong đợi: slug = 'thuc-an-heo-con-cao-cap-{id}'
```

### Test 2: Kiểm tra URL công khai
1. Truy cập: `https://appejv.app/san-pham`
2. Click vào một sản phẩm
3. Kiểm tra URL trên trình duyệt:
   - ✅ Đúng: `https://appejv.app/san-pham/thuc-an-heo-con-cao-cap-123`
   - ❌ Sai: `https://appejv.app/san-pham/123`

### Test 3: Kiểm tra trang chi tiết
1. Truy cập trực tiếp URL với slug: `https://appejv.app/san-pham/thuc-an-heo-con-cao-cap-123`
2. Trang phải hiển thị đúng thông tin sản phẩm
3. Không có lỗi 404

### Test 4: Kiểm tra Admin thêm sản phẩm mới
1. Đăng nhập với tài khoản admin
2. Vào **Kho hàng** > Click **Thêm sản phẩm**
3. Nhập thông tin sản phẩm (không cần nhập slug)
4. Lưu sản phẩm
5. Kiểm tra trong database: slug đã được tự động tạo
6. Truy cập trang công khai: URL sử dụng slug

## Ví dụ Slug được tạo

| Tên sản phẩm | Slug được tạo |
|--------------|---------------|
| Thức ăn heo con cao cấp | `thuc-an-heo-con-cao-cap-{id}` |
| Thức ăn gà đẻ trứng | `thuc-an-ga-de-trung-{id}` |
| Thức ăn cá tra giống | `thuc-an-ca-tra-giong-{id}` |
| Phụ gia dinh dưỡng | `phu-gia-dinh-duong-{id}` |

## Lưu ý quan trọng

### 1. Unique Constraint
- Mỗi slug phải là duy nhất
- Format `{slug}-{id}` đảm bảo không trùng lặp
- Nếu 2 sản phẩm cùng tên, ID sẽ phân biệt

### 2. Fallback cho sản phẩm cũ
- Code đã có fallback: `product.slug || product.id`
- Nếu slug null, sẽ dùng ID (tương thích ngược)
- Sau khi chạy migration, tất cả sản phẩm đều có slug

### 3. SEO Benefits
- URL thân thiện: `/san-pham/thuc-an-heo-con-cao-cap-123`
- Dễ đọc và nhớ hơn: `/san-pham/123`
- Tốt cho Google indexing
- Chứa từ khóa trong URL

### 4. Performance
- Đã thêm index trên cột `slug`
- Query by slug nhanh như query by id
- Không ảnh hưởng hiệu suất

## Rollback (nếu cần)

Nếu có vấn đề, chạy SQL sau để rollback:

```sql
-- Xóa trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_product_slug ON products;

-- Xóa function
DROP FUNCTION IF EXISTS auto_generate_product_slug();
DROP FUNCTION IF EXISTS generate_slug(TEXT);

-- Xóa index
DROP INDEX IF EXISTS idx_products_slug;

-- Xóa constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_slug_unique;

-- Xóa cột slug
ALTER TABLE products DROP COLUMN IF EXISTS slug;
```

Sau đó đổi lại code:
- Đổi folder `[slug]` về `[id]`
- Đổi `params.slug` về `params.id`
- Đổi query `.eq('slug', slug)` về `.eq('id', id)`
- Đổi link `product.slug` về `product.id`

## Checklist triển khai

- [ ] Backup database
- [ ] Chạy migration SQL trong Supabase
- [ ] Kiểm tra tất cả sản phẩm có slug
- [ ] Test URL công khai với slug
- [ ] Test trang chi tiết sản phẩm
- [ ] Test thêm sản phẩm mới từ admin
- [ ] Kiểm tra không có lỗi 404
- [ ] Deploy code lên production
- [ ] Monitor logs sau deploy

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Supabase Dashboard
2. Kiểm tra browser console có lỗi không
3. Verify migration đã chạy thành công
4. Kiểm tra tất cả sản phẩm có slug

---

**Trạng thái**: ✅ Sẵn sàng triển khai
**Ngày cập nhật**: 2026-02-07
