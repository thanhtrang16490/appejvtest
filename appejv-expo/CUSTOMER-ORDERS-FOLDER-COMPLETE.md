# Customer Orders Folder - Hoàn thành

## Tổng quan
Đã sao chép toàn bộ folder orders từ admin sang customer và điều chỉnh phù hợp với quyền và chức năng của customer.

## Cấu trúc folder

```
app/(customer)/orders/
├── _layout.tsx          # Stack layout cho orders
├── index.tsx            # Danh sách đơn hàng
└── [id].tsx             # Chi tiết đơn hàng
```

## Files đã tạo

### 1. `orders/_layout.tsx`
- Stack layout đơn giản
- headerShown: false để sử dụng custom header

### 2. `orders/index.tsx` (di chuyển từ orders.tsx)
- Danh sách đơn hàng của customer
- Filter theo status tabs
- Navigate đến chi tiết: `router.push(\`/(customer)/orders/${order.id}\`)`
- Bottom nav auto-hide
- Pull to refresh
- Auto refresh với useFocusEffect

### 3. `orders/[id].tsx` (sao chép từ admin)
- Chi tiết đơn hàng đầy đủ
- Chỉ xem đơn của chính mình
- Có thể hủy đơn nháp
- Không có chức năng update status (chỉ admin/sale)

## Thay đổi so với Admin

### Security & Permissions
```typescript
// Admin: Check role
if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
  router.replace('/(auth)/login')
  return
}

// Customer: Chỉ fetch đơn của mình
const { data: orderData } = await supabase
  .from('orders')
  .select('*')
  .eq('id', id)
  .eq('customer_id', authUser.id) // Security: Only own orders
  .single()
```

### Removed Features
- ❌ Customer info section (không cần vì là đơn của mình)
- ❌ Update status buttons (chỉ admin/sale có quyền)
- ❌ Next status flow (ordered → shipping → paid → completed)
- ❌ Profile role check

### Added Features
- ✅ Status info card cho đơn đang xử lý
- ✅ Chỉ cho phép hủy đơn nháp
- ✅ Security check: chỉ xem/hủy đơn của mình
- ✅ Navigate back sau khi hủy thành công

### UI Changes
- Màu chính: #10b981 (xanh lá) thay vì #175ead (xanh dương)
- Icon colors: xanh lá
- Background colors: #d1fae5 (xanh lá nhạt)
- Sale avatar background: #d1fae5
- Summary total color: #10b981

## Chức năng Customer

### Xem đơn hàng
- ✅ Danh sách đơn hàng với filter tabs
- ✅ Chi tiết đơn hàng đầy đủ
- ✅ Thông tin sản phẩm
- ✅ Tổng kết đơn hàng
- ✅ Thông tin nhân viên phụ trách (nếu có)

### Hủy đơn hàng
- ✅ Chỉ hủy được đơn nháp (status = 'draft')
- ✅ Confirm modal trước khi hủy
- ✅ Success modal sau khi hủy
- ✅ Auto navigate back sau khi hủy
- ✅ Security: chỉ hủy đơn của mình

### Theo dõi trạng thái
- ✅ Status badge với màu sắc
- ✅ Status icon
- ✅ Timeline (có thể thêm sau)
- ✅ Info card cho đơn đang xử lý

## Security Features

### 1. Order Access Control
```typescript
// Chỉ fetch đơn của customer
.eq('customer_id', authUser.id)
```

### 2. Cancel Order Security
```typescript
// Chỉ hủy đơn của mình
.update({ status: 'cancelled' })
.eq('id', id)
.eq('customer_id', user?.id)
```

### 3. Redirect Protection
```typescript
// Redirect về customer login nếu không phải customer
if (!authUser) {
  router.replace('/(auth)/customer-login')
  return
}
```

## UI Components

### Order Header Card
- Colored top bar theo status
- Large icon với status color
- Order number và date
- Status badge

### Order Items List
- Product icon (xanh lá)
- Product name, code
- Quantity
- Price at order
- Item total

### Summary Card
- Subtotal
- Discount (nếu có)
- Total với màu xanh lá

### Action Buttons
- Cancel button (chỉ draft orders)
- Red color scheme
- Confirm modal

### Status Info Card
- Green background (#d1fae5)
- Info icon
- Helpful message

## Navigation Flow

```
Orders List (index.tsx)
  ↓ Click "Chi tiết"
Order Detail ([id].tsx)
  ↓ Click "Hủy đơn" (draft only)
Confirm Modal
  ↓ Confirm
Success Modal
  ↓ Close
Back to Orders List
```

## Testing Checklist

### Orders List
- [ ] Hiển thị đúng đơn hàng của customer
- [ ] Filter tabs hoạt động
- [ ] Navigate đến chi tiết
- [ ] Pull to refresh
- [ ] Auto refresh khi focus
- [ ] Bottom nav auto-hide
- [ ] Empty state

### Order Detail
- [ ] Hiển thị đầy đủ thông tin
- [ ] Chỉ xem được đơn của mình
- [ ] Không xem được đơn của người khác
- [ ] Hủy đơn nháp thành công
- [ ] Không hủy được đơn khác draft
- [ ] Success modal hiển thị
- [ ] Navigate back sau khi hủy
- [ ] Pull to refresh
- [ ] Auto refresh khi focus

### Security
- [ ] Không xem được đơn của người khác
- [ ] Không hủy được đơn của người khác
- [ ] Redirect về login nếu không authenticated
- [ ] Chỉ hủy được đơn nháp

## Performance
- ✅ useFocusEffect với dependency check
- ✅ Memoized callbacks
- ✅ Efficient queries với .eq()
- ✅ Single query cho order + items
- ✅ Conditional rendering

## Next Steps

### 1. Order Timeline
Thêm timeline hiển thị lịch sử trạng thái:
- Draft → Ordered → Shipping → Paid → Completed
- Timestamps cho mỗi status
- Visual progress indicator

### 2. Order Tracking
- Tracking number
- Delivery status
- Estimated delivery date
- Map integration (optional)

### 3. Reorder Feature
- Button "Đặt lại" trên order detail
- Copy items to cart
- Navigate to selling page

### 4. Order Rating
- Rate order sau khi completed
- Feedback form
- Star rating

### 5. Order Notifications
- Push notifications khi status thay đổi
- In-app notifications
- Email notifications

## Files Summary
- ✅ `app/(customer)/orders/_layout.tsx` - Layout
- ✅ `app/(customer)/orders/index.tsx` - List page
- ✅ `app/(customer)/orders/[id].tsx` - Detail page
- ❌ `app/(customer)/orders.tsx` - Deleted (moved to index.tsx)

## Màu sắc Customer Theme
- Primary: #10b981 (green)
- Light: #d1fae5 (light green)
- Dark: #065f46 (dark green)
- Background: #f0f9ff (light blue - giữ nguyên)
