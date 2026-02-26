# APPEJV EXPO - TODO & IMPROVEMENTS

## ✅ Phase 1: Critical Fixes (COMPLETED)

### Bug Fixes
- [x] **Fix crash sau đăng nhập** - `app/(sales)/dashboard.tsx`
  - Thêm `Modal`, `TouchableOpacity` vào imports
  - Định nghĩa `filterTabs` array
- [x] **Fix Alert.prompt Android crash** - `app/(sales)/customers/[id].tsx`
  - Thay `Alert.prompt` bằng custom Modal với TextInput
- [x] **Xóa console.log** - `app/(sales)/selling.tsx` (17 statements removed)
- [x] **Xóa file duplicate** - `src/components/OptimizedImage.tsx`
- [x] **Xóa tab thừa** - `app/(sales)/dashboard-refactored.tsx`

---

## ✅ Phase 2: UI/UX Improvements (COMPLETED)

### Components
- [x] **ErrorBoundary** - Thêm nút "Về trang chủ", hiển thị stack trace trong DEV
- [x] **OfflineBanner** - Banner thông báo mất/có kết nối mạng (NetInfo)
- [x] **AppHeader** - Thêm user avatar với initials + màu theo role + greeting
- [x] **SkeletonLoader** - Thêm `DashboardSkeleton` và `OrdersListSkeleton`

### Screens
- [x] **Sales Dashboard** - Dùng `DashboardSkeleton` thay `ActivityIndicator`
- [x] **Orders List** - Dùng `OrdersListSkeleton` thay `ActivityIndicator`

### Root Layout
- [x] **_layout.tsx** - Tích hợp `OfflineBanner` toàn app

---

## ✅ Phase 3: Future Improvements (COMPLETED)

### Features
- [x] **Search bar** trong orders list - tìm theo mã đơn, tên, SĐT + badge count trên tabs
- [x] **Notes field** trong selling screen - ghi chú đơn hàng, lưu vào DB
- [x] **Push notifications** - hook `usePushNotifications`, lưu token vào Supabase, local notification khi tạo đơn
- [ ] **Barcode scanner** cho sản phẩm (cần `expo-barcode-scanner` - future)
- [x] **PDF invoice** export - `expo-print` + `expo-sharing`, nút share trên order detail
- [x] **Revenue chart** trong dashboard - pure RN bar chart, không cần thư viện

### Performance
- [x] **React Query** cho data fetching - `useOrdersList` hook, migrate orders/index.tsx
- [x] **Optimistic updates** cho order status changes - `useUpdateOrderStatus` với rollback
- [x] **Image caching** - `CachedImage` component dùng expo-file-system

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `app/(sales)/dashboard.tsx` | Fix imports + filterTabs + DashboardSkeleton |
| `app/(sales)/customers/[id].tsx` | Fix Alert.prompt → custom Modal |
| `app/(sales)/selling.tsx` | Remove 17 console.log statements |
| `app/(sales)/orders/index.tsx` | OrdersListSkeleton + Search bar + tab count badges + React Query |
| `app/(sales)/orders/[id].tsx` | PDF export button (share icon) |
| `app/(sales)/selling.tsx` | Notes field + local notification khi tạo đơn |
| `app/(sales)/dashboard.tsx` | Revenue chart tích hợp |
| `src/hooks/usePushNotifications.ts` | NEW - Push notifications hook |
| `src/hooks/useOrdersQuery.ts` | NEW - React Query + Optimistic Updates cho orders |
| `src/hooks/useDashboardData.ts` | Thêm revenue chart data query |
| `src/components/dashboard/RevenueChart.tsx` | NEW - Pure RN bar chart |
| `src/components/CachedImage.tsx` | NEW - Image caching với expo-file-system |
| `src/lib/pdf-invoice.ts` | NEW - PDF invoice generator (HTML → PDF) |
| `app/_layout.tsx` | Add OfflineBanner |
| `src/components/ErrorBoundary.tsx` | Add "Go Home" button + DEV stack trace |
| `src/components/OfflineBanner.tsx` | NEW - Offline/online status banner |
| `src/components/AppHeader.tsx` | User avatar with initials + greeting |
| `src/components/SkeletonLoader.tsx` | Add DashboardSkeleton + OrdersListSkeleton |
| `src/components/OptimizedImage.tsx` | DELETED (duplicate) |
| `app/(sales)/dashboard-refactored.tsx` | DELETED (unused tab) |
