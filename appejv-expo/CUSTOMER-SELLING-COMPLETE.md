# Customer Selling Page - Hoàn thành

## Tổng quan
Đã sao chép và điều chỉnh trang selling từ admin sang customer, cho phép khách hàng tự đặt hàng cho chính mình.

## Thay đổi chính

### 1. Xóa phần Customer Search
- ✅ Xóa toàn bộ section tìm kiếm và chọn khách hàng
- ✅ Khách hàng tự động đặt hàng cho chính mình (customer_id = user.id)
- ✅ Không cần chọn sale person (sale_id = null)

### 2. Xóa states không dùng
- ✅ `customers`, `setCustomers`
- ✅ `selectedCustomer`, `setSelectedCustomer`
- ✅ `customerSearchQuery`, `setCustomerSearchQuery`
- ✅ `debouncedCustomerSearchQuery`
- ✅ `createdOrderId`, `setCreatedOrderId`
- ✅ `editingQuantity`, `setEditingQuantity`
- ✅ `getFilteredCustomers` useMemo

### 3. Thay đổi màu sắc
Đổi từ xanh dương (#175ead) sang xanh lá (#10b981):
- ✅ Button colors (done button, product button, quantity modal buttons)
- ✅ Icon colors (product icons, quick search icons)
- ✅ Text colors (prices, totals, cart items)
- ✅ Background colors (avatars, badges, placeholders)
- ✅ Border colors (inputs, modals)
- ✅ Shadow colors

### 4. Thay đổi text
- ✅ Header: "Bán hàng" → "Đặt hàng"
- ✅ Empty state: "Đơn này bạn bán hàng gì?" → "Bạn muốn đặt gì hôm nay?"

### 5. Logic đặt hàng
```typescript
// Customer orders for themselves
const { data: orderData, error: orderError } = await supabase
  .from('orders')
  .insert([{
    customer_id: user?.id,  // Tự đặt cho mình
    sale_id: null,          // Không có sale person
    status: 'draft',
    total_amount: totalAmount
  }])
```

### 6. Navigation
- ✅ Redirect về `/(customer)/orders` thay vì `/(sales)/orders`
- ✅ Redirect về `/(auth)/customer-login` nếu không phải customer

## Features giữ nguyên

### ✅ Product Selection
- Grid view với categories
- Quick search với debounce
- Product images và stock info
- Add to cart với toast notifications

### ✅ Cart Management
- Quantity controls (+/-)
- Edit quantity modal với large product image
- Remove items
- Total calculation
- Empty state

### ✅ Order Creation
- Create draft order
- Success modal với 2 options:
  - "Xem đơn hàng" → navigate to orders
  - "Tạo đơn mới" → reset form
- Auto reset on modal close

### ✅ UI/UX
- Toast notifications (slide from top)
- Memoized components (CartItem)
- Debounced search (300ms)
- FlatList optimization
- Loading states
- Error handling

## Màu sắc Customer Theme

### Primary Green: #10b981
- Buttons
- Icons
- Prices
- Active states

### Light Green: #d1fae5
- Backgrounds
- Badges
- Placeholders

### Background: #f0f9ff
- Container background (giữ nguyên)

## Files thay đổi
- `appejv-expo/app/(customer)/selling.tsx` - Main selling page

## Testing checklist
- [ ] Customer có thể xem danh sách sản phẩm
- [ ] Search và filter products hoạt động
- [ ] Add to cart với toast notification
- [ ] Edit quantity trong cart
- [ ] Create order thành công
- [ ] Navigate đến orders page
- [ ] Màu xanh lá hiển thị đúng
- [ ] Empty state hiển thị đúng text
- [ ] Non-customer không thể truy cập

## Next steps
1. Test trên thiết bị thật
2. Kiểm tra performance với nhiều products
3. Test với các edge cases (out of stock, etc.)
4. Có thể thêm order history preview
5. Có thể thêm favorite products
