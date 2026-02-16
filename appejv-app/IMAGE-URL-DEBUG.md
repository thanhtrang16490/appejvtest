# Debug: Image URL không lưu vào database

## Vấn đề
Ảnh upload thành công lên Supabase Storage nhưng URL không xuất hiện trong database table.

## Các thay đổi đã thực hiện

### 1. Sync formData với product prop ✅
```tsx
useEffect(() => {
    if (isOpen) {
        fetchCategories()
        // Reset form data when opening dialog
        if (product) {
            setFormData(product)
            setImagePreview(product.image_url || null)
        } else {
            setFormData({
                name: '',
                code: '',
                price: 0,
                stock: 0,
                unit: 'Cái',
                category: 'Chung',
                category_id: undefined,
                description: '',
                specifications: '',
                image_url: ''
            })
            setImagePreview(null)
        }
        setImagePath(null)
    }
}, [isOpen, product])
```

### 2. Thêm console.log để debug ✅
```tsx
console.log('Submitting product data:', dataToSubmit)
console.log('Image URL:', dataToSubmit.image_url)
```

## Cách debug

### Bước 1: Mở Browser Console
```bash
# Chrome/Edge
F12 hoặc Cmd+Option+I (Mac)

# Chọn tab "Console"
```

### Bước 2: Upload ảnh và submit
1. Vào trang chi tiết sản phẩm
2. Click nút Edit
3. Upload ảnh mới
4. Click "Lưu"
5. Xem console logs

### Bước 3: Kiểm tra logs
```
✅ Nếu thấy:
Submitting product data: { ..., image_url: "https://..." }
Image URL: https://...

→ Data đã được gửi đúng, vấn đề ở backend

❌ Nếu thấy:
Submitting product data: { ..., image_url: "" }
Image URL: 

→ formData không có image_url, vấn đề ở frontend
```

## Kiểm tra từng bước

### 1. Upload ảnh thành công?
```tsx
// Trong handleImageSelect, sau khi upload:
console.log('Upload success, public URL:', publicUrl)
console.log('Updated formData:', formData)
```

Nếu thấy URL → Upload OK ✅

### 2. formData có image_url?
```tsx
// Trước khi submit:
console.log('Current formData:', formData)
```

Nếu có image_url → formData OK ✅

### 3. Data được gửi đến server?
```tsx
// Trong handleSubmit:
console.log('Submitting:', dataToSubmit)
```

Nếu có image_url → Submit OK ✅

### 4. Server nhận được data?
```tsx
// Trong app/sales/actions.ts - updateProduct:
export async function updateProduct(id: number, data: any) {
    console.log('Server received data:', data)
    console.log('Image URL:', data.image_url)
    // ...
}
```

Nếu có image_url → Server OK ✅

### 5. Database được update?
```sql
-- Check trong Supabase SQL Editor:
SELECT id, name, image_url, updated_at 
FROM products 
WHERE id = YOUR_PRODUCT_ID
ORDER BY updated_at DESC;
```

## Các trường hợp thường gặp

### Case 1: formData không có image_url
**Nguyên nhân:** Upload thành công nhưng không set vào formData

**Fix:**
```tsx
// Trong handleImageSelect, sau upload:
setFormData(prev => ({ ...prev, image_url: publicUrl }))
```

### Case 2: formData bị reset khi submit
**Nguyên nhân:** useEffect reset formData

**Fix:** Đã fix bằng cách sync với product prop

### Case 3: Server không nhận được image_url
**Nguyên nhân:** dataToSubmit không spread formData đúng

**Fix:**
```tsx
const dataToSubmit = {
    ...formData,
    price: Number(formData.price),
    stock: Number(formData.stock),
    image_url: formData.image_url || '' // Explicit
}
```

### Case 4: Database không update
**Nguyên nhân:** RLS policy hoặc column không tồn tại

**Fix:**
```sql
-- Check column exists:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'image_url';

-- Check RLS policy:
SELECT * FROM pg_policies 
WHERE tablename = 'products';
```

## Test checklist

- [ ] Upload ảnh → Thấy preview
- [ ] Console log → Thấy public URL
- [ ] formData → Có image_url
- [ ] Submit → Console log có image_url
- [ ] Database → Có image_url trong table
- [ ] Refresh page → Ảnh hiển thị

## Kết quả mong đợi

Sau khi fix:
1. ✅ Upload ảnh thành công
2. ✅ formData có image_url
3. ✅ Submit gửi image_url
4. ✅ Database lưu image_url
5. ✅ Refresh page thấy ảnh mới

## Files liên quan

- `components/sales/ProductDialog.tsx` - Upload và submit
- `app/sales/actions.ts` - Server action update
- `app/sales/inventory/[id]/page.tsx` - Display image

## Next steps

Nếu vẫn không work:
1. Check console logs theo từng bước
2. Check Supabase logs
3. Check database schema
4. Check RLS policies
