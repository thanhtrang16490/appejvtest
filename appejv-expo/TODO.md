# appejv-expo - Kế hoạch cải thiện toàn diện

## 🔴 Phase 1: Critical Fixes (Bugs nghiêm trọng)

- [x] 1.1 Fix `src/types/index.ts` - Thêm `warehouse` role, cải thiện Order/Product types, thêm DashboardStats/TeamStats/Notification/ApiResponse
- [x] 1.2 Fix `src/lib/supabase.ts` - Fix SecureStore adapter (thiếu return → session không lưu), bỏ console.log nhạy cảm
- [x] 1.3 Fix `src/lib/error-tracking.ts` - Refactor class, thêm `error()` alias, implement AsyncStorage persistence, thêm `ErrorTracker` named export
- [x] 1.4 Fix `App.tsx` - Xóa boilerplate mặc định (Expo Router handles entry)
- [x] 1.5 Fix `src/lib/offline-manager.ts` - Implement executeAction với Supabase thực sự (create/update/delete)

## 🏗️ Phase 2: Architecture Improvements

- [x] 2.1 Tạo `src/constants/config.ts` - App configuration tập trung (hotline, API, auth, cache, pagination, UI)
- [x] 2.2 Tạo `src/components/shared/StatusBadge.tsx` - Shared status badge, xóa duplicate statusMap
- [x] 2.3 Cải thiện `src/lib/analytics.ts` - Thêm React import, clearUserProperties, Firebase setup guide
- [x] 2.4 Cải thiện `src/contexts/AuthContext.tsx` - Fix timeout (2s→5s configurable), useRef mounted guard, UserRole typing, clearUserProperties on logout
- [x] 2.5 Fix `src/hooks/useDashboardData.ts` - Fix `ErrorTracker.error()` → `errorTracker.logError()`, import types từ types/index.ts
- [x] 2.6 Tạo `app/(sales)/dashboard-refactored.tsx` - Dùng useDashboardData hook + dashboard sub-components, xóa duplicate logic
- [x] 2.7 Tách `app/(sales)/selling.tsx` - Tách thành sub-components (CartItem, ProductGrid, CustomerSelector, QuantityModal)
- [x] 2.8 Migrate `src/hooks/useDashboardData.ts` to React Query (useQuery/useMutation) - staleTime, deduplication, background refetch

## ✨ Phase 3: UX/UI Improvements

- [x] 3.1 Fix `app/(auth)/login.tsx` - Thêm password toggle (eye/eye-off), ActivityIndicator loading, dùng AUTH_CONFIG/APP_CONFIG
- [x] 3.2 Fix `app/(customer)/dashboard.tsx` - Hiển thị tên user thực, optimize queries (2→1 query), dùng StatusBadge, fix Timeout type
- [x] 3.3 Fix `src/components/AppHeader.tsx` - Dùng APP_CONFIG.hotline/name, Linking.canOpenURL fallback, hitSlop, accessibility
- [x] 3.4 Cải thiện `app/_layout.tsx` - QueryClient config (staleTime, retry), StatusBar, warehouse route, non-blocking offline init
- [x] 3.5 Fix `src/hooks/useDashboardData.ts` - Đã fix trong 2.5

## ⚡ Phase 4: Performance & Optimization

- [x] 4.1 Tạo `src/lib/performance.ts` - PerformanceMonitor class, `measure()` async wrapper, `withPerformanceTracking` HOC
- [x] 4.2 Tạo `src/lib/optimistic-updates.ts` - Optimistic update manager cho mutations
- [x] 4.3 Tạo `src/lib/api-helpers.ts` - API helper utilities (retry, timeout, error handling)
- [x] 4.4 Tạo `src/lib/animations.ts` - Animation utilities (fadeIn/Out, slideIn/Out, scale, spring, pulse, shake, rotate, stagger)
- [x] 4.5 Tạo `src/lib/validation.ts` - Validation utilities cho forms
- [x] 4.6 Tạo `src/lib/export.ts` - Export CSV/Excel functionality
- [x] 4.7 Tạo `src/lib/theme.ts` - Design tokens (spacing, colors, typography, borderRadius, shadows)
- [x] 4.8 Tạo `src/components/SkeletonLoader.tsx` - Skeleton loading component
- [x] 4.9 Tạo `src/components/optimized/LazyComponent.tsx` - Lazy loading wrapper
- [x] 4.10 Tạo `src/components/optimized/OptimizedImage.tsx` - Optimized image với caching
- [x] 4.11 Tạo `src/components/optimized/VirtualList.tsx` - Virtual list cho large datasets
- [x] 4.12 Tạo `src/components/optimized/MemoizedComponent.tsx` - Memoized component wrapper
- [x] 4.13 Tạo `src/components/OptimizedImage.tsx` - Root-level optimized image component
- [x] 4.14 Tạo `src/components/OptimizedList.tsx` - Root-level optimized list component

## 🧩 Phase 5: Dashboard Components

- [x] 5.1 Tạo `src/components/dashboard/DashboardStats.tsx` - Stats cards (orderedCount, lowStock, customers, revenue)
- [x] 5.2 Tạo `src/components/dashboard/QuickActions.tsx` - Quick action buttons grid
- [x] 5.3 Tạo `src/components/dashboard/RecentOrders.tsx` - Recent orders list với StatusBadge
- [x] 5.4 Tạo `src/components/dashboard/TimeRangeFilter.tsx` - Horizontal scrollable time range filter
- [x] 5.5 Tạo `src/components/dashboard/MetricCard.tsx` - Reusable metric card component
- [x] 5.6 Tạo `src/components/dashboard/QuickActionButton.tsx` - Reusable quick action button
- [x] 5.7 Tạo `src/components/dashboard/index.ts` - Barrel export cho dashboard components

## 🪝 Phase 6: New Hooks

- [x] 6.1 Tạo `src/hooks/useDebounce.ts` - Debounce hook cho search inputs
- [x] 6.2 Tạo `src/hooks/useScrollVisibility.ts` - Scroll visibility hook cho tab bar hide/show
- [x] 6.3 Tạo `src/hooks/useAnimation.ts` - Animation hook (fadeIn, slideIn, scale)
- [x] 6.4 Tạo `src/hooks/useOrders.ts` - Orders data hook với React Query
- [x] 6.5 Tạo `src/hooks/usePagination.ts` - Pagination hook
- [x] 6.6 Tạo `src/hooks/useProducts.ts` - Products data hook với React Query
- [x] 6.7 Tạo `src/hooks/useResponsive.ts` - Responsive breakpoints hook
- [x] 6.8 Tạo `src/hooks/useSupabaseQuery.ts` - Generic Supabase query hook
- [x] 6.9 Tạo `src/hooks/useThrottle.ts` - Throttle hook

## 🧪 Phase 7: Testing

- [x] 7.1 Cập nhật `jest.setup.js` - Comprehensive mocks (AsyncStorage, NetInfo, expo-modules-core, @expo/vector-icons, expo-font, expo-secure-store, expo-router, Supabase)
- [x] 7.2 Tạo `src/hooks/__tests__/useAnimation.test.ts` - Animation hook tests
- [x] 7.3 Tạo `src/hooks/__tests__/useDashboardData.test.ts` - Dashboard data hook tests
- [x] 7.4 Tạo `src/hooks/__tests__/useDebounce.test.ts` - Debounce hook tests
- [x] 7.5 Tạo `src/hooks/__tests__/useThrottle.test.ts` - Throttle hook tests
- [x] 7.6 Tạo `src/components/dashboard/__tests__/DashboardStats.test.tsx` - DashboardStats component tests
- [x] 7.7 Tạo `src/components/dashboard/__tests__/MetricCard.test.tsx` - MetricCard component tests
- [x] 7.8 Tạo `src/components/dashboard/__tests__/QuickActionButton.test.tsx` - QuickActionButton tests
- [x] 7.9 Tạo `src/components/dashboard/__tests__/RecentOrders.test.tsx` - RecentOrders component tests

## 📱 Phase 8: New Screens & Pages

- [x] 8.1 Tạo `app/(sales)/reports.tsx` - Reports screen với charts/stats
- [x] 8.2 Tạo `app/(sales)/customers/[id].tsx` - Customer detail screen
- [x] 8.3 Tạo `app/(sales-pages)/customers/index.tsx` - Customers list page
- [x] 8.4 Tạo `app/(sales-pages)/inventory/index.tsx` - Inventory management page
- [x] 8.5 Tạo `app/(sales-pages)/users/[id].tsx` - User detail page

## 🔧 Phase 9: Additional Components

- [x] 9.1 Tạo `src/components/AccessibleButton.tsx` - Accessible button với a11y props
- [x] 9.2 Tạo `src/components/AnimatedProductCard.tsx` - Animated product card
- [x] 9.3 Tạo `src/components/ConfirmModal.tsx` - Reusable confirm modal
- [x] 9.4 Tạo `src/components/CustomerHeader.tsx` - Customer header component
- [x] 9.5 Tạo `src/components/ErrorBoundary.tsx` - React error boundary
- [x] 9.6 Tạo `src/components/FadeInView.tsx` - Fade in animated view
- [x] 9.7 Tạo `src/components/NotificationButton.tsx` - Notification bell button
- [x] 9.8 Tạo `src/components/NotificationDrawer.tsx` - Notification drawer/panel
- [x] 9.9 Tạo `src/components/OptimisticOrderStatus.tsx` - Optimistic order status display
- [x] 9.10 Tạo `src/components/SuccessModal.tsx` - Success feedback modal
- [x] 9.11 Tạo `src/components/ValidatedInput.tsx` - Input với validation feedback

## 🔐 Phase 10: Native Integrations

- [x] 10.1 Tạo `src/lib/biometric-auth.ts` - Biometric auth (Face ID/Touch ID) với expo-local-authentication, SecureStore credentials, analytics tracking
- [x] 10.2 Tạo `src/lib/push-notifications.ts` - Push notifications với expo-notifications, permission handling, local scheduling, badge management
- [x] 10.3 Cải thiện `src/lib/analytics.ts` - Full analytics service với event queue, user properties, screen tracking, `withAnalytics` HOC, AnalyticsEvents constants

## ✅ Completed Summary

### Phase 1 - Critical Fixes ✅
| Fix | Impact |
|-----|--------|
| SecureStore adapter `return` | Sessions now persist correctly across app restarts |
| `ErrorTracker.error()` alias | Eliminates runtime crash in useDashboardData |
| `warehouse` in UserRole | Routing to /(warehouse) now type-safe |
| offline-manager executeAction | Real Supabase sync instead of TODO stub |
| App.tsx cleanup | No more confusing boilerplate |

### Phase 2 - Architecture ✅
| Improvement | Impact |
|-------------|--------|
| `src/constants/config.ts` | Single source of truth for hotline, timeouts, limits |
| `StatusBadge` component | Eliminates 3+ duplicate statusMap definitions |
| AuthContext improvements | Safer mounted guard, configurable timeout, proper typing |
| Analytics clearUserProperties | Proper cleanup on logout |
| `dashboard-refactored.tsx` | Clean dashboard using hooks + sub-components |
| `useDashboardData` React Query | Auto-cache, deduplication, background refetch |

### Phase 3 - UX/UI ✅
| Improvement | Impact |
|-------------|--------|
| Login password toggle | Better UX for password entry |
| Login ActivityIndicator | Visual feedback during login |
| Customer dashboard user name | Personalized greeting |
| Customer dashboard 1 query | 50% fewer DB round-trips |
| AppHeader hotline from config | Easy to update without code changes |
| QueryClient staleTime | Reduces unnecessary refetches |

### Phase 4 - Performance & Optimization ✅
| Improvement | Impact |
|-------------|--------|
| `SkeletonLoader` component | Better perceived performance during loading |
| `OptimizedImage` / `VirtualList` | Reduced memory usage for large lists |
| `performanceMonitor` | Measure render/fetch durations in dev |
| `optimistic-updates.ts` | Instant UI feedback before server confirms |
| `animations.ts` | Reusable animation primitives |
| `theme.ts` design tokens | Consistent spacing/colors across app |

### Phase 5 - Dashboard Components ✅
| Component | Impact |
|-----------|--------|
| `DashboardStats` | Reusable stats cards, replaces inline JSX |
| `QuickActions` | Extracted action grid |
| `RecentOrders` | Extracted orders list with StatusBadge |
| `TimeRangeFilter` | Scrollable filter bar |
| `MetricCard` | Generic metric display card |

### Phase 6 - New Hooks ✅
| Hook | Impact |
|------|--------|
| `useDebounce` | Prevents excessive search API calls |
| `useScrollVisibility` | Tab bar hide/show on scroll |
| `useAnimation` | Reusable animation state management |
| `useOrders` / `useProducts` | React Query hooks for data fetching |
| `usePagination` | Cursor-based pagination |
| `useResponsive` | Breakpoint-aware layouts |
| `useThrottle` | Rate-limit event handlers |

### Phase 7 - Testing ✅
| Test | Coverage |
|------|----------|
| `jest.setup.js` | Full mock suite (AsyncStorage, NetInfo, Expo, Supabase) |
| `useAnimation.test.ts` | Animation hook unit tests |
| `useDashboardData.test.ts` | Dashboard data hook with React Query |
| `useDebounce.test.ts` | Debounce timing tests |
| `useThrottle.test.ts` | Throttle timing tests |
| `DashboardStats.test.tsx` | Component render tests |
| `MetricCard.test.tsx` | Metric card tests |
| `RecentOrders.test.tsx` | Orders list tests |

### Phase 8 - New Screens ✅
| Screen | Description |
|--------|-------------|
| `app/(sales)/reports.tsx` | Sales reports with time range |
| `app/(sales)/customers/[id].tsx` | Customer detail view |
| `app/(sales-pages)/customers/index.tsx` | Customers list page |
| `app/(sales-pages)/inventory/index.tsx` | Inventory management |
| `app/(sales-pages)/users/[id].tsx` | User profile detail |

### Phase 9 - Additional Components ✅
| Component | Description |
|-----------|-------------|
| `AccessibleButton` | a11y-compliant button |
| `AnimatedProductCard` | Product card with animations |
| `ConfirmModal` | Reusable confirm dialog |
| `ErrorBoundary` | React error boundary |
| `FadeInView` | Animated fade-in wrapper |
| `NotificationButton` / `NotificationDrawer` | In-app notifications UI |
| `OptimisticOrderStatus` | Instant status update display |
| `ValidatedInput` | Input with inline validation |

### Phase 10 - Native Integrations ✅
| Integration | Status |
|-------------|--------|
| Biometric auth (Face ID/Touch ID) | ✅ Implemented via `expo-local-authentication` |
| Push notifications | ✅ Implemented via `expo-notifications` |
| Analytics service | ✅ Implemented with Firebase setup guide |

## 📋 Remaining (Future Work)

- [ ] Tích hợp Sentry error tracking thực sự (thay thế console.error trong error-tracking.ts)
- [ ] Dark mode support - Tạo ThemeContext, useColorScheme hook, dark variants cho theme.ts
- [ ] Haptic feedback (expo-haptics) - Thêm vào buttons, confirmations, errors
- [ ] Firebase Analytics tích hợp thực sự (uncomment Firebase code trong analytics.ts)
- [ ] Sentry DSN setup và production error reporting
