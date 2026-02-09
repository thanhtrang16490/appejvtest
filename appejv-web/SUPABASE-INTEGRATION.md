# Supabase Integration - appejv-web

## ✅ Hoàn thành

appejv-web đã được cấu hình để kết nối trực tiếp với Supabase database, không qua API.

## Cấu hình

### Environment Variables (.env)
```env
SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Dependencies
- `@supabase/supabase-js` - Supabase JavaScript client

## Files đã tạo

### 1. `src/lib/supabase.ts`
Supabase client và helper functions:
- `supabase` - Client instance
- `getProducts(category?)` - Lấy danh sách sản phẩm
- `getProductBySlug(slug)` - Lấy chi tiết sản phẩm theo slug
- `getCategories()` - Lấy danh sách categories

### 2. `src/pages/san-pham/index.astro`
Trang danh sách sản phẩm:
- Lấy dữ liệu từ Supabase
- Filter theo category
- Search theo tên
- Pagination (12 sản phẩm/trang)

### 3. `src/pages/san-pham/[slug].astro`
Trang chi tiết sản phẩm:
- Lấy sản phẩm theo slug
- Hiển thị thông tin chi tiết
- Sản phẩm liên quan (cùng category)

## Kiểm tra

### Trang danh sách sản phẩm
```
http://localhost:4321/san-pham
```

Kết quả: ✅ Hiển thị 47 sản phẩm từ Supabase

### Filter theo category
```
http://localhost:4321/san-pham?category=pig
http://localhost:4321/san-pham?category=poultry
http://localhost:4321/san-pham?category=fish
```

### Search
```
http://localhost:4321/san-pham?search=heo
```

### Chi tiết sản phẩm
```
http://localhost:4321/san-pham/[slug]
```

## Database Schema

### Table: products
```sql
- id: uuid (primary key)
- name: text
- slug: text (unique)
- category: text
- price: numeric
- unit: text
- image_url: text (nullable)
- description: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

## Categories

Hiện tại hỗ trợ:
- `pig` - Thức ăn cho heo 🐷
- `poultry` - Thức ăn cho gia cầm 🐔
- `fish` - Thức ăn cho thủy sản 🐟
- `cattle` - Thức ăn cho gia súc 🐄

## Features

✅ **Server-side rendering** - Dữ liệu được fetch khi build/request
✅ **Direct database access** - Không cần API middleware
✅ **Type-safe** - TypeScript interfaces cho Product và Category
✅ **SEO-friendly** - Static pages với dynamic data
✅ **Fast** - Truy vấn trực tiếp từ Supabase
✅ **Secure** - Sử dụng anon key, RLS policies áp dụng

## So sánh với appejv-app

| Feature | appejv-app (Next.js) | appejv-web (Astro) |
|---------|---------------------|-------------------|
| Database | Supabase | Supabase |
| Connection | Direct | Direct |
| Rendering | CSR + SSR | SSG + SSR |
| Auth | Supabase Auth | None (public only) |
| API | Go API (optional) | None |

## Performance

- **Initial load**: ~700ms (includes Supabase query)
- **Subsequent loads**: Cached by browser
- **Database queries**: Direct to Supabase (fast)
- **No API overhead**: Không qua Go API

## Security

- ✅ Sử dụng anon key (public access)
- ✅ RLS policies được áp dụng
- ✅ Không expose service key
- ✅ Read-only access cho public

## Next Steps

1. ✅ Tích hợp Supabase
2. ✅ Tạo trang sản phẩm
3. ⏳ Thêm images cho sản phẩm
4. ⏳ Tối ưu hóa queries
5. ⏳ Add caching layer

## Troubleshooting

### Lỗi "Invalid API key"
- Kiểm tra SUPABASE_ANON_KEY trong .env
- Restart dev server sau khi thay đổi .env

### Không lấy được dữ liệu
- Kiểm tra RLS policies trong Supabase
- Kiểm tra table name (phải là `products`)
- Xem console logs

### Environment variables không load
- Trong Astro, dùng `import.meta.env.VARIABLE_NAME`
- Không có prefix `NEXT_PUBLIC_` như Next.js
- Restart dev server sau khi thay đổi

## Commands

### Start dev server
```bash
cd appejv-web
npm run dev
```

### Build for production
```bash
cd appejv-web
npm run build
```

### Preview production build
```bash
cd appejv-web
npm run preview
```
