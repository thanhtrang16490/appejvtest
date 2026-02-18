# Hoàn thiện bộ lọc danh mục sản phẩm

## Tổng quan
Đã cải thiện bộ lọc danh mục trên trang sản phẩm với các tính năng mới.

## Các cải tiến

### 1. Hiển thị số lượng sản phẩm
**Trước:**
```
Tất cả | Thức ăn cho heo | Thức ăn cho gà
```

**Sau:**
```
🏭 Tất cả (50) | 🐷 Thức ăn cho heo (25) | 🐔 Thức ăn cho gà (15)
```

### 2. Chỉ hiển thị danh mục có sản phẩm
- Filter out các danh mục không có sản phẩm
- Tự động ẩn danh mục trống

### 3. Giữ search query khi chuyển danh mục
- URL: `/san-pham?category=pig&search=thức+ăn`
- Khi chuyển danh mục, giữ nguyên search query

### 4. UI/UX cải thiện
- ✅ Badge hiển thị số lượng sản phẩm
- ✅ Scale effect khi hover (scale-105)
- ✅ Active state với gradient và shadow
- ✅ Sticky header (top-16)
- ✅ Horizontal scroll với scrollbar-hide
- ✅ Backdrop blur effect
- ✅ Icon emoji cho mỗi danh mục

### 5. Responsive design
- Mobile: Horizontal scroll
- Desktop: Tất cả danh mục hiển thị trên một hàng
- Smooth scrolling

## Code Changes

### Tính số lượng sản phẩm
```typescript
const categoriesWithCount = categories.map(cat => {
  const count = cat.id === 'all' 
    ? allProducts.length 
    : allProducts.filter(p => p.category_id === cat.id).length
  return { ...cat, count }
}).filter(cat => cat.count > 0)
```

### Category Filter UI
```html
<a href={`/san-pham?category=${cat.id}${searchQuery ? `&search=${searchQuery}` : ''}`}>
  <span class="text-xl">{cat.icon}</span>
  <span class="font-medium">{cat.name}</span>
  <span class="badge">{cat.count}</span>
</a>
```

## Icon Mapping

### Danh mục được hỗ trợ
- 🐷 Lợn/Heo/Pig
- 🐔 Gà/Gia cầm/Poultry
- 🐟 Cá/Thủy sản/Fish
- 🐄 Bò/Gia súc/Cattle
- ☕ Cà phê/Coffee
- 🍵 Trà/Tea
- 📦 Vật tư/Supplies
- 🍯 Siro/Syrup
- 🏭 Default (cho danh mục khác)

## Features

### 1. Filter by Category
- Click vào danh mục để lọc sản phẩm
- URL update với query parameter
- Active state hiển thị rõ ràng

### 2. Combine with Search
- Có thể search trong một danh mục cụ thể
- URL: `/san-pham?category=pig&search=thức+ăn`

### 3. Count Display
- Hiển thị số lượng sản phẩm trong mỗi danh mục
- Update real-time khi filter

### 4. Empty State
- Tự động ẩn danh mục không có sản phẩm
- Hiển thị message khi không tìm thấy sản phẩm

## CSS Classes

### Scrollbar Hide
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### Active State
```css
bg-gradient-to-r from-[#175ead] to-[#2575be]
text-white
shadow-lg
scale-105
```

### Hover State
```css
hover:bg-gray-200
hover:scale-105
```

## Data Flow

1. Fetch all products from Supabase
2. Fetch all categories from Supabase
3. Count products per category
4. Filter out empty categories
5. Apply category filter if selected
6. Apply search filter if provided
7. Display filtered products with infinite scroll

## Testing

### Test Cases
1. ✅ Click "Tất cả" - Hiển thị tất cả sản phẩm
2. ✅ Click danh mục cụ thể - Chỉ hiển thị sản phẩm của danh mục đó
3. ✅ Search + Category - Kết hợp cả hai filter
4. ✅ Empty category - Không hiển thị danh mục trống
5. ✅ Count accuracy - Số lượng hiển thị đúng
6. ✅ URL persistence - URL update và có thể share

## Performance

- Categories with count được tính một lần khi build
- No client-side filtering (SSG)
- Efficient array operations
- Lazy loading images

## Trạng thái
✅ Hiển thị số lượng sản phẩm cho mỗi danh mục
✅ Chỉ hiển thị danh mục có sản phẩm
✅ Giữ search query khi chuyển danh mục
✅ UI/UX cải thiện với badge và effects
✅ Responsive design
✅ Icon mapping cho nhiều loại danh mục
