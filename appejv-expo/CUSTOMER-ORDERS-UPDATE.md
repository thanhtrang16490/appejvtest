# Customer Orders Page - Cập nhật hoàn thành

## Tổng quan
Đã cập nhật trang đơn hàng của customer dựa trên trang đơn hàng admin, với các cải tiến về UI/UX và chức năng.

## Thay đổi chính

### 1. Header Component
- ✅ Sử dụng CustomerHeader component thay vì header riêng
- ✅ Giảm duplicate code
- ✅ Consistent với các trang customer khác

### 2. Bottom Navigation Auto-hide
- ✅ Thêm scroll handler với debounce
- ✅ Hide bottom nav khi scroll xuống
- ✅ Show bottom nav khi scroll lên hoặc dừng scroll
- ✅ Smooth animation với spring effect

### 3. Layout Improvements
- ✅ Thêm nút "+" để tạo đơn hàng mới (navigate to selling page)
- ✅ Cải thiện order card layout:
  - Order info bên trái với icon, title, badge, meta
  - Amount bên phải
  - Action button ở dưới
- ✅ Rounded corners lớn hơn (16px thay vì 12px)
- ✅ Better spacing và padding

### 4. Tabs Update
- ✅ Thay đổi từ "Tất cả" sang "Nháp" làm tab đầu tiên
- ✅ Tabs: Nháp, Đặt hàng, Giao hàng, Hoàn thành
- ✅ Màu xanh lá (#10b981) cho active tab
- ✅ Filter theo status thay vì show all

### 5. Order Card Enhancements
- ✅ Thêm order meta (ID, date) giống admin
- ✅ Layout 2 cột: info bên trái, amount bên phải
- ✅ Action button "Chi tiết" với màu xanh lá
- ✅ Icon background màu xanh lá nhạt (#d1fae5)

### 6. Auto Refresh
- ✅ Thêm useFocusEffect để auto refresh khi quay lại trang
- ✅ Chỉ refresh khi không đang loading hoặc refreshing
- ✅ Pull to refresh vẫn hoạt động

### 7. TypeScript Fixes
- ✅ Fix useRef type annotations
- ✅ `useRef<number>(0)` cho lastScrollY
- ✅ `useRef<NodeJS.Timeout | null>(null)` cho scrollTimeout

## So sánh với Admin Orders

### Giống nhau:
- Status map và badges
- Order card layout structure
- Scroll handler cho bottom nav
- Auto refresh với useFocusEffect
- Pull to refresh
- Empty state

### Khác biệt:
- Customer: màu xanh lá (#10b981)
- Admin: màu xanh dương (#175ead)
- Customer: không có nút update status
- Customer: chỉ xem đơn của mình
- Customer: nút "Chi tiết" thay vì "Chi tiết" + "Update status"
- Customer: CustomerHeader thay vì logo + menu

## Features

### ✅ Order List
- Hiển thị tất cả đơn hàng của customer
- Filter theo status tabs
- Order card với đầy đủ thông tin:
  - Order ID
  - Status badge với màu sắc
  - Created date
  - Total amount
- Pull to refresh
- Auto refresh khi focus

### ✅ Navigation
- Nút "+" để tạo đơn mới → navigate to selling page
- Nút "Chi tiết" trên mỗi order (TODO: implement detail page)

### ✅ UI/UX
- Bottom nav auto-hide khi scroll
- Smooth animations
- Loading states
- Empty states
- Green theme (#10b981)

## Files thay đổi
- `appejv-expo/app/(customer)/orders.tsx` - Main orders page

## TODO - Next Steps

### 1. Order Detail Page
Cần tạo trang chi tiết đơn hàng tại `app/(customer)/orders/[id].tsx`:
- Hiển thị thông tin đơn hàng đầy đủ
- Danh sách sản phẩm trong đơn
- Timeline trạng thái đơn hàng
- Thông tin giao hàng (nếu có)
- Có thể hủy đơn nếu status = 'draft'

### 2. Order Status Updates
- Customer có thể hủy đơn nháp
- Customer có thể xác nhận đã nhận hàng (completed)
- Notifications khi status thay đổi

### 3. Order Search/Filter
- Search by order ID
- Filter by date range
- Sort options

### 4. Order History
- Show more details in list
- Add pagination for many orders

## Testing Checklist
- [ ] Customer có thể xem danh sách đơn hàng
- [ ] Filter tabs hoạt động đúng
- [ ] Pull to refresh hoạt động
- [ ] Auto refresh khi quay lại trang
- [ ] Bottom nav auto-hide khi scroll
- [ ] Nút "+" navigate đến selling page
- [ ] Nút "Chi tiết" log order ID (TODO: navigate to detail)
- [ ] Empty state hiển thị đúng
- [ ] Loading state hiển thị đúng
- [ ] Màu xanh lá hiển thị đúng

## Performance
- ✅ Scroll handler với debounce
- ✅ useFocusEffect với dependency check
- ✅ Memoized callbacks
- ✅ Efficient re-renders
