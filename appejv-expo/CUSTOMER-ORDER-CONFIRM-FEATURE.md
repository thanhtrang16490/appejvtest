# Customer Order Confirm Feature - Hoàn thành

## Tổng quan
Đã thêm chức năng cho phép khách hàng chuyển đơn nháp (draft) sang đơn đặt hàng (ordered).

## Chức năng mới

### 1. Trang danh sách đơn hàng (orders/index.tsx)

#### Nút "Đặt hàng" trên order card
- Chỉ hiển thị cho đơn có status = 'draft'
- Nằm cạnh nút "Chi tiết"
- Màu xanh lá (#10b981)
- Loading state khi đang xử lý

#### Layout buttons
```typescript
<View style={styles.orderActions}>
  <TouchableOpacity style={styles.actionButtonOutline}>
    <Text>Chi tiết</Text>
  </TouchableOpacity>
  
  {order.status === 'draft' && (
    <TouchableOpacity style={styles.actionButton}>
      <Text>Đặt hàng</Text>
    </TouchableOpacity>
  )}
</View>
```

#### Function handleConfirmOrder
```typescript
const handleConfirmOrder = async (orderId: number) => {
  setUpdating(orderId)
  
  await supabase
    .from('orders')
    .update({ status: 'ordered' })
    .eq('id', orderId)
    .eq('customer_id', user?.id) // Security check
  
  setSuccessMessage('Đơn hàng đã được xác nhận!')
  setShowSuccessModal(true)
  
  await fetchOrders(user.id)
  setUpdating(null)
}
```

#### Success Modal
- Hiển thị sau khi xác nhận thành công
- Message: "Đơn hàng đã được xác nhận!"
- Auto refresh danh sách đơn hàng

### 2. Trang chi tiết đơn hàng (orders/[id].tsx)

#### Nút "Đặt hàng" + "Hủy đơn"
- Chỉ hiển thị cho đơn draft
- 2 buttons: "Đặt hàng" (xanh lá) và "Hủy đơn" (đỏ)
- Confirm modal trước khi thực hiện

#### Layout buttons
```typescript
{order.status === 'draft' && (
  <View style={styles.actionsContainer}>
    <TouchableOpacity style={styles.confirmButton}>
      <Ionicons name="checkmark-circle-outline" />
      <Text>Đặt hàng</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.cancelButton}>
      <Ionicons name="close-circle-outline" />
      <Text>Hủy đơn</Text>
    </TouchableOpacity>
  </View>
)}
```

#### Confirm Order Modal
```typescript
<ConfirmModal
  visible={showConfirmModal}
  title="Xác nhận đặt hàng"
  message="Bạn có chắc chắn muốn đặt đơn hàng #X? Đơn hàng sẽ được gửi đến nhân viên để xử lý."
  onConfirm={confirmOrder}
  confirmText="Đặt hàng"
  cancelText="Quay lại"
/>
```

#### Function confirmOrder
```typescript
const confirmOrder = async () => {
  setUpdating(true)
  
  await supabase
    .from('orders')
    .update({ status: 'ordered' })
    .eq('id', id)
    .eq('customer_id', user?.id) // Security check
  
  setSuccessMessage('Đơn hàng đã được xác nhận và gửi đến nhân viên!')
  setShowSuccessModal(true)
  
  fetchData() // Refresh to show new status
  setUpdating(false)
}
```

#### Success Modal Behavior
- Nếu xác nhận đơn: Stay on page (để xem status mới)
- Nếu hủy đơn: Navigate back

## Security

### Database Query
```typescript
// Chỉ update đơn của chính mình
.update({ status: 'ordered' })
.eq('id', orderId)
.eq('customer_id', user?.id) // Important security check
```

### Validation
```typescript
// Check status trước khi xác nhận
if (order.status !== 'draft') {
  Alert.alert('Thông báo', 'Chỉ có thể xác nhận đơn hàng ở trạng thái nháp')
  return
}
```

## UI/UX Flow

### Từ danh sách đơn hàng
1. User xem đơn nháp trong tab "Nháp"
2. Nhấn nút "Đặt hàng" trên order card
3. Loading indicator hiển thị
4. Success modal: "Đơn hàng đã được xác nhận!"
5. Đơn hàng tự động chuyển sang tab "Đặt hàng"
6. Danh sách refresh tự động

### Từ chi tiết đơn hàng
1. User mở chi tiết đơn nháp
2. Xem đầy đủ thông tin sản phẩm, tổng tiền
3. Nhấn nút "Đặt hàng"
4. Confirm modal: "Bạn có chắc chắn...?"
5. Nhấn "Đặt hàng" để xác nhận
6. Success modal: "Đơn hàng đã được xác nhận và gửi đến nhân viên!"
7. Status badge cập nhật thành "Đơn đặt hàng"
8. Nút "Đặt hàng" và "Hủy đơn" biến mất
9. Hiển thị status info card

## States Added

### orders/index.tsx
```typescript
const [updating, setUpdating] = useState<number | null>(null)
const [showSuccessModal, setShowSuccessModal] = useState(false)
const [successMessage, setSuccessMessage] = useState('')
```

### orders/[id].tsx
```typescript
const [showConfirmModal, setShowConfirmModal] = useState(false)
// showSuccessModal và successMessage đã có sẵn
```

## Styles Added

### orders/index.tsx
```typescript
actionButtonOutline: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  alignItems: 'center',
}
actionButtonOutlineText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#374151',
}
actionButtonDisabled: {
  opacity: 0.6,
}
```

### orders/[id].tsx
```typescript
confirmButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: '#10b981',
}
confirmButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: 'white',
}
```

## Status Flow

```
draft (Đơn nháp)
  ↓ Customer nhấn "Đặt hàng"
ordered (Đơn đặt hàng)
  ↓ Sale/Admin xử lý
shipping (Giao hàng)
  ↓ Sale/Admin xử lý
paid (Thanh toán)
  ↓ Sale/Admin xử lý
completed (Hoàn thành)
```

## Testing Checklist

### Danh sách đơn hàng
- [ ] Nút "Đặt hàng" chỉ hiển thị cho đơn nháp
- [ ] Nhấn "Đặt hàng" hiển thị loading
- [ ] Success modal hiển thị sau khi xác nhận
- [ ] Đơn hàng chuyển sang tab "Đặt hàng"
- [ ] Danh sách refresh tự động
- [ ] Không thể xác nhận đơn của người khác

### Chi tiết đơn hàng
- [ ] Nút "Đặt hàng" + "Hủy đơn" chỉ hiển thị cho đơn nháp
- [ ] Confirm modal hiển thị khi nhấn "Đặt hàng"
- [ ] Success modal hiển thị sau khi xác nhận
- [ ] Status badge cập nhật
- [ ] Buttons biến mất sau khi xác nhận
- [ ] Status info card hiển thị
- [ ] Stay on page sau khi xác nhận
- [ ] Navigate back sau khi hủy

### Security
- [ ] Chỉ xác nhận được đơn của mình
- [ ] Không xác nhận được đơn khác draft
- [ ] Database query có .eq('customer_id', user?.id)

### UI/UX
- [ ] Loading states hoạt động
- [ ] Success modals hiển thị đúng message
- [ ] Buttons disabled khi đang xử lý
- [ ] Colors đúng (xanh lá cho confirm, đỏ cho cancel)
- [ ] Icons hiển thị đúng

## Benefits

### Cho Customer
1. **Kiểm soát đơn hàng**: Có thể tạo đơn nháp và xác nhận sau
2. **Linh hoạt**: Có thể chỉnh sửa trước khi xác nhận
3. **Rõ ràng**: Biết được đơn nào đã gửi, đơn nào chưa
4. **An toàn**: Confirm modal tránh nhấn nhầm

### Cho Business
1. **Giảm đơn spam**: Customer phải xác nhận mới gửi đến sale
2. **Tăng chất lượng đơn**: Customer có thời gian kiểm tra
3. **Workflow rõ ràng**: Draft → Ordered → Processing
4. **Tracking tốt hơn**: Biết đơn nào customer đã xác nhận

## Future Enhancements

### 1. Edit Draft Order
- Cho phép chỉnh sửa đơn nháp
- Thêm/xóa sản phẩm
- Thay đổi số lượng

### 2. Auto-confirm Timer
- Tự động xác nhận sau X giờ
- Notification nhắc nhở
- Countdown timer

### 3. Batch Confirm
- Xác nhận nhiều đơn cùng lúc
- Checkbox selection
- Bulk action

### 4. Order Notes
- Thêm ghi chú khi xác nhận
- Yêu cầu đặc biệt
- Thời gian giao hàng mong muốn

### 5. Notification
- Push notification khi đơn được xác nhận
- Email confirmation
- SMS notification

## Files Modified
- ✅ `app/(customer)/orders/index.tsx` - Added confirm button and logic
- ✅ `app/(customer)/orders/[id].tsx` - Added confirm button and modal

## Summary
Khách hàng giờ có thể:
1. Tạo đơn nháp từ trang selling
2. Xem và kiểm tra đơn nháp
3. Xác nhận đơn nháp → chuyển thành đơn đặt hàng
4. Hoặc hủy đơn nháp nếu không muốn

Workflow rõ ràng và an toàn hơn!
