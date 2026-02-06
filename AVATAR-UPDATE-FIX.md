# Fix: Avatar không cập nhật sau khi upload

## Vấn đề
Sau khi upload avatar mới, ảnh không thay đổi ngay lập tức trên trang profile/account của customer.

## Nguyên nhân
1. **Browser cache**: Trình duyệt cache ảnh cũ với cùng URL
2. **Không refetch data**: Sau khi update, page reload nhưng browser vẫn dùng cached image

## Giải pháp đã áp dụng

### 1. Thêm cache-busting parameter
Thêm query parameter `?v={timestamp}` vào avatar URL để force browser reload image:

```typescript
// app/customer/account/page.tsx
const [avatarKey, setAvatarKey] = useState(Date.now())

<AvatarImage 
    src={customer?.avatar_url ? `${customer.avatar_url}?v=${avatarKey}` : undefined} 
    alt={customer?.name || 'Avatar'} 
/>
```

### 2. Refetch data thay vì reload page
Thay vì `window.location.reload()`, gọi callback để refetch data:

```typescript
// components/account/EditProfileSheet.tsx
interface EditProfileSheetProps {
    currentName: string
    currentAddress: string
    currentAvatar?: string | null
    onSuccess?: () => void  // ✅ Thêm callback
}

async function handleSubmit(formData: FormData) {
    // ... update logic
    
    if (result?.error) {
        toast.error(result.error)
    } else {
        toast.success('Cập nhật thông tin thành công')
        setOpen(false)
        if (onSuccess) {
            onSuccess()  // ✅ Gọi callback để refetch
        } else {
            window.location.reload()  // Fallback
        }
    }
}
```

### 3. Update avatarKey khi refetch
Mỗi lần fetch data, update avatarKey để bust cache:

```typescript
// app/customer/account/page.tsx
const fetchUserData = async () => {
    // ... fetch logic
    
    setCustomer(customerData)
    setAvatarKey(Date.now())  // ✅ Update key để bust cache
}
```

### 4. Pass callback từ parent component
```typescript
// app/customer/account/page.tsx
<EditProfileSheet
    currentName={customer?.name || ''}
    currentAddress={customer?.address || ''}
    currentAvatar={customer?.avatar_url}
    onSuccess={fetchUserData}  // ✅ Pass refetch function
/>
```

## Files đã sửa

1. **components/account/EditProfileSheet.tsx**
   - Thêm `onSuccess` prop
   - Gọi callback thay vì reload page

2. **app/customer/account/page.tsx**
   - Thêm `avatarKey` state
   - Update avatarKey trong `fetchUserData()`
   - Thêm `?v=${avatarKey}` vào avatar URL
   - Pass `onSuccess={fetchUserData}` cho EditProfileSheet

3. **app/customer/profile/page.tsx**
   - Thêm `avatarKey` state
   - Update avatarKey trong `fetchUserData()`
   - Thêm `?v=${avatarKey}` vào avatar URL

## Cách hoạt động

1. User upload avatar mới
2. Avatar được upload lên Supabase Storage
3. URL được lưu vào database
4. `onSuccess()` callback được gọi
5. `fetchUserData()` fetch lại customer data
6. `avatarKey` được update với timestamp mới
7. Avatar URL thay đổi: `url?v=1234567890` → `url?v=1234567891`
8. Browser thấy URL khác → fetch ảnh mới thay vì dùng cache

## Kết quả

✅ Avatar cập nhật ngay lập tức sau khi upload
✅ Không cần reload page
✅ Không bị cache browser
✅ UX mượt mà hơn

## Testing

1. Đăng nhập với tài khoản customer
2. Vào trang Account (`/customer/account`)
3. Click "Chỉnh sửa"
4. Upload avatar mới
5. Click "Lưu thay đổi"
6. ✅ Avatar hiển thị ngay lập tức
7. Chuyển sang tab Profile (`/customer/profile`)
8. ✅ Avatar mới cũng hiển thị đúng

## Notes

- Cache-busting parameter `?v={timestamp}` không ảnh hưởng đến Supabase Storage
- Supabase Storage vẫn serve cùng một file, chỉ browser nghĩ là file khác
- Approach này tốt hơn `?t=${Date.now()}` vì không thay đổi mỗi render
- `avatarKey` chỉ update khi fetch data mới, không phải mỗi render
