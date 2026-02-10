# Cải tiến cho phần Khách hàng (Customer)

## Tổng quan
Áp dụng các cải tiến đã làm cho phần Admin/Sales sang phần Khách hàng để đảm bảo consistency và UX tốt hơn.

## Các cải tiến đã áp dụng

### 1. CustomerHeader Component ✅
Tạo header component chung cho tất cả trang customer.

**File**: `src/components/CustomerHeader.tsx`

**Features**:
- Logo APPE JV
- Tên ứng dụng
- Notification button
- Account button (thay vì menu)
- Props: `showNotification`, `showAccount`

**Khác biệt với AppHeader**:
- Account button thay vì Menu button
- Icon: `person-circle-outline` thay vì `menu`
- Navigate đến `/(customer)/account`

### 2. Bottom Nav Auto-hide ✅
Customer layout đã có sẵn auto-hide bottom navigation.

**File**: `app/(customer)/_layout.tsx`

**Features**:
- Scroll down → hide
- Scroll up → show
- Auto show sau 2 giây
- Smooth spring animation
- Hide hoàn toàn trên trang selling

### 3. Scroll Handler cho Dashboard ✅
Thêm scroll handler để trigger bottom nav auto-hide.

**File**: `app/(customer)/dashboard.tsx`

**Changes**:
- Import `emitScrollVisibility`, `useTabBarHeight`
- Thêm `useRef` cho scroll tracking
- Thêm `handleScroll` callback
- Thêm `onScroll` và `scrollEventThrottle` vào ScrollView
- Thêm `paddingBottom` cho content

### 4. Simplified Header Layout ✅
Đơn giản hóa header layout trong dashboard.

**Before**:
```typescript
<View style={styles.header}>
  <Image source={...} />
  <View style={styles.headerTextContainer}>
    <Text>Welcome</Text>
  </View>
  <TouchableOpacity>
    <Ionicons name="notifications" />
  </TouchableOpacity>
</View>
```

**After**:
```typescript
<CustomerHeader />
<View style={styles.welcomeSection}>
  <Text>Welcome</Text>
</View>
```

## Files Created/Modified

### Created
- ✅ `src/components/CustomerHeader.tsx`
- ✅ `CUSTOMER-IMPROVEMENTS.md`

### Modified
- ✅ `app/(customer)/dashboard.tsx`

### Pending (cần áp dụng)
- ⬜ `app/(customer)/products.tsx`
- ⬜ `app/(customer)/orders.tsx`
- ⬜ `app/(customer)/account.tsx`
- ⬜ `app/(customer)/selling.tsx` (đã có auto-hide)

## Usage Guide

### Áp dụng CustomerHeader cho trang mới

#### 1. Import
```typescript
import CustomerHeader from '../../src/components/CustomerHeader'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
```

#### 2. Setup refs và hooks
```typescript
const { contentPaddingBottom } = useTabBarHeight()
const lastScrollY = useRef(0)
const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
```

#### 3. Thêm scroll handler
```typescript
const handleScroll = useCallback((event: any) => {
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
}, [])
```

#### 4. Update JSX
```typescript
<SafeAreaView style={styles.container} edges={['top']}>
  <CustomerHeader />
  
  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={{ paddingBottom: contentPaddingBottom + 16 }}
    onScroll={handleScroll}
    scrollEventThrottle={16}
  >
    {/* Content */}
  </ScrollView>
</SafeAreaView>
```

#### 5. Xóa header cũ
Xóa các styles không cần:
- `header`
- `logo`
- `headerTextContainer`
- `notificationButton`
- `headerTitle`
- `headerSubtitle`

## Comparison: Admin vs Customer

### AppHeader (Admin/Sales)
```typescript
<AppHeader showNotification={true} />
```
- Menu button → Navigate to menu
- Icon: `menu`
- Color scheme: Blue (#175ead)

### CustomerHeader (Customer)
```typescript
<CustomerHeader showNotification={true} showAccount={true} />
```
- Account button → Navigate to account
- Icon: `person-circle-outline`
- Color scheme: Green (#10b981)

## Benefits

### 1. Consistency
- Header giống nhau trên mọi trang customer
- UX nhất quán với phần admin
- Dễ navigate và sử dụng

### 2. Code Reduction
- Giảm ~50 dòng code/trang
- Không duplicate header code
- Dễ maintain

### 3. Better UX
- Bottom nav auto-hide → More screen space
- Smooth animations
- Notification accessible từ mọi trang
- Quick access to account

### 4. Performance
- Optimized scroll handling
- Debounced visibility changes
- Efficient re-renders

## Next Steps

### Áp dụng cho các trang còn lại

#### Products Page
- [ ] Thêm CustomerHeader
- [ ] Thêm scroll handler
- [ ] Test auto-hide

#### Orders Page
- [ ] Thêm CustomerHeader
- [ ] Thêm scroll handler
- [ ] Test với FlatList

#### Account Page
- [ ] Thêm CustomerHeader (showAccount=false)
- [ ] Thêm scroll handler
- [ ] Update layout

### Tối ưu thêm

#### Performance
- [ ] Memoize components
- [ ] useCallback cho handlers
- [ ] useMemo cho computed values
- [ ] FlatList cho danh sách dài

#### Features
- [ ] Pull-to-refresh cho tất cả trang
- [ ] Loading states
- [ ] Empty states
- [ ] Error handling

#### UI/UX
- [ ] Skeleton loaders
- [ ] Smooth transitions
- [ ] Toast notifications
- [ ] Confirmation modals

## Testing Checklist

### CustomerHeader
- [ ] Logo hiển thị đúng
- [ ] Notification button hoạt động
- [ ] Account button navigate đúng
- [ ] Badge hiển thị số notifications
- [ ] Responsive layout

### Bottom Nav Auto-hide
- [ ] Hide khi scroll down
- [ ] Show khi scroll up
- [ ] Auto show sau 2s
- [ ] Smooth animation
- [ ] Không flicker

### Dashboard
- [ ] Header hiển thị đúng
- [ ] Stats cards load đúng
- [ ] Recent orders hiển thị
- [ ] Pull-to-refresh hoạt động
- [ ] Navigate đến order detail

## Code Statistics

### Dashboard
- **Before**: ~350 lines
- **After**: ~320 lines
- **Saved**: 30 lines

### Header Code
- **Before**: ~50 lines per page
- **After**: 1 line per page
- **Saved**: ~49 lines per page

### Total Potential Savings
- 5 customer pages × 49 lines = **245 lines**
- Plus shared component benefits
- Plus easier maintenance

## Conclusion

Việc áp dụng các cải tiến từ phần Admin sang Customer giúp:
- **Consistency**: UX nhất quán toàn app
- **Maintainability**: Dễ maintain và update
- **Performance**: Tối ưu scroll và render
- **Developer Experience**: Faster development
- **User Experience**: Better navigation và interactions

Nên tiếp tục áp dụng pattern này cho các trang còn lại và các features mới.
