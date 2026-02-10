# Bottom Navigation Auto-Hide Feature

## Tổng quan
Đã thêm tính năng tự động ẩn/hiện bottom navigation khi người dùng vuốt lên/xuống màn hình. Bottom nav được thiết kế dạng floating (position: absolute) để khi ẩn đi, nội dung bên dưới sẽ hiện ra đầy đủ, tăng không gian hiển thị.

## Cách hoạt động

### 1. Floating Bottom Nav
- Bottom nav có `position: absolute` để float trên nội dung
- Khi ẩn đi, nội dung scroll được hiện đầy đủ
- Tăng không gian hiển thị khi đang xem nội dung

### 2. Animation System
- Sử dụng React Native Animated API với spring animation
- Bottom nav sẽ trượt xuống (ẩn) khi vuốt lên
- Bottom nav sẽ trượt lên (hiện) khi vuốt xuống
- Tự động hiện lại sau 2 giây không scroll

### 3. Event System
- Tạo global event emitter trong `_layout.tsx`
- Các trang có thể emit scroll visibility events
- Layout lắng nghe và animate bottom nav

### 4. Scroll Detection
- Theo dõi scroll direction (lên/xuống)
- Threshold: 5px để tránh trigger quá nhạy
- Chỉ ẩn khi scroll xuống > 50px từ đầu trang
- Timeout 2s để tự động hiện lại

## Files đã thay đổi

### 1. Layout (`app/(sales)/_layout.tsx` và `app/(customer)/_layout.tsx`)
```typescript
// Thêm event system
export const emitScrollVisibility = (visible: boolean) => {...}
export const subscribeToScroll = (listener) => {...}

// Thêm Animated.Value cho transform
const translateY = useRef(new Animated.Value(0)).current

// Subscribe to scroll events
useEffect(() => {
  const unsubscribe = subscribeToScroll((visible) => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
    }).start()
  })
  return unsubscribe
}, [])

// Thêm transform vào tabBarStyle
tabBarStyle: {
  position: 'absolute',  // QUAN TRỌNG: Floating bottom nav
  bottom: 0,
  left: 0,
  right: 0,
  height: Platform.OS === 'ios' ? 88 : 68,
  ...
  transform: [{ translateY }],
}
```

### 2. Dashboard (`app/(sales)/dashboard.tsx`)
```typescript
// Import Platform và event emitter
import { Platform } from 'react-native'
import { emitScrollVisibility } from './_layout'

// Thêm scroll handler
const lastScrollY = useRef(0)
const scrollTimeout = useRef<NodeJS.Timeout>()

const handleScroll = (event: any) => {
  const currentScrollY = event.nativeEvent.contentOffset.y
  const scrollDiff = currentScrollY - lastScrollY.current

  if (scrollTimeout.current) {
    clearTimeout(scrollTimeout.current)
  }

  if (Math.abs(scrollDiff) > 5) {
    if (scrollDiff > 0 && currentScrollY > 50) {
      emitScrollVisibility(false) // Hide
    } else if (scrollDiff < 0) {
      emitScrollVisibility(true) // Show
    }
    lastScrollY.current = currentScrollY
  }

  scrollTimeout.current = setTimeout(() => {
    emitScrollVisibility(true)
  }, 2000)
}

// Thêm vào ScrollView
<ScrollView
  onScroll={handleScroll}
  scrollEventThrottle={16}
  ...
/>

// QUAN TRỌNG: Thêm paddingBottom cho container cuối
const styles = StyleSheet.create({
  recentContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 112 : 92, // Padding cho floating bottom nav
  },
})
```

### 3. Orders (`app/(sales)/orders/index.tsx`)
```typescript
// Tương tự Dashboard
import { Platform } from 'react-native'
import { emitScrollVisibility } from '../_layout'

// Thêm paddingBottom cho scrollContent
const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 112 : 92, // Padding cho floating bottom nav
  },
})
```

## Các trang đã áp dụng
- ✅ Sales Layout (`app/(sales)/_layout.tsx`)
- ✅ Customer Layout (`app/(customer)/_layout.tsx`)
- ✅ Dashboard (`app/(sales)/dashboard.tsx`)
- ✅ Orders (`app/(sales)/orders/index.tsx`)

## Các trang cần áp dụng (tùy chọn)
- `app/(sales)/selling.tsx`
- `app/(sales)/customers/index.tsx`
- `app/(sales)/reports.tsx`
- `app/(sales)/inventory/index.tsx`
- `app/(customer)/dashboard.tsx`
- `app/(customer)/products.tsx`
- `app/(customer)/orders.tsx`

## Cách áp dụng cho trang mới

1. Import Platform và event emitter:
```typescript
import { Platform } from 'react-native'
import { emitScrollVisibility } from '../_layout' // hoặc './_layout' tùy vị trí
```

2. Thêm refs và handler:
```typescript
const lastScrollY = useRef(0)
const scrollTimeout = useRef<NodeJS.Timeout>()

const handleScroll = (event: any) => {
  const currentScrollY = event.nativeEvent.contentOffset.y
  const scrollDiff = currentScrollY - lastScrollY.current

  if (scrollTimeout.current) {
    clearTimeout(scrollTimeout.current)
  }

  if (Math.abs(scrollDiff) > 5) {
    if (scrollDiff > 0 && currentScrollY > 50) {
      emitScrollVisibility(false)
    } else if (scrollDiff < 0) {
      emitScrollVisibility(true)
    }
    lastScrollY.current = currentScrollY
  }

  scrollTimeout.current = setTimeout(() => {
    emitScrollVisibility(true)
  }, 2000)
}
```

3. Thêm vào ScrollView:
```typescript
<ScrollView
  onScroll={handleScroll}
  scrollEventThrottle={16}
  ...
/>
```

4. **QUAN TRỌNG**: Thêm paddingBottom cho container cuối:
```typescript
const styles = StyleSheet.create({
  lastContainer: {
    paddingBottom: Platform.OS === 'ios' ? 112 : 92,
  },
})
```

## Padding Bottom Values
- **iOS**: 112px (88px bottom nav height + 24px extra space)
- **Android**: 92px (68px bottom nav height + 24px extra space)

## Tùy chỉnh

### Thay đổi threshold
```typescript
if (Math.abs(scrollDiff) > 10) { // Thay 5 thành 10
```

### Thay đổi timeout
```typescript
scrollTimeout.current = setTimeout(() => {
  emitScrollVisibility(true)
}, 3000) // Thay 2000 thành 3000 (3 giây)
```

### Thay đổi animation
```typescript
Animated.spring(translateY, {
  toValue: visible ? 0 : 100,
  useNativeDriver: true,
  tension: 100, // Tăng để nhanh hơn
  friction: 8,  // Giảm để bounce nhiều hơn
}).start()
```

### Thay đổi padding bottom
```typescript
paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Tăng thêm space
```

## Lưu ý
- `scrollEventThrottle={16}` giúp scroll mượt mà (60fps)
- `useNativeDriver: true` để animation chạy trên native thread
- Reset visibility khi chuyển route để tránh bottom nav bị ẩn
- Cleanup timeout trong useEffect để tránh memory leak
- **Phải thêm paddingBottom** cho container cuối để nội dung không bị che bởi floating bottom nav
- Bottom nav có `position: absolute` nên không chiếm space trong layout flow
