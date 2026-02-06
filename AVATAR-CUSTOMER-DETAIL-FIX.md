# Fix: Avatar không hiển thị trong trang chi tiết khách hàng

## Vấn đề
Khi admin upload avatar cho khách hàng từ CustomerDialog, avatar mới không hiển thị trong trang chi tiết khách hàng (`/sales/customers/[id]`).

## Nguyên nhân

### 1. Sử dụng DiceBear API thay vì database
Trang chi tiết khách hàng đang hardcode sử dụng DiceBear API:
```typescript
// ❌ SAI - Không dùng avatar từ database
<AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
```

### 2. Không refetch data sau khi update
CustomerDialog không có callback để refetch data sau khi update thành công.

### 3. Browser cache
Ngay cả khi fix được 1 & 2, browser vẫn cache ảnh cũ.

## Giải pháp đã áp dụng

### 1. Sử dụng avatar từ database
```typescript
// ✅ ĐÚNG - Dùng avatar_url từ database
<AvatarImage src={customer.avatar_url ? `${customer.avatar_url}?v=${avatarKey}` : undefined} />
```

### 2. Thêm cache-busting với avatarKey
```typescript
// app/sales/customers/[id]/page.tsx
const [avatarKey, setAvatarKey] = useState(Date.now())

// Update key khi fetch data
const fetchData = async () => {
    // ... fetch customer
    setCustomer(customerData)
    setAvatarKey(Date.now()) // ✅ Bust cache
}
```

### 3. Refetch data sau khi update
```typescript
// components/sales/CustomerDetailActions.tsx
interface CustomerDetailActionsProps {
    customer: any
    isAdmin: boolean
    onSuccess?: () => void  // ✅ Thêm callback
}

const handleEditSuccess = () => {
    setIsEditOpen(false)
    if (onSuccess) {
        onSuccess()  // ✅ Gọi refetch
    }
}

<CustomerDialog
    customer={customer}
    isOpen={isEditOpen}
    onOpenChange={setIsEditOpen}
    onSuccess={handleEditSuccess}  // ✅ Pass callback
    isAdmin={isAdmin}
/>
```

### 4. Pass callback từ page
```typescript
// app/sales/customers/[id]/page.tsx
<CustomerDetailActions 
    customer={customer} 
    isAdmin={isAdmin} 
    onSuccess={fetchData}  // ✅ Pass refetch function
/>
```

### 5. Chuyển fetchData ra ngoài useEffect
```typescript
// ❌ Trước: fetchData bên trong useEffect
useEffect(() => {
    async function fetchData() {
        // ...
    }
    fetchData()
}, [id, router])

// ✅ Sau: fetchData ở ngoài, có thể gọi từ callback
const fetchData = async () => {
    // ...
}

useEffect(() => {
    fetchData()
}, [id, router])
```

## Files đã sửa

### 1. app/sales/customers/[id]/page.tsx
**Thay đổi:**
- Thêm `avatarKey` state
- Chuyển `fetchData` ra ngoài useEffect
- Update `avatarKey` trong `fetchData()`
- Đổi từ DiceBear API sang `customer.avatar_url`
- Thêm `?v=${avatarKey}` vào avatar URL
- Pass `onSuccess={fetchData}` cho CustomerDetailActions

**Trước:**
```typescript
<Avatar className="h-24 w-24">
    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
    <AvatarFallback>...</AvatarFallback>
</Avatar>

<CustomerDetailActions customer={customer} isAdmin={isAdmin} />
```

**Sau:**
```typescript
const [avatarKey, setAvatarKey] = useState(Date.now())

const fetchData = async () => {
    // ... fetch logic
    setCustomer(customerData)
    setAvatarKey(Date.now())
}

<Avatar className="h-24 w-24">
    <AvatarImage src={customer.avatar_url ? `${customer.avatar_url}?v=${avatarKey}` : undefined} />
    <AvatarFallback>...</AvatarFallback>
</Avatar>

<CustomerDetailActions customer={customer} isAdmin={isAdmin} onSuccess={fetchData} />
```

### 2. components/sales/CustomerDetailActions.tsx
**Thay đổi:**
- Thêm `onSuccess` prop với interface
- Tạo `handleEditSuccess` để gọi callback
- Pass `onSuccess={handleEditSuccess}` cho CustomerDialog

**Trước:**
```typescript
export function CustomerDetailActions({ customer, isAdmin }: { customer: any, isAdmin: boolean }) {
    // ...
    <CustomerDialog
        customer={customer}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        isAdmin={isAdmin}
    />
}
```

**Sau:**
```typescript
interface CustomerDetailActionsProps {
    customer: any
    isAdmin: boolean
    onSuccess?: () => void
}

export function CustomerDetailActions({ customer, isAdmin, onSuccess }: CustomerDetailActionsProps) {
    const handleEditSuccess = () => {
        setIsEditOpen(false)
        if (onSuccess) {
            onSuccess()
        }
    }
    
    <CustomerDialog
        customer={customer}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={handleEditSuccess}
        isAdmin={isAdmin}
    />
}
```

## Luồng hoạt động

1. Admin mở trang chi tiết khách hàng
2. Click "Sửa" → Mở CustomerDialog
3. Upload avatar mới → Lưu vào Supabase Storage
4. Update database với `avatar_url` mới
5. CustomerDialog gọi `onSuccess()` callback
6. `handleEditSuccess()` được gọi
7. `fetchData()` được gọi để refetch customer data
8. `avatarKey` được update với timestamp mới
9. Avatar URL thay đổi: `url?v=old` → `url?v=new`
10. Browser thấy URL khác → load ảnh mới
11. Avatar hiển thị ngay lập tức

## So sánh với các trang khác

### ✅ Trang đã đúng từ đầu:
- **app/sales/customers/page.tsx** (Danh sách khách hàng)
  - Đã dùng `customer.avatar_url`
  - Refetch khi quay lại trang
  
- **app/customer/account/page.tsx** (Tài khoản customer)
  - Đã có avatarKey và refetch callback
  
- **app/customer/profile/page.tsx** (Profile customer)
  - Đã có avatarKey và refetch callback

### ❌ Trang đã sửa:
- **app/sales/customers/[id]/page.tsx** (Chi tiết khách hàng)
  - Đã sửa: Dùng `customer.avatar_url` thay vì DiceBear
  - Đã sửa: Thêm avatarKey và refetch callback

## Testing

### Test Case 1: Upload avatar mới
1. Login với tài khoản admin
2. Vào `/sales/customers`
3. Click vào một khách hàng
4. Click "Sửa"
5. Upload avatar mới
6. Click "Lưu thay đổi"
7. ✅ Avatar hiển thị ngay lập tức trong trang chi tiết
8. Quay lại danh sách khách hàng
9. ✅ Avatar mới cũng hiển thị trong danh sách

### Test Case 2: Xóa avatar
1. Mở CustomerDialog
2. Click X để xóa avatar
3. Click "Lưu thay đổi"
4. ✅ Avatar fallback (initials) hiển thị

### Test Case 3: Đổi avatar nhiều lần
1. Upload avatar A
2. ✅ Hiển thị avatar A
3. Sửa lại, upload avatar B
4. ✅ Hiển thị avatar B (không bị cache avatar A)

## Kết quả

✅ Avatar hiển thị đúng trong trang chi tiết khách hàng
✅ Avatar cập nhật ngay lập tức sau khi upload
✅ Không bị cache browser
✅ Consistent với các trang khác (account, profile)
✅ Fallback đúng khi không có avatar

## Notes

- DiceBear API chỉ nên dùng cho placeholder/demo, không nên dùng trong production
- Luôn ưu tiên dùng data từ database (`customer.avatar_url`)
- Cache-busting với `?v={timestamp}` là cách đơn giản và hiệu quả
- Callback pattern (`onSuccess`) giúp component reusable và dễ maintain
