# Update: Chi tiết đơn hàng - Workflow mới

## Vấn đề
Trang chi tiết đơn hàng (`/sales/orders/[id]`) vẫn sử dụng workflow cũ, không phù hợp với workflow mới đã update.

## Workflow cũ vs mới

### ❌ Workflow cũ (đã loại bỏ)
```
pending → processing → shipping → completed
```

### ✅ Workflow mới (hiện tại)
```
draft → ordered → shipping → paid → completed
```

## Thay đổi đã thực hiện

### 1. Cập nhật statusConfig

**Trước:**
```typescript
const statusConfig = {
    pending: { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Edit2 },
    shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShoppingBag },
    completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle }
}

const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
```

**Sau:**
```typescript
const statusConfig = {
    draft: { label: 'Nháp', class: 'bg-gray-100 text-gray-700 border-gray-200', icon: Edit2 },
    ordered: { label: 'Đã đặt', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: ShoppingBag },
    shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShoppingBag },
    paid: { label: 'Đã thanh toán', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle }
}

const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.draft
```

### 2. Cập nhật Action Buttons

**Trước:**
```typescript
{order.status === 'pending' && (
    <Button onClick={() => handleUpdateStatus('processing')}>
        Xử lý
    </Button>
)}
{order.status === 'processing' && (
    <Button onClick={() => handleUpdateStatus('shipping')}>
        Giao hàng
    </Button>
)}
{order.status === 'shipping' && (
    <Button onClick={() => handleUpdateStatus('completed')}>
        Hoàn thành
    </Button>
)}
```

**Sau:**
```typescript
{order.status === 'draft' && (
    <Button onClick={() => handleUpdateStatus('ordered')}>
        Xác nhận đặt
    </Button>
)}
{order.status === 'ordered' && (
    <Button onClick={() => handleUpdateStatus('shipping')}>
        Giao hàng
    </Button>
)}
{order.status === 'shipping' && (
    <Button onClick={() => handleUpdateStatus('paid')}>
        Đã thanh toán
    </Button>
)}
{order.status === 'paid' && (
    <Button onClick={() => handleUpdateStatus('completed')}>
        Hoàn thành
    </Button>
)}
```

### 3. Cập nhật Cancel Button Logic

**Trước:**
```typescript
{order.status !== 'cancelled' && (
    <Button onClick={() => handleUpdateStatus('cancelled')} variant="destructive">
        {order.status === 'completed' ? "Trả & Hủy" : "Hủy đơn"}
    </Button>
)}
```

**Sau:**
```typescript
{order.status !== 'cancelled' && order.status !== 'completed' && (
    <Button onClick={() => handleUpdateStatus('cancelled')} variant="destructive">
        Hủy đơn
    </Button>
)}
```

**Lý do:** Không cho phép hủy đơn đã hoàn thành.

## Workflow chi tiết

### 1. Draft (Nháp)
- **Màu**: Xám (gray)
- **Icon**: Edit2
- **Mô tả**: Đơn hàng mới tạo, chưa xác nhận
- **Action**: "Xác nhận đặt" → chuyển sang `ordered`

### 2. Ordered (Đã đặt)
- **Màu**: Xanh dương (blue)
- **Icon**: ShoppingBag
- **Mô tả**: Đơn hàng đã được xác nhận
- **Action**: "Giao hàng" → chuyển sang `shipping`

### 3. Shipping (Đang giao)
- **Màu**: Tím (purple)
- **Icon**: ShoppingBag
- **Mô tả**: Đơn hàng đang được giao
- **Action**: "Đã thanh toán" → chuyển sang `paid`

### 4. Paid (Đã thanh toán)
- **Màu**: Xanh lá (emerald)
- **Icon**: CheckCircle2
- **Mô tả**: Khách hàng đã thanh toán
- **Action**: "Hoàn thành" → chuyển sang `completed`

### 5. Completed (Hoàn thành)
- **Màu**: Xanh lá (emerald)
- **Icon**: CheckCircle2
- **Mô tả**: Đơn hàng hoàn tất
- **Action**: Không có (không thể thay đổi)

### 6. Cancelled (Đã hủy)
- **Màu**: Đỏ (rose)
- **Icon**: AlertCircle
- **Mô tả**: Đơn hàng bị hủy
- **Action**: Không có (không thể thay đổi)

## Files đã cập nhật

### app/sales/orders/[id]/page.tsx
- ✅ Cập nhật `statusConfig` với 6 trạng thái mới
- ✅ Cập nhật action buttons theo workflow mới
- ✅ Cập nhật logic cancel button
- ✅ Thay đổi fallback status từ `pending` → `draft`

## Consistency với các trang khác

### ✅ Đã consistent:
- **app/sales/orders/page.tsx** - Danh sách đơn hàng
  - Đã update workflow mới
  - 5 tabs: Draft, Ordered, Shipping, Paid, Completed
  
- **app/sales/orders/[id]/page.tsx** - Chi tiết đơn hàng
  - ✅ Đã update workflow mới
  - Action buttons phù hợp với từng trạng thái

- **app/sales/customers/[id]/page.tsx** - Chi tiết khách hàng
  - Hiển thị orders với status badges
  - Sử dụng cùng statusConfig

## Testing

### Test Case 1: Draft → Ordered
1. Tạo đơn hàng mới (status = draft)
2. Vào chi tiết đơn hàng
3. ✅ Hiển thị badge "Nháp" màu xám
4. ✅ Có button "Xác nhận đặt"
5. Click "Xác nhận đặt"
6. ✅ Status chuyển sang "Đã đặt" màu xanh dương

### Test Case 2: Ordered → Shipping
1. Đơn hàng ở trạng thái "Đã đặt"
2. ✅ Có button "Giao hàng"
3. Click "Giao hàng"
4. ✅ Status chuyển sang "Đang giao" màu tím

### Test Case 3: Shipping → Paid
1. Đơn hàng ở trạng thái "Đang giao"
2. ✅ Có button "Đã thanh toán"
3. Click "Đã thanh toán"
4. ✅ Status chuyển sang "Đã thanh toán" màu xanh lá

### Test Case 4: Paid → Completed
1. Đơn hàng ở trạng thái "Đã thanh toán"
2. ✅ Có button "Hoàn thành"
3. Click "Hoàn thành"
4. ✅ Status chuyển sang "Hoàn thành"
5. ✅ Không còn button nào (không thể thay đổi)

### Test Case 5: Cancel Order
1. Đơn hàng ở bất kỳ trạng thái nào (trừ completed, cancelled)
2. ✅ Có button "Hủy đơn" màu đỏ
3. Click "Hủy đơn"
4. ✅ Status chuyển sang "Đã hủy"
5. ✅ Không còn button nào

### Test Case 6: Completed Order
1. Đơn hàng đã hoàn thành
2. ✅ Không có button "Hủy đơn"
3. ✅ Không có button nào để thay đổi status

## UI/UX Improvements

### Badge Colors
- **Draft**: Xám nhạt - Dễ phân biệt với các trạng thái khác
- **Ordered**: Xanh dương - Tích cực, đã xác nhận
- **Shipping**: Tím - Đang trong quá trình
- **Paid**: Xanh lá - Thành công, đã thanh toán
- **Completed**: Xanh lá đậm - Hoàn tất
- **Cancelled**: Đỏ - Cảnh báo, đã hủy

### Button Labels
- "Xác nhận đặt" - Rõ ràng hơn "Xử lý"
- "Giao hàng" - Giữ nguyên
- "Đã thanh toán" - Rõ ràng về hành động
- "Hoàn thành" - Giữ nguyên
- "Hủy đơn" - Đơn giản, rõ ràng

## Notes

- Workflow mới phù hợp hơn với quy trình kinh doanh thực tế
- Tách biệt rõ ràng giữa "thanh toán" và "hoàn thành"
- Không cho phép hủy đơn đã hoàn thành (business logic)
- Status "draft" cho phép tạo đơn hàng nháp trước khi xác nhận
- Consistent với tất cả các trang liên quan đến orders

## Kết quả

✅ Chi tiết đơn hàng hiển thị đúng workflow mới
✅ Action buttons phù hợp với từng trạng thái
✅ UI/UX rõ ràng, dễ hiểu
✅ Consistent với danh sách đơn hàng
✅ Business logic hợp lý (không hủy đơn đã hoàn thành)
