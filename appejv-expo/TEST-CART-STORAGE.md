# Test Cart Storage - Troubleshooting Guide

## Vấn đề
Sản phẩm được thêm từ trang Products nhưng không hiển thị trong trang Selling.

## Nguyên nhân có thể
1. AsyncStorage key không khớp
2. Cart không được load khi focus vào Selling page
3. Data structure không đúng
4. AsyncStorage bị clear

## Giải pháp đã áp dụng

### 1. Thêm useFocusEffect vào Selling page
```typescript
// Auto load cart when screen is focused
useFocusEffect(
  useCallback(() => {
    loadCartFromStorage()
  }, [])
)
```

### 2. Thêm console.log để debug
```typescript
// In products.tsx
console.log('Adding to cart:', product.name)
console.log('Current cart before add:', cart)
console.log('Saving cart to storage:', cart)

// In selling.tsx
console.log('Loading cart from storage:', cartJson)
console.log('Parsed cart:', savedCart)
```

### 3. Đảm bảo AsyncStorage key giống nhau
```typescript
// Both files use same key
const CART_STORAGE_KEY = '@customer_cart'
```

## Cách test

### Test 1: Kiểm tra AsyncStorage
1. Mở trang Products
2. Thêm 1 sản phẩm vào giỏ
3. Kiểm tra console log:
   ```
   Adding to cart: [Product Name]
   Current cart before add: []
   Saving cart to storage: [{...}]
   ```

### Test 2: Kiểm tra Load Cart
1. Navigate đến trang Selling
2. Kiểm tra console log:
   ```
   Loading cart from storage: [{"id":1,"name":"...","quantity":1}]
   Parsed cart: [{...}]
   ```

### Test 3: Kiểm tra Cart Display
1. Sau khi load, cart items phải hiển thị
2. Nếu không hiển thị, kiểm tra:
   - State `cart` có data không?
   - Component render đúng không?
   - Có error trong console không?

## Debug Commands

### Clear AsyncStorage (nếu cần reset)
```typescript
// Add this temporarily to clear storage
useEffect(() => {
  AsyncStorage.removeItem('@customer_cart')
}, [])
```

### Check AsyncStorage manually
```typescript
// Add this to see all keys
AsyncStorage.getAllKeys().then(keys => {
  console.log('All AsyncStorage keys:', keys)
})

// Check specific key
AsyncStorage.getItem('@customer_cart').then(value => {
  console.log('Cart value:', value)
})
```

## Expected Flow

### Add to Cart (Products page)
```
1. User taps "Thêm vào giỏ"
   ↓
2. addToCart() function called
   ↓
3. Load existing cart from AsyncStorage
   ↓
4. Add/Update product in cart array
   ↓
5. Save cart to AsyncStorage
   ↓
6. Update cart badge count
   ↓
7. Show toast notification
```

### View Cart (Selling page)
```
1. User navigates to Selling page
   ↓
2. useFocusEffect triggers
   ↓
3. loadCartFromStorage() called
   ↓
4. Load cart from AsyncStorage
   ↓
5. Parse JSON to array
   ↓
6. setCart(savedCart)
   ↓
7. Cart items render in UI
```

## Common Issues

### Issue 1: Cart is empty in Selling page
**Cause**: useFocusEffect not triggering
**Solution**: Added useFocusEffect to load cart on focus

### Issue 2: AsyncStorage returns null
**Cause**: Key mismatch or data not saved
**Solution**: Ensure both files use same CART_STORAGE_KEY

### Issue 3: Cart data structure wrong
**Cause**: Missing fields in product object
**Solution**: Ensure all required fields are saved:
```typescript
{
  id: number
  name: string
  price: number
  stock: number
  quantity: number
  // ... other fields
}
```

### Issue 4: State not updating
**Cause**: setCart not called or async issue
**Solution**: Ensure setCart is called after parsing JSON

## Verification Checklist

- [ ] Console shows "Adding to cart" message
- [ ] Console shows cart array before save
- [ ] Console shows "Saving cart to storage" message
- [ ] Navigate to Selling page
- [ ] Console shows "Loading cart from storage" message
- [ ] Console shows parsed cart array
- [ ] Cart items display in UI
- [ ] Can adjust quantities
- [ ] Can create order

## If Still Not Working

### Step 1: Clear app data
```bash
# For iOS Simulator
xcrun simctl uninstall booted [bundle-id]
xcrun simctl install booted [app-path]

# For Android
adb shell pm clear [package-name]
```

### Step 2: Restart Metro bundler
```bash
# Stop current process
Ctrl+C

# Clear cache and restart
npm start -- --reset-cache
```

### Step 3: Check React Native Debugger
1. Open React Native Debugger
2. Go to AsyncStorage tab
3. Check if '@customer_cart' key exists
4. Verify data structure

### Step 4: Add error boundaries
```typescript
try {
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  console.log('✅ Cart saved successfully')
} catch (error) {
  console.error('❌ Error saving cart:', error)
  Alert.alert('Lỗi', 'Không thể lưu giỏ hàng')
}
```

## Success Indicators

When working correctly, you should see:
1. ✅ Toast notification when adding to cart
2. ✅ Cart badge updates with count
3. ✅ Console logs show data flow
4. ✅ Selling page shows cart items
5. ✅ Can adjust quantities
6. ✅ Cart persists between navigations

## Files to Check
1. `app/(customer)/products.tsx` - Add to cart logic
2. `app/(customer)/selling.tsx` - Load cart logic
3. Both files must import AsyncStorage
4. Both files must use same CART_STORAGE_KEY

## Next Steps if Issue Persists
1. Check React Native version compatibility
2. Check AsyncStorage package version
3. Try alternative storage (SecureStore, MMKV)
4. Use React Context for cart state
5. Add cart persistence middleware
