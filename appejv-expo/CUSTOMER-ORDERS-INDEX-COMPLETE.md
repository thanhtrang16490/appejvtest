# Customer Orders Index - Hoàn thành

## Tổng quan
Đã sao chép và điều chỉnh file `orders/index.tsx` từ admin sang customer với đầy đủ tính năng và UI/UX tương tự.

## Thay đổi so với Admin

### 1. Header Component
```typescript
// Admin: Logo + Menu button
<View style={styles.topHeader}>
  <Image source={require('../../../assets/icon.png')} />
  <TouchableOpacity onPress={() => router.push('/(sales)/menu')}>
    <Ionicons name="menu" />
  </TouchableOpacity>
</View>

// Customer: CustomerHeader component
<CustomerHeader />
```

### 2. Fetch Orders Logic
```typescript
// Admin: Fetch based on role (sale/admin/sale_admin)
const isSale = role === 'sale'
const isSaleAdmin = role === 'sale_admin'
if (isSale) {
  query = query.eq('sale_id', userId)
} else if (isSaleAdmin) {
  query = query.in('sale_id', [userId, ...managedSaleIds])
}

// Customer: Chỉ fetch đơn của mình
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('customer_id', userId)
  .order('created_at', { ascending: false })
```

### 3. Order Card Display
```typescript
// Admin: Hiển thị customer name
{order.customer && (
  <Text style={styles.customerName}>{order.customer.name}</Text>
)}

// Customer: Hiển thị sale person name
{order.sale && (
  <Text style={styles.saleName}>NV: {order.sale.full_name}</Text>
)}
```

### 4. Action Buttons
```typescript
// Admin: Chi tiết + Update Status
<TouchableOpacity style={styles.actionButtonOutline}>
  <Text>Chi tiết</Text>
</TouchableOpacity>
{nextStatus && (
  <TouchableOpacity style={[styles.actionButton, { backgroundColor: nextStatus.color }]}>
    <Text>{nextStatus.label}</Text>
  </TouchableOpacity>
)}

// Customer: Chỉ có Chi tiết
<TouchableOpacity style={styles.actionButton}>
  <Text>Chi tiết</Text>
</TouchableOpacity>
```

### 5. Colors
- Admin: `#175ead` (xanh dương)
- Customer: `#10b981` (xanh lá)

### 6. Navigation
- Admin: `router.push('/(sales)/selling')`
- Customer: `router.push('/(customer)/selling')`
- Admin: `router.push(\`/(sales)/orders/${order.id}\`)`
- Customer: `router.push(\`/(customer)/orders/${order.id}\`)`

### 7. Redirect
- Admin: `router.replace('/(auth)/login')`
- Customer: `router.replace('/(auth)/customer-login')`

## Features giữ nguyên

### ✅ Layout Structure
- Header với title + subtitle + add button
- Tabs horizontal scroll
- Orders list với scroll
- Empty state
- Pull to refresh
- Auto refresh với useFocusEffect

### ✅ Order Card
- Icon với background color
- Order number + status badge
- Meta info (ID, date)
- Amount display
- Action button

### ✅ Performance
- Bottom nav auto-hide khi scroll
- Scroll handler với debounce
- useFocusEffect với dependency check
- Efficient queries

### ✅ Data Fetching
- Fetch orders với relations
- Fetch sale person info
- Map profiles data
- Error handling

## Removed Features

### ❌ Role-based Logic
- Không cần check role (sale/admin/sale_admin)
- Không cần fetch managed sales
- Không cần conditional queries

### ❌ Update Status
- Không có nút update status
- Không có getNextStatus function
- Không có handleUpdateStatus function
- Không có updating state
- Không có SuccessModal

### ❌ useTabBarHeight Hook
- Admin dùng để tính paddingBottom động
- Customer dùng fixed paddingBottom: 100

### ❌ Customer Info Display
- Admin hiển thị customer name
- Customer không cần (vì là đơn của mình)

## Added Features

### ✅ Sale Person Display
- Hiển thị tên nhân viên phụ trách (nếu có)
- Màu xanh lá (#10b981)
- Format: "NV: [Tên nhân viên]"

### ✅ CustomerHeader
- Sử dụng component chung
- Logo + App name + Account button
- Consistent với các trang customer khác

## Code Structure

### Imports
```typescript
import CustomerHeader from '../../../src/components/CustomerHeader'
import { emitScrollVisibility } from '../_layout'
// Không cần: SuccessModal, useTabBarHeight, Image, Platform
```

### States
```typescript
const [orders, setOrders] = useState<any[]>([])
const [activeTab, setActiveTab] = useState('draft')
const [loading, setLoading] = useState(true)
const [refreshing, setRefreshing] = useState(false)
const lastScrollY = useRef<number>(0)
const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
// Không cần: profile, updating, showSuccessModal, successMessage
```

### Functions
```typescript
fetchData()           // Simplified - no role check
fetchOrders(userId)   // Only customer's orders
handleScroll()        // Bottom nav auto-hide
onRefresh()           // Pull to refresh
formatCurrency()      // Format VND
getFilteredOrders()   // Filter by tab
// Không cần: handleUpdateStatus, getNextStatus
```

## Styling

### Colors
- Primary: `#10b981` (green)
- Icon background: `#d1fae5` (light green)
- Tab active: `#10b981`
- Add button: `#10b981`
- Action button: `#10b981`
- Sale name: `#10b981`

### Layout
- Container: `#f0f9ff` (light blue background)
- Cards: white với shadow
- Border radius: 16px (cards), 20px (buttons)
- Padding: 16px
- Gap: 12px

## Testing Checklist

### Data Fetching
- [ ] Chỉ fetch đơn của customer
- [ ] Fetch sale person info đúng
- [ ] Handle empty orders
- [ ] Handle no sale person
- [ ] Error handling

### UI/UX
- [ ] CustomerHeader hiển thị đúng
- [ ] Tabs filter hoạt động
- [ ] Scroll smooth
- [ ] Bottom nav auto-hide
- [ ] Pull to refresh
- [ ] Auto refresh khi focus
- [ ] Empty state hiển thị

### Navigation
- [ ] Navigate đến chi tiết đúng
- [ ] Navigate đến selling page
- [ ] Redirect về customer-login nếu không auth

### Display
- [ ] Order info đầy đủ
- [ ] Status badge đúng màu
- [ ] Amount format đúng
- [ ] Sale name hiển thị (nếu có)
- [ ] Date format đúng

## Performance Optimizations

### ✅ Scroll Handler
- Debounce với timeout 2000ms
- Check scroll diff > 5px
- Auto show sau 2s không scroll

### ✅ Data Fetching
- Single query cho orders
- Batch fetch profiles
- Map data efficiently
- Filter in memory

### ✅ Re-render Prevention
- useFocusEffect với dependency
- Conditional rendering
- Efficient state updates

## Files Summary
- ✅ `app/(customer)/orders/index.tsx` - Updated với full features
- ✅ `app/(customer)/orders/[id].tsx` - Detail page
- ✅ `app/(customer)/orders/_layout.tsx` - Layout

## Next Steps

### 1. Add Order Count
Hiển thị số lượng đơn hàng trong mỗi tab:
```typescript
const tabs = [
  { id: 'draft', label: `Nháp (${draftCount})` },
  { id: 'ordered', label: `Đặt hàng (${orderedCount})` },
  // ...
]
```

### 2. Add Search
Thêm search bar để tìm đơn hàng:
- Search by order ID
- Search by date
- Search by amount

### 3. Add Sort Options
- Sort by date (newest/oldest)
- Sort by amount (high/low)
- Sort by status

### 4. Add Filter Options
- Filter by date range
- Filter by amount range
- Filter by sale person

### 5. Infinite Scroll
- Load more khi scroll đến cuối
- Pagination
- Loading indicator

## Comparison Summary

| Feature | Admin | Customer |
|---------|-------|----------|
| Header | Logo + Menu | CustomerHeader |
| Fetch Logic | Role-based | Customer only |
| Display | Customer name | Sale name |
| Actions | Detail + Update | Detail only |
| Colors | Blue (#175ead) | Green (#10b981) |
| Update Status | ✅ | ❌ |
| Success Modal | ✅ | ❌ |
| Tab Bar Height | Dynamic | Fixed |
| Redirect | /login | /customer-login |
