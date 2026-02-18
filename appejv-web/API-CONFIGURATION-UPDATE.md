# Cập nhật cấu hình API cho appejv-web

## Tổng quan
Đã cập nhật cấu hình API trong appejv-web để sử dụng API production tại `api.appejv.app` thay vì localhost.

## Thay đổi

### 1. File .env (Development)
**Trước:**
```env
PUBLIC_API_URL=http://localhost:8081/api/v1
```

**Sau:**
```env
PUBLIC_API_URL=https://api.appejv.app/api/v1
```

### 2. Cấu trúc API
File: `src/lib/api.ts`

**Chức năng:**
- ✅ `getProducts()` - Lấy danh sách sản phẩm
- ✅ `getProduct(id)` - Lấy chi tiết sản phẩm theo ID
- ✅ `getProductBySlug(slug)` - Lấy sản phẩm theo slug
- ✅ `getCategories()` - Lấy danh mục (derived từ products)

**API Endpoints:**
- `GET /api/v1/products` - Danh sách sản phẩm
- `GET /api/v1/products/:id` - Chi tiết sản phẩm

**Query Parameters:**
- `category` - Lọc theo danh mục
- `search` - Tìm kiếm
- `page` - Trang hiện tại
- `limit` - Số lượng mỗi trang

### 3. Trang sản phẩm
File: `src/pages/san-pham/index.astro`

**Chức năng:**
- ✅ Hiển thị danh sách sản phẩm từ API
- ✅ Lọc theo danh mục
- ✅ Tìm kiếm sản phẩm
- ✅ Phân trang (12 sản phẩm/trang)
- ✅ Hiển thị ảnh sản phẩm
- ✅ Hiển thị giá và đơn vị

**URL Examples:**
- `/san-pham` - Tất cả sản phẩm
- `/san-pham?category=pig` - Lọc theo danh mục
- `/san-pham?search=thức+ăn` - Tìm kiếm
- `/san-pham?page=2` - Trang 2

### 4. Trang chi tiết sản phẩm
File: `src/pages/san-pham/[slug].astro`

**Chức năng:**
- ✅ Hiển thị chi tiết sản phẩm
- ✅ Lấy dữ liệu từ API theo slug
- ✅ SEO-friendly URLs

## Environment Variables

### Development (.env)
```env
PUBLIC_API_URL=https://api.appejv.app/api/v1
PUBLIC_APP_URL=http://localhost:3000
```

### Production (.env.production)
```env
PUBLIC_API_URL=https://api.appejv.app/api/v1
PUBLIC_APP_URL=https://app.appejv.app
PUBLIC_SITE_URL=https://appejv.app
```

## Kiểm tra

### 1. Test API Connection
```bash
curl https://api.appejv.app/api/v1/products
```

### 2. Test Website
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

### 3. Kiểm tra trang
- Truy cập: http://localhost:4321/san-pham
- Kiểm tra console log để xem API calls
- Kiểm tra danh sách sản phẩm hiển thị
- Test filter và search

## Error Handling

API client đã có error handling:
- ✅ Catch network errors
- ✅ Handle HTTP errors (404, 500, etc.)
- ✅ Return empty array/null on error
- ✅ Console log errors for debugging

## Next Steps

1. ✅ Cập nhật .env để sử dụng production API
2. ⏳ Test trang sản phẩm với API production
3. ⏳ Kiểm tra performance và caching
4. ⏳ Deploy lên production

## Notes

- API URL có thể thay đổi bằng cách cập nhật `PUBLIC_API_URL` trong .env
- Không cần restart dev server khi thay đổi .env (cần rebuild)
- API responses được cache bởi Astro build process
- Trang sản phẩm là static site generation (SSG) nên cần rebuild để cập nhật data

## Deployment

Khi deploy lên production:
1. Đảm bảo file `.env.production` có đúng API URL
2. Build với: `npm run build`
3. Deploy folder `dist/`
4. API sẽ tự động sử dụng production URL

## Trạng thái
✅ Đã cập nhật API URL sang production
✅ Trang sản phẩm đã sẵn sàng sử dụng API
✅ Error handling đã được implement
⏳ Cần test với API production
