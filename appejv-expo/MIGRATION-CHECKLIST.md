# Migration Checklist

Checklist để migrate code hiện tại sang sử dụng các utilities và patterns mới.

## 🚀 Setup (Bắt buộc)

- [ ] Chạy `npm install` để cài đặt dependencies mới
- [ ] Chạy `npx husky install` để setup git hooks
- [ ] Chạy `chmod +x .husky/pre-commit` để enable pre-commit hook
- [ ] Chạy `npm test` để verify test setup
- [ ] Chạy `npm run lint` để check code quality
- [ ] Đọc `SETUP-GUIDE.md` để hiểu workflow mới

## 📝 Code Migration (Khuyến nghị)

### 1. API Calls

**Priority: HIGH**

Tìm và replace tất cả direct Supabase calls:

- [ ] Search for `await supabase.` trong codebase
- [ ] Wrap với `apiCall()` từ `@/lib/api-helpers`
- [ ] Thêm context parameter cho debugging
- [ ] Thêm offline support cho user actions quan trọng

**Example locations:**
- [ ] `app/(sales)/dashboard.tsx`
- [ ] `app/(customer)/products/index.tsx`
- [ ] `app/(admin)/users/index.tsx`
- [ ] All form submission handlers

**Before:**
```typescript
const { data, error } = await supabase.from('products').select('*')
```

**After:**
```typescript
import { apiCall } from '@/lib/api-helpers'
const result = await apiCall(
  () => supabase.from('products').select('*'),
  { context: 'ProductList.fetch' }
)
```

### 2. Error Handling

**Priority: HIGH**

- [ ] Import ErrorTracker trong components có error handling
- [ ] Replace `console.error()` với `ErrorTracker.error()`
- [ ] Thêm context cho mỗi error log
- [ ] Set user context sau login trong AuthContext ✅ (Done)
- [ ] Clear user context khi logout ✅ (Done)

**Locations:**
- [ ] All try-catch blocks
- [ ] All `.catch()` handlers
- [ ] Error boundaries

### 3. Constants

**Priority: MEDIUM**

Replace hardcoded values với constants:

#### Colors
- [ ] Search for `#` trong style objects
- [ ] Replace với `COLORS.*` từ `@/constants/colors`
- [ ] Use `getRoleColor()` và `getStatusColor()` helpers

**Locations:**
- [ ] All StyleSheet.create() calls
- [ ] Inline styles
- [ ] Theme configurations

#### Spacing
- [ ] Search for hardcoded numbers trong padding/margin
- [ ] Replace với `SPACING.*` từ `@/constants/layout`

**Common values to replace:**
- `4` → `SPACING.xs`
- `8` → `SPACING.sm`
- `16` → `SPACING.md`
- `24` → `SPACING.lg`
- `32` → `SPACING.xl`

#### Sizes
- [ ] Replace hardcoded icon sizes với `SIZES.icon.*`
- [ ] Replace button heights với `SIZES.button.*`
- [ ] Replace input heights với `SIZES.input.*`

#### Border Radius
- [ ] Replace hardcoded border radius với `RADIUS.*`

### 4. Validation

**Priority: MEDIUM**

- [ ] Find all form validation logic
- [ ] Replace với `validators.*` từ `@/lib/validation`
- [ ] Use `validateField()` cho complex validation

**Locations:**
- [ ] Login forms
- [ ] Registration forms
- [ ] Profile edit forms
- [ ] Product forms
- [ ] Order forms

### 5. Performance Monitoring

**Priority: LOW**

Thêm performance tracking cho operations chậm:

- [ ] Identify slow operations (data fetching, rendering)
- [ ] Wrap với `performanceMonitor.measure()`
- [ ] Monitor trong development
- [ ] Remove hoặc disable trong production nếu cần

**Candidates:**
- [ ] Dashboard data loading
- [ ] Product list rendering
- [ ] Image uploads
- [ ] Report generation

### 6. Offline Support

**Priority: MEDIUM**

Thêm offline support cho user actions quan trọng:

- [ ] Order creation
- [ ] Product updates
- [ ] Customer updates
- [ ] Profile updates

**Pattern:**
```typescript
const result = await apiCall(
  () => supabase.from('orders').insert(data),
  {
    offlineAction: 'create_order',
    offlineData: data,
    context: 'OrderForm.submit'
  }
)
```

## 🧪 Testing

**Priority: HIGH**

- [ ] Viết tests cho business logic quan trọng
- [ ] Viết tests cho custom hooks
- [ ] Viết tests cho utility functions
- [ ] Viết tests cho form validation
- [ ] Target: 70% coverage

**Priority components to test:**
- [ ] AuthContext ✅ (Done)
- [ ] Validation utilities ✅ (Done)
- [ ] Product list component
- [ ] Order form component
- [ ] Dashboard calculations
- [ ] Permission checks

## 📚 Documentation

**Priority: MEDIUM**

- [ ] Thêm JSDoc comments cho public functions
- [ ] Document complex business logic
- [ ] Add examples trong comments
- [ ] Update README nếu có breaking changes

**Pattern:**
```typescript
/**
 * Tính tổng giá trị đơn hàng
 * @param items - Danh sách sản phẩm trong đơn hàng
 * @param discount - Phần trăm giảm giá (0-100)
 * @returns Tổng giá trị sau khi giảm giá
 * @example
 * const total = calculateOrderTotal(items, 10) // 10% discount
 */
function calculateOrderTotal(items: OrderItem[], discount: number): number {
  // ...
}
```

## 🔧 Refactoring

**Priority: MEDIUM**

### Large Components

- [ ] `app/(sales)/dashboard.tsx` (1127 lines)
  - [ ] Extract statistics calculation logic
  - [ ] Extract chart components
  - [ ] Extract filter logic
  - [ ] Create custom hooks for data fetching

- [ ] Other components > 500 lines
  - [ ] Identify and list them
  - [ ] Break into smaller components
  - [ ] Extract business logic

### Custom Hooks

Create custom hooks cho reusable logic:

- [ ] `useProducts()` - Product fetching và caching
- [ ] `useOrders()` - Order management
- [ ] `useCustomers()` - Customer management
- [ ] `usePermissions()` - Permission checks
- [ ] `useOfflineSync()` - Offline sync status

## 🎨 Code Quality

**Priority: HIGH**

- [ ] Fix all ESLint errors
- [ ] Fix all ESLint warnings (nếu có thể)
- [ ] Fix all TypeScript errors
- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Remove console.logs (replace với ErrorTracker)

**Commands:**
```bash
npm run lint:fix
npm run format
npm run type-check
```

## 📱 Testing on Devices

**Priority: HIGH**

Test trên devices sau khi migration:

- [ ] iOS Simulator
- [ ] Android Emulator
- [ ] Physical iOS device (nếu có)
- [ ] Physical Android device (nếu có)

**Test scenarios:**
- [ ] Login/Logout
- [ ] Create order
- [ ] View products
- [ ] Update profile
- [ ] Offline mode
- [ ] Network reconnection

## 🚦 Verification

Trước khi merge:

- [ ] All tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] No type errors (`npm run type-check`)
- [ ] Code formatted (`npm run format`)
- [ ] App runs on iOS
- [ ] App runs on Android
- [ ] No console errors
- [ ] No console warnings (critical ones)

## 📊 Progress Tracking

### Overall Progress

- Setup: 0/6 ✅ → 6/6 ✅
- API Calls: 0/? → ?/?
- Error Handling: 2/? → ?/?
- Constants: 0/? → ?/?
- Validation: 0/? → ?/?
- Testing: 2/? → ?/?
- Documentation: 0/? → ?/?
- Refactoring: 0/? → ?/?

### By Priority

- HIGH: ?/? completed
- MEDIUM: ?/? completed
- LOW: ?/? completed

## 💡 Tips

1. **Migrate incrementally** - Không cần làm tất cả cùng lúc
2. **Test after each change** - Đảm bảo không break existing functionality
3. **Commit often** - Small commits dễ review và revert
4. **Use git branches** - Create feature branch cho migration
5. **Ask for help** - Nếu không chắc chắn, hỏi team
6. **Read documentation** - QUICK-REFERENCE.md có tất cả examples
7. **Run pre-commit hooks** - Sẽ catch errors sớm

## 🎯 Success Criteria

Migration được coi là thành công khi:

- ✅ All tests pass
- ✅ No lint errors
- ✅ No type errors
- ✅ App runs without errors
- ✅ All critical features work
- ✅ Code coverage ≥ 70%
- ✅ Team understands new patterns
- ✅ Documentation is complete

## 📅 Timeline

**Suggested timeline:**

- Week 1: Setup + API Calls migration
- Week 2: Error Handling + Constants
- Week 3: Validation + Testing
- Week 4: Refactoring + Documentation
- Week 5: Testing + Bug fixes
- Week 6: Final review + Deployment

**Adjust based on team size and availability.**

## 🆘 Common Issues

### Issue: Pre-commit hook fails

**Solution:**
```bash
npm run lint:fix
npm run format
git add .
git commit -m "message"
```

### Issue: Tests fail after migration

**Solution:**
- Check if mocks are updated
- Check if imports are correct
- Run `npm test -- --clearCache`

### Issue: TypeScript errors

**Solution:**
- Check if types are imported
- Check if constants have correct types
- Run `npm run type-check` for details

### Issue: App crashes after migration

**Solution:**
- Check console for errors
- Check if all imports are correct
- Check if offline manager is initialized
- Revert last change and debug

## ✅ Final Checklist

Trước khi đánh dấu migration hoàn thành:

- [ ] All code migrated
- [ ] All tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] App tested on devices
- [ ] Documentation updated
- [ ] Team trained on new patterns
- [ ] Deployment successful
- [ ] Monitoring setup (if applicable)
- [ ] Rollback plan ready

---

**Good luck with the migration! 🚀**
