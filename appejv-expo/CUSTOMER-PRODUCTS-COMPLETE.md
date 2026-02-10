# Customer Products Page - Hoàn thành

## Tổng quan
Đã sao chép và điều chỉnh trang Inventory (Kho hàng) từ sales sang Products (Sản phẩm) cho customer với các thay đổi phù hợp.

## Thay đổi chính so với Admin Inventory

### 1. Header
```typescript
// Admin: AppHeader + Add button (chỉ admin)
<AppHeader />
{isAdmin && (
  <TouchableOpacity onPress={() => router.push('/(sales)/inventory/add')}>
    <Ionicons name="add" />
  </TouchableOpacity>
)}

// Customer: CustomerHeader + Cart button
<CustomerHeader />
<TouchableOpacity onPress={() => router.push('/(customer)/selling')}>
  <Ionicons name="cart" />
</TouchableOpacity>
```

### 2. Title & Subtitle
```typescript
// Admin
<Text>Kho hàng</Text>
<Text>{filteredProducts.length} sản phẩm • ADMIN</Text>

// Customer
<Text>Sản phẩm</Text>
<Text>{filteredProducts.length} sản phẩm có sẵn</Text>
```

### 3. Fetch Products Query
```typescript
// Admin: Fetch all products (including out of stock)
const { data } = await supabase
  .from('products')
  .select('*, categories(id, name)')
  .is('deleted_at', null)
  .order('name')

// Customer: Only products with stock > 0
const { data } = await supabase
  .from('products')
  .select('*, categories(id, name)')
  .is('deleted_at', null)
  .gt('stock', 0) // Only show available products
  .order('name')
```

### 4. Stock Summary Cards
```typescript
// Admin: Hiển thị summary (Còn hàng, Sắp hết, Hết hàng)
<View style={styles.summaryContainer}>
  <View style={styles.summaryCard}>
    <Text>Còn hàng: {count}</Text>
  </View>
  // ...
</View>

// Customer: Không hiển thị (không cần thiết)
// Removed completely
```

### 5. Product Card
```typescript
// Admin: Stock badge (Còn hàng/Sắp hết/Hết hàng)
<View style={styles.stockBadge}>
  <Text>{stockStatus.label}</Text>
</View>

// Customer: Add to Cart button
<TouchableOpacity style={styles.addToCartButton}>
  <Ionicons name="cart-outline" />
  <Text>Thêm vào giỏ</Text>
</TouchableOpacity>
```

### 6. Product Press Action
```typescript
// Admin: Navigate to product detail for editing
onPress={() => router.push(`/(sales)/inventory/${product.id}`)}

// Customer: Navigate to selling page
onPress={() => router.push('/(customer)/selling')}
```

### 7. Colors
- Admin: `#175ead` (xanh dương)
- Customer: `#10b981` (xanh lá)

### 8. Redirect
- Admin: `router.replace('/(auth)/login')`
- Customer: `router.replace('/(auth)/customer-login')`

### 9. Role Check
```typescript
// Admin: Check role
if (!['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
  router.replace('/(auth)/login')
  return
}

// Customer: No role check (removed)
// Just check authentication
```

## Features giữ nguyên

### ✅ Search & Filter
- Search bar với debounce
- Category filter chips
- Real-time filtering
- Clear filter button

### ✅ Product Display
- Grid layout (2 columns)
- Product image/icon
- Product name, code
- Category name
- Price display
- Stock display

### ✅ Performance
- Bottom nav auto-hide
- Scroll handler với debounce
- useFocusEffect auto refresh
- Pull to refresh
- Efficient filtering

### ✅ Empty States
- No products
- No search results
- Clear filter option

## Removed Features

### ❌ Stock Summary Cards
- Không cần hiển thị tổng quan kho hàng
- Customer chỉ quan tâm sản phẩm có sẵn

### ❌ Stock Status Badge
- Không hiển thị "Còn hàng/Sắp hết/Hết hàng"
- Customer chỉ thấy sản phẩm còn hàng

### ❌ Admin Badge
- Không có role badge
- Không có admin-only features

### ❌ Add Product Button
- Customer không thể thêm sản phẩm
- Chỉ xem và mua

### ❌ Product Detail Page
- Không navigate đến chi tiết sản phẩm
- Navigate trực tiếp đến selling page

### ❌ Edit/Delete Functions
- Customer không thể chỉnh sửa
- Read-only view

## Added Features

### ✅ Add to Cart Button
- Button xanh lá trên mỗi product card
- Icon cart + text "Thêm vào giỏ"
- Navigate đến selling page

### ✅ Cart Button in Header
- Quick access đến giỏ hàng
- Icon cart màu trắng
- Background xanh lá

### ✅ Customer-focused Text
- "Sản phẩm có sẵn" thay vì "sản phẩm"
- "Còn" thay vì "Kho"
- "Thêm vào giỏ" call-to-action

## UI/UX Improvements

### Product Card Layout
```
┌─────────────────────┐
│   Product Icon      │ ← Green background (#d1fae5)
│   (Green cube)      │
├─────────────────────┤
│ Product Name        │
│ CODE123             │
│ Category Name       │
├─────────────────────┤
│ Giá: 100,000 đ     │ ← Green price
│ Còn: 50            │
├─────────────────────┤
│ [🛒 Thêm vào giỏ]  │ ← Green button
└─────────────────────┘
```

### Color Scheme
- Primary: `#10b981` (green)
- Light: `#d1fae5` (light green)
- Background: `#f0f9ff` (light blue)
- Text: `#111827` (dark gray)

## User Flow

### Browse Products
1. Customer mở tab "Sản phẩm"
2. Xem danh sách sản phẩm có sẵn
3. Search hoặc filter theo category
4. Xem thông tin: tên, giá, số lượng còn

### Add to Cart
1. Nhấn "Thêm vào giỏ" trên product card
2. Navigate đến selling page
3. Sản phẩm tự động thêm vào giỏ (future enhancement)

### Quick Cart Access
1. Nhấn icon cart ở header
2. Navigate đến selling page
3. Xem và quản lý giỏ hàng

## Code Structure

### States
```typescript
const [products, setProducts] = useState<any[]>([])
const [categories, setCategories] = useState<any[]>([])
const [filteredProducts, setFilteredProducts] = useState<any[]>([])
const [searchQuery, setSearchQuery] = useState('')
const [loading, setLoading] = useState(true)
const [refreshing, setRefreshing] = useState(false)
const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
```

### Functions
```typescript
fetchData()              // Fetch products & categories
onRefresh()              // Pull to refresh
handleScroll()           // Bottom nav auto-hide
formatCurrency()         // Format VND
handleProductPress()     // Navigate to selling
```

### Effects
```typescript
useEffect(() => fetchData(), [])
useFocusEffect(() => fetchData()) // Auto refresh
useEffect(() => filterProducts(), [searchQuery, selectedCategory, products])
```

## Styling

### Product Card
- Width: 48% (2 columns)
- Border radius: 12px
- Shadow: subtle
- Padding: 12px
- Gap: 12px between cards

### Colors
```typescript
productImageContainer: {
  backgroundColor: '#d1fae5', // Light green
}
priceAmount: {
  color: '#10b981', // Green
}
addToCartButton: {
  backgroundColor: '#10b981', // Green
}
```

## Testing Checklist

### Data Fetching
- [ ] Chỉ fetch products có stock > 0
- [ ] Fetch categories đúng
- [ ] Handle empty products
- [ ] Error handling

### Search & Filter
- [ ] Search by name hoạt động
- [ ] Search by code hoạt động
- [ ] Category filter hoạt động
- [ ] Clear filter hoạt động
- [ ] Real-time filtering

### UI/UX
- [ ] CustomerHeader hiển thị
- [ ] Cart button navigate đúng
- [ ] Product cards hiển thị đúng
- [ ] Add to cart button hoạt động
- [ ] Colors xanh lá đúng
- [ ] Empty state hiển thị

### Navigation
- [ ] Navigate đến selling page
- [ ] Bottom nav auto-hide
- [ ] Pull to refresh
- [ ] Auto refresh khi focus

### Performance
- [ ] Scroll smooth
- [ ] Filter nhanh
- [ ] No lag khi search
- [ ] Efficient re-renders

## Future Enhancements

### 1. Product Detail Modal
- Quick view modal
- Larger image
- Full description
- Add to cart from modal

### 2. Add to Cart with Quantity
- Quantity selector
- Direct add to cart
- Toast notification
- Cart badge count

### 3. Favorites/Wishlist
- Heart icon
- Save favorite products
- Quick access to favorites

### 4. Product Images
- Real product images
- Image gallery
- Zoom functionality

### 5. Sort Options
- Sort by price (low/high)
- Sort by name (A-Z)
- Sort by newest

### 6. Advanced Filters
- Price range filter
- Multi-category select
- Stock availability

### 7. Product Recommendations
- "Sản phẩm tương tự"
- "Mua cùng với"
- "Sản phẩm phổ biến"

## Integration with Selling Page

### Current Flow
```
Products Page
  ↓ Click "Thêm vào giỏ"
Selling Page
  ↓ Manual add product
Cart
```

### Future Enhancement
```
Products Page
  ↓ Click "Thêm vào giỏ" (with product data)
Selling Page (with pre-added product)
  ↓ Product already in cart
Cart
```

### Implementation
```typescript
// Navigate with params
router.push({
  pathname: '/(customer)/selling',
  params: { productId: product.id }
})

// In selling page, check params and auto-add
const { productId } = useLocalSearchParams()
if (productId) {
  // Auto add product to cart
}
```

## Files Summary
- ✅ `app/(customer)/products.tsx` - Main products page
- ✅ Based on `app/(sales)/inventory/index.tsx`

## Comparison Summary

| Feature | Admin Inventory | Customer Products |
|---------|----------------|-------------------|
| Header | AppHeader + Add | CustomerHeader + Cart |
| Title | Kho hàng | Sản phẩm |
| Products | All (including out of stock) | Only in stock |
| Stock Summary | ✅ | ❌ |
| Stock Badge | ✅ | ❌ |
| Add to Cart | ❌ | ✅ |
| Product Detail | ✅ Navigate to detail | ❌ Navigate to selling |
| Edit/Delete | ✅ | ❌ |
| Colors | Blue (#175ead) | Green (#10b981) |
| Role Check | ✅ | ❌ |

## Summary
Customer products page là phiên bản simplified và customer-focused của admin inventory, tập trung vào việc browse và mua sản phẩm thay vì quản lý kho hàng.
