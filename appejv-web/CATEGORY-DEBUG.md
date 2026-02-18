# Debug: Categories không hiển thị

## Vấn đề
Trang sản phẩm chỉ hiển thị tab "Tất cả", không hiển thị các danh mục khác.

## Kiểm tra đã thực hiện

### 1. Code Logic
✅ `getCategories()` function đúng
✅ Mapping categories với count đúng
✅ Filter categories có count > 0 đúng

### 2. Environment Variables
✅ SUPABASE_URL: https://mrcmratcnlsoxctsbalt.supabase.co
✅ SUPABASE_ANON_KEY: có (208 ký tự)
✅ Không cần PUBLIC_ prefix cho SSR/SSG

### 3. Database Query
```typescript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .order('display_order', { ascending: true })
```

## Các bước debug

### Bước 1: Kiểm tra console logs
Khi chạy `npm run dev`, kiểm tra terminal output:
```
Supabase URL: https://mrcmratcnlsoxctsbalt.supabase.co
Supabase Key exists: true
Supabase query returned X categories
Categories: [...]
```

### Bước 2: Kiểm tra database
Verify bảng `categories` có dữ liệu:
```sql
SELECT * FROM categories ORDER BY display_order;
```

### Bước 3: Test Supabase connection
```bash
# Test từ terminal
curl -X GET 'https://mrcmratcnlsoxctsbalt.supabase.co/rest/v1/categories' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Bước 4: Clear cache và rebuild
```bash
# Xóa cache
rm -rf .astro dist node_modules/.vite

# Rebuild
npm run dev
```

## Possible Issues

### Issue 1: Bảng categories trống
**Solution:** Thêm dữ liệu vào bảng categories

### Issue 2: RLS (Row Level Security) blocking
**Solution:** Kiểm tra RLS policies cho bảng categories
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'categories';

-- Enable read access for anon
CREATE POLICY "Enable read access for all users" ON "public"."categories"
FOR SELECT USING (true);
```

### Issue 3: Build cache
**Solution:** Clear cache và rebuild

### Issue 4: Type mismatch
**Solution:** Kiểm tra type của category.id (string vs number)

## Code Changes Made

### 1. Added logging
```typescript
console.log('Supabase returned', apiCategories.length, 'categories')
console.log('Categories:', JSON.stringify(apiCategories, null, 2))
```

### 2. Added error handling
```typescript
try {
  // ... query
  if (!data || data.length === 0) {
    console.warn('No categories found in database')
    return []
  }
} catch (err) {
  console.error('Exception in getCategories:', err)
  return []
}
```

### 3. Added display_order
```typescript
.order('display_order', { ascending: true })
```

## Next Steps

1. Run `npm run dev` và check console logs
2. Nếu không có categories, check database
3. Nếu có error, check RLS policies
4. Nếu vẫn không work, check type mismatch

## Expected Output

Khi có dữ liệu đúng, console sẽ hiển thị:
```
Supabase returned 20 products
Supabase returned 5 categories
Categories: [
  { id: "1", name: "Thức ăn cho heo", ... },
  { id: "2", name: "Thức ăn cho gà", ... },
  ...
]
```

Và UI sẽ hiển thị:
```
🏭 Tất cả (20) | 🐷 Thức ăn cho heo (10) | 🐔 Thức ăn cho gà (8) | ...
```
