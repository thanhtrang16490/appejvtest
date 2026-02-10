# Customer Products - Add to Cart Feature Complete

## Tổng quan
Đã hoàn thành chức năng "Thêm vào giỏ hàng" cho trang sản phẩm khách hàng với AsyncStorage để lưu trữ giỏ hàng giữa các màn hình.

## Các thay đổi

### 1. Products Page (`app/(customer)/products.tsx`)

#### Features mới:
- **Add to Cart**: Thêm sản phẩm vào giỏ hàng với AsyncStorage
- **Cart Badge**: Hiển thị số lượng sản phẩm trong giỏ trên icon cart
- **Toast Notifications**: Thông báo khi thêm/tăng số lượng sản phẩm
- **Auto Refresh**: Load lại cart count khi focus vào màn hình

#### Implementation:
```typescript
const CART_STORAGE_KEY = '@customer_cart'

// State management
const [cartItemCount, setCartItemCount] = useState(0)
const [toasts, setToasts] = useState<Array<...>>([])

// Load cart count from AsyncStorage
const loadCartCount = async () => {
  const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY)
  if (cartJson) {
    const cart = JSON.parse(cartJson)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartItemCount(totalItems)
  }
}

// Add product to cart
const addToCart = async (product: any) => {
  const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY)
  let cart = cartJson ? JSON.parse(cartJson) : []
  
  const existingItemIndex = cart.findIndex(item => item.id === product.id)
  
  if (existingItemIndex >= 0) {
    // Increase quantity
    if (cart[existingItemIndex].quantity < product.stock) {
      cart[existingItemIndex].quantity += 1
      addToastNotification(`Đã tăng số lượng "${product.name}"`)
    } else {
      addToastNotification(`Đã đạt tối đa tồn kho`)
      return
    }
  } else {
    // Add new item
    cart.push({ ...product, quantity: 1 })
    addToastNotification(`Đã thêm "${product.name}" vào giỏ`)
  }
  
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  await loadCartCount()
}
```

#### UI Components:
- **Cart Button with Badge**: Hiển thị số lượng items
- **Toast Notifications**: Slide animation từ trên xuống
- **Product Cards**: Nút "Thêm vào giỏ" trên mỗi card

### 2. Selling Page (`app/(customer)/selling.tsx`)

#### Features mới:
- **Load Cart from Storage**: Tự động load giỏ hàng khi mount
- **Save Cart to Storage**: Lưu mọi thay đổi vào AsyncStorage
- **Sync Cart**: Đồng bộ giữa products và selling pages

#### Implementation:
```typescript
const CART_STORAGE_KEY = '@customer_cart'

// Load cart from AsyncStorage on mount
const loadCartFromStorage = async () => {
  const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY)
  if (cartJson) {
    const savedCart = JSON.parse(cartJson)
    setCart(savedCart)
  }
}

// Save cart to AsyncStorage
const saveCartToStorage = async (cartData: any[]) => {
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
}

// Update all cart operations to save to storage
const addToCart = useCallback((product: any) => {
  setCart(prevCart => {
    // ... cart logic
    saveCartToStorage(newCart)
    return newCart
  })
}, [])

const updateQuantity = useCallback((productId: number, delta: number) => {
  setCart(prevCart => {
    // ... update logic
    saveCartToStorage(newCart)
    return newCart
  })
}, [])
```

#### Clear Cart:
- Xóa cart khỏi AsyncStorage khi:
  - Xem đơn hàng (handleViewOrder)
  - Tạo đơn mới (handleCreateAnother)
  - Đóng success modal (handleCloseSuccessModal)

## User Flow

### 1. Browse Products
```
Customer Dashboard → Products Tab
↓
View products with stock > 0
↓
Search/Filter by category
```

### 2. Add to Cart
```
Tap "Thêm vào giỏ" button
↓
Product added to AsyncStorage
↓
Toast notification appears
↓
Cart badge updates with count
```

### 3. View Cart
```
Tap cart button in header
↓
Navigate to Selling page
↓
Cart loaded from AsyncStorage
↓
Review items, adjust quantities
```

### 4. Complete Order
```
Tap "Xong" button
↓
Create draft order
↓
Success modal appears
↓
Cart cleared from AsyncStorage
```

## Technical Details

### AsyncStorage Key
```typescript
const CART_STORAGE_KEY = '@customer_cart'
```

### Cart Data Structure
```typescript
interface CartItem {
  id: number
  name: string
  code?: string
  price: number
  stock: number
  quantity: number
  category_id?: number
  categories?: {
    id: number
    name: string
  }
}

type Cart = CartItem[]
```

### Toast Notification
- **Animation**: Slide from top with spring effect
- **Duration**: 2 seconds auto-dismiss
- **Stacking**: Multiple toasts stack vertically
- **Color**: Green (#10b981) for success

### Cart Badge
- **Position**: Top-right of cart button
- **Color**: Red (#ef4444) background
- **Max Display**: "99+" for counts > 99
- **Border**: White border to stand out

## Security
- Customer chỉ thấy products có `stock > 0`
- Customer không thấy số tồn kho chính xác
- Cart data chỉ lưu local (AsyncStorage)
- Validation số lượng khi thêm vào cart

## Performance
- **useFocusEffect**: Auto refresh cart count khi focus
- **useCallback**: Memoize cart operations
- **Debounce**: Search query 300ms
- **FlatList**: Optimized rendering cho product grid

## UI/UX
- **Màu chính**: Xanh lá #10b981 (customer theme)
- **Toast**: Slide animation mượt mà
- **Badge**: Nổi bật với màu đỏ
- **Responsive**: Tự động điều chỉnh layout

## Testing Checklist
- [x] Add product to empty cart
- [x] Add same product multiple times
- [x] Cart badge updates correctly
- [x] Toast notifications appear
- [x] Navigate to selling page
- [x] Cart persists between screens
- [x] Cart clears after order creation
- [x] Stock validation works
- [x] Search and filter work
- [x] Auto refresh on focus

## Files Modified
1. `appejv-expo/app/(customer)/products.tsx`
   - Added AsyncStorage integration
   - Added cart badge
   - Added toast notifications
   - Added addToCart function

2. `appejv-expo/app/(customer)/selling.tsx`
   - Added loadCartFromStorage
   - Added saveCartToStorage
   - Updated all cart operations
   - Clear cart after order completion

## Next Steps (Optional)
- [ ] Add cart context/provider for better state management
- [ ] Add "Remove from cart" button on product cards
- [ ] Add cart preview modal
- [ ] Add cart item count animation
- [ ] Add haptic feedback on add to cart
- [ ] Add undo functionality for cart operations

## Notes
- AsyncStorage key: `@customer_cart`
- Cart syncs automatically between products and selling pages
- Toast notifications use same style as selling page
- Cart badge matches design system
- All cart operations are async-safe
