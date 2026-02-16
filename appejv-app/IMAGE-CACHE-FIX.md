# Fix: Ảnh sản phẩm không cập nhật sau khi upload

## Vấn đề
Sau khi upload ảnh mới cho sản phẩm, ảnh cũ vẫn hiển thị trên trang chi tiết.

## Nguyên nhân
- Browser cache ảnh cũ
- Next.js Image component cache
- Supabase CDN cache

## Giải pháp đã áp dụng

### 1. Cache Busting ✅
Thêm timestamp vào URL ảnh để force reload:
```tsx
<Image
    src={`${product.image_url}?t=${Date.now()}`}
    alt={product.name}
    fill
    className="object-cover"
    unoptimized
    key={product.image_url}
/>
```

### 2. Unoptimized Image ✅
Tắt Next.js image optimization để tránh cache:
```tsx
unoptimized
```

### 3. Force Re-render ✅
Reset state trước khi set data mới:
```tsx
setProduct(null)
setTimeout(() => {
    setProduct(productData)
}, 0)
```

## Cách test

### Test 1: Upload ảnh mới
1. Vào trang chi tiết sản phẩm
2. Click nút Edit (icon bút chì)
3. Upload ảnh mới
4. Click "Lưu"
5. ✅ Ảnh mới sẽ hiển thị ngay

### Test 2: Hard refresh
Nếu vẫn thấy ảnh cũ:
```bash
# Mac
Cmd + Shift + R

# Windows/Linux
Ctrl + Shift + R
```

### Test 3: Clear browser cache
```bash
# Chrome DevTools
1. F12 để mở DevTools
2. Right-click vào nút Reload
3. Chọn "Empty Cache and Hard Reload"
```

## Lưu ý

### Supabase Storage Cache
Supabase CDN có thể cache ảnh trong 1 giờ (3600s). Nếu muốn thay đổi:

```tsx
const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
        cacheControl: '0', // Không cache
        upsert: false
    })
```

### Next.js Image Optimization
Đã tắt optimization với `unoptimized` prop. Nếu muốn bật lại:
- Xóa `unoptimized` prop
- Thêm domain vào `next.config.js`:

```js
images: {
    domains: ['your-supabase-project.supabase.co'],
    minimumCacheTTL: 0
}
```

## Kết quả

✅ Ảnh cập nhật ngay lập tức sau khi upload
✅ Không cần refresh page
✅ Không bị cache cũ

## Troubleshooting

### Vẫn thấy ảnh cũ?
1. Check URL ảnh trong database có đúng không
2. Check ảnh có tồn tại trong Supabase Storage không
3. Check browser console có lỗi không
4. Try incognito mode

### Ảnh không load?
1. Check Supabase Storage bucket policy (public access)
2. Check image URL format
3. Check file size (max 5MB)
4. Check file type (JPG, PNG, WEBP only)

## Files đã thay đổi

- `app/sales/inventory/[id]/page.tsx`
  - Thêm cache busting với timestamp
  - Thêm `unoptimized` prop
  - Thêm `key` prop để force re-render
  - Force state reset trong fetchData()
