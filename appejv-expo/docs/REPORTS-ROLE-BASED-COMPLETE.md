# Reports Role-Based Analytics - Complete ✅

## Tính năng đã thêm

Đã thêm phần báo cáo theo role cho **Admin** trong trang Reports, giống với appejv-app.

## Chi tiết

### 1. Tabs mới cho Admin
Admin sẽ thấy thêm 1 section với 3 tabs:
- **Khách hàng** (màu xanh lá) - Top customers theo doanh thu
- **Sale** (màu tím) - Top sales (role='sale') theo doanh thu
- **Sale Admin** (màu xanh dương) - Top sale admins (role='sale_admin') theo doanh thu

### 2. Dữ liệu hiển thị
Mỗi tab hiển thị top 5 với:
- Tên người dùng
- Progress bar với màu tương ứng
- Số đơn hàng
- Tổng doanh thu

### 3. Phân quyền
- **Admin**: Thấy tất cả (Products, Categories, Customers, Sales, Sale Admins)
- **Sale Admin**: Chỉ thấy Products và Categories (của nhóm mình)
- **Sale**: Chỉ thấy Products và Categories (của mình)

## Cấu trúc dữ liệu

### CustomerData
```typescript
{
  id: string
  name: string
  revenue: number
  orderCount: number
}
```

### SaleData
```typescript
{
  id: string
  name: string
  revenue: number
  orderCount: number
}
```

### SaleAdminData
```typescript
{
  id: string
  name: string
  revenue: number
  orderCount: number
}
```

## Query Logic

### Customers
- Lấy từ `orders.customer_id`
- Join với `profiles` để lấy `full_name`
- Aggregate theo `customer_id`

### Sales
- Lấy từ `orders.sale_id`
- Filter `profiles.role = 'sale'`
- Aggregate theo `sale_id`

### Sale Admins
- Lấy từ `orders.sale_id`
- Filter `profiles.role = 'sale_admin'`
- Aggregate theo `sale_id`

## UI Design

### Color Scheme
- **Customers**: Green (#10b981)
- **Sales**: Purple (#a855f7)
- **Sale Admins**: Blue (#175ead)

### Layout
```
┌─────────────────────────────────────┐
│  KHÁCH HÀNG │ SALE │ SALE ADMIN     │
├─────────────────────────────────────┤
│  Nguyễn Văn A                       │
│  ████████░░ 15 đơn    1,500,000 đ   │
│                                     │
│  Trần Thị B                         │
│  ██████░░░░ 12 đơn    1,200,000 đ   │
│                                     │
│  ...                                │
└─────────────────────────────────────┘
```

## Testing

### Test Cases
1. ✅ Login as Admin → See 3 role tabs
2. ✅ Login as Sale Admin → Don't see role tabs
3. ✅ Login as Sale → Don't see role tabs
4. ✅ Switch between Customer/Sale/Sale Admin tabs
5. ✅ Verify data accuracy
6. ✅ Verify progress bar colors
7. ✅ Verify order count display

### Sample Data
```sql
-- Customers with orders
SELECT 
  c.id,
  p.full_name,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as revenue
FROM orders o
JOIN profiles p ON o.customer_id = p.id
WHERE o.status = 'completed'
GROUP BY c.id, p.full_name
ORDER BY revenue DESC
LIMIT 5;

-- Sales with orders
SELECT 
  p.id,
  p.full_name,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as revenue
FROM orders o
JOIN profiles p ON o.sale_id = p.id
WHERE o.status = 'completed' AND p.role = 'sale'
GROUP BY p.id, p.full_name
ORDER BY revenue DESC
LIMIT 5;

-- Sale Admins with orders
SELECT 
  p.id,
  p.full_name,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as revenue
FROM orders o
JOIN profiles p ON o.sale_id = p.id
WHERE o.status = 'completed' AND p.role = 'sale_admin'
GROUP BY p.id, p.full_name
ORDER BY revenue DESC
LIMIT 5;
```

## Files Modified
- `appejv-expo/app/(sales)/reports.tsx` - Added role-based analytics

## Comparison with appejv-app
✅ Same 3 tabs (Customer, Sale, Sale Admin)
✅ Same color scheme
✅ Same data structure
✅ Same admin-only visibility
✅ Same top 5 display
✅ Same progress bar visualization

## Next Steps
- [ ] Add "Xem thêm" button to show more than 5 items
- [ ] Add navigation to user detail pages
- [ ] Add export functionality
- [ ] Add date range comparison
