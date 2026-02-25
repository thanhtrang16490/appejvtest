# Feature Comparison Matrix: appejv-app vs appejv-expo

**Generated**: 2026-02-25  
**Phase**: 1 - Audit & Documentation  
**Status**: 🔍 In Progress

---

## Legend
- ✅ **Exists & Complete** - Feature fully implemented
- ⚠️ **Partial** - Feature exists but incomplete or different
- ❌ **Missing** - Feature does not exist
- 🔍 **Need Review** - Requires deeper inspection
- 📝 **Different Implementation** - Same feature, different approach

---

## 1. ADMIN FEATURES

### Admin Portal
| Feature | appejv-expo (Mobile) | appejv-app (Web) | Priority | Notes |
|---------|---------------------|------------------|----------|-------|
| **Admin Route Group** | ✅ `(admin)/` | ❌ Missing | 🔴 HIGH | Web completely lacks admin portal |
| Admin Dashboard | ✅ `dashboard.tsx` | ❌ | 🔴 HIGH | |
| Admin Analytics | ✅ `analytics.tsx` | ❌ | 🔴 HIGH | |
| Admin Layout | ✅ `_layout.tsx` | ❌ | 🔴 HIGH | |

### Admin - User Management
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| User List | ✅ `users/index.tsx` | ❌ | 🔴 HIGH | Sales has user mgmt, not admin |
| User Detail/Edit | ✅ `users/[id].tsx` | ❌ | 🔴 HIGH | |
| User Roles Management | ✅ | ❌ | 🔴 HIGH | |

### Admin - Categories
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Category Management | ✅ `categories/index.tsx` | ❌ | 🟡 MEDIUM | |

### Admin - Settings
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| System Settings | ✅ `settings/index.tsx` | ❌ | 🟡 MEDIUM | |

**Admin Summary**: 
- **Expo**: 6 screens
- **Web**: 0 screens
- **Gap**: 100% missing

---

## 2. AUTHENTICATION FEATURES

| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Login Page | ✅ `(auth)/` | ✅ `auth/` | ✅ | Both have |
| Logout | ✅ | ✅ | ✅ | Both have |
| Password Reset | ✅ | ✅ | ✅ | Both have |
| Role-based Routing | ✅ | ✅ | ✅ | Both have |
| Session Management | ✅ Supabase | ✅ Supabase | ✅ | Both use Supabase |

**Auth Summary**: ✅ Parity achieved

---

## 3. CUSTOMER FEATURES

### Customer Dashboard
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Dashboard Page | ✅ `dashboard.tsx` | ✅ `dashboard/page.tsx` | ✅ | |
| Quick Actions | ✅ | 🔍 | 🟡 MEDIUM | Need to verify web has same actions |
| Order Summary | ✅ | 🔍 | 🟡 MEDIUM | |
| Recent Orders | ✅ | 🔍 | 🟡 MEDIUM | |

### Customer Products
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Product List | ✅ `products.tsx` | ✅ `products/page.tsx` | ✅ | |
| Product Search | ✅ | 🔍 | 🟡 MEDIUM | |
| Product Filter | ✅ | 🔍 | 🟡 MEDIUM | |
| Product Detail | ✅ | 🔍 | 🟡 MEDIUM | |
| Add to Cart | ✅ | ✅ | ✅ | |

### Customer Orders
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Order List | ✅ `orders/index.tsx` | ✅ `orders/page.tsx` | ✅ | |
| Order Detail | ✅ `orders/[id].tsx` | ✅ `orders/[id]/page.tsx` | ✅ | |
| Order Tracking | ✅ | 🔍 | 🟡 MEDIUM | |
| Order History | ✅ | ✅ | ✅ | |

### Customer Checkout
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Checkout Page | ✅ | ✅ `checkout/page.tsx` | ✅ | |
| Cart Review | ✅ | ✅ | ✅ | |
| Order Confirmation | ✅ | 🔍 | 🟡 MEDIUM | |

### Customer Account
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Account Page | ✅ `account.tsx` | ✅ `account/page.tsx` | ✅ | |
| Profile Edit | ✅ | ✅ `profile/page.tsx` | ✅ | |
| Change Password | ✅ | ✅ `account/change-password/` | ✅ | |

### Customer Selling (C2C)
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Selling Page | ✅ `selling.tsx` | ✅ `selling/page.tsx` | ✅ | Both have! |
| List Product for Sale | ✅ | 🔍 | 🟡 MEDIUM | Need to verify functionality |
| Manage Listings | ✅ | 🔍 | 🟡 MEDIUM | |
| Seller Dashboard | ✅ | 🔍 | 🟡 MEDIUM | |

### Customer More/Menu
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| More/Menu Page | ❌ | ✅ `more/page.tsx` | 📝 | Web has, mobile doesn't |

**Customer Summary**: 
- **Core Features**: ✅ Mostly in parity
- **Selling Feature**: ✅ Both have (need deeper review)
- **Gap**: Minor UI/UX differences

---

## 4. SALES FEATURES

### Sales Dashboard
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Dashboard Page | ✅ `dashboard.tsx` | ✅ `page.tsx` | ✅ | |
| Dashboard Refactored | ✅ `dashboard-refactored.tsx` | ❌ | 🟢 LOW | Expo has 2 versions |
| Analytics | ✅ `analytics.tsx` | ❌ | 🟡 MEDIUM | Separate analytics page |
| Reports | ✅ `reports.tsx` | ✅ `reports/page.tsx` | ✅ | |

### Sales - Customer Management
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Customer List | ✅ `customers/index.tsx` | ✅ `customers/page.tsx` | ✅ | |
| Customer Detail | ✅ `customers/[id].tsx` | ✅ `customers/[id]/page.tsx` | ✅ | |
| Add Customer | ✅ `customers/add.tsx` | 🔍 | 🟡 MEDIUM | Check if web has add form |
| Assign Customer | ✅ `customers/assign.tsx` | 🔍 | 🟡 MEDIUM | Customer assignment feature |

### Sales - Inventory Management
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Inventory List | ✅ `inventory/index.tsx` | ✅ `inventory/page.tsx` | ✅ | |
| Inventory Detail | ✅ `inventory/[id].tsx` | ✅ `inventory/[id]/page.tsx` | ✅ | |
| Add Inventory | ✅ `inventory/add.tsx` | 🔍 | 🟡 MEDIUM | |

### Sales - Order Management
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Order List | ✅ `orders/index.tsx` | ✅ `orders/page.tsx` | ✅ | |
| Order Detail | ✅ `orders/[id].tsx` | ✅ `orders/[id]/page.tsx` | ✅ | |
| Order Actions | ✅ | ✅ `orders/actions.ts` | ✅ | |

### Sales - User Management
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| User List | ✅ `users/index.tsx` | ✅ `users/page.tsx` | ✅ | |
| User Detail | ✅ `users/[id].tsx` | 🔍 | 🟡 MEDIUM | Check if web has detail page |
| Add User | ✅ | ✅ `AddUserDialog.tsx` | ✅ | |
| Delete User | ✅ | ✅ `DeleteUserButton.tsx` | ✅ | |
| User Form | ✅ | ✅ `UserForm.tsx` | ✅ | |

### Sales - Other Features
| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Categories | ✅ `categories.tsx` | ❌ | 🟡 MEDIUM | |
| Selling | ✅ `selling.tsx` | ✅ `selling/page.tsx` | ✅ | |
| Settings | ✅ `settings.tsx` | ✅ `settings/page.tsx` | ✅ | |
| Menu | ✅ `menu.tsx` | ✅ `menu/page.tsx` | ✅ | |
| Export | ✅ `export.tsx` | ❌ | 🟡 MEDIUM | Data export feature |
| Audit Logs | ❌ | ✅ `audit-logs/page.tsx` | 📝 | Web has, mobile doesn't! |

**Sales Summary**: 
- **Core Features**: ✅ Good parity
- **Audit Logs**: Web has, mobile doesn't
- **Export**: Mobile has, web doesn't
- **Gap**: Minor feature differences

---

## 5. SALES-PAGES (Expo Only)

### What is sales-pages?
Appears to be a **duplicate/alternative** implementation of sales features in Expo.

| Feature | Location | Notes |
|---------|----------|-------|
| Customers | `(sales-pages)/customers/` | Duplicate of `(sales)/customers/` |
| Inventory | `(sales-pages)/inventory/` | Duplicate of `(sales)/inventory/` |
| Orders | `(sales-pages)/orders/` | Duplicate of `(sales)/orders/` |
| Team | `(sales-pages)/team/` | NEW - Team management |
| Users | `(sales-pages)/users/` | Duplicate of `(sales)/users/` |

**Analysis**: 
- 🤔 Appears to be refactoring in progress
- 📝 May be testing new navigation structure
- ⚠️ Has `.backup` files suggesting active development
- 🎯 **Recommendation**: Clarify with team which version is canonical

---

## 6. WAREHOUSE FEATURES

| Feature | appejv-expo | appejv-app | Priority | Notes |
|---------|-------------|------------|----------|-------|
| Warehouse Dashboard | ✅ `dashboard.tsx` | ❌ | 🟡 MEDIUM | |
| Warehouse Menu | ✅ `menu.tsx` | ❌ | 🟡 MEDIUM | |
| Warehouse Orders | ✅ `orders.tsx` | ✅ `orders/page.tsx` | ✅ | |
| Warehouse Products | ✅ `products.tsx` | ❌ | 🟡 MEDIUM | |
| Warehouse Reports | ✅ `reports.tsx` | ❌ | 🟡 MEDIUM | |

**Warehouse Summary**: 
- **Expo**: 5 screens
- **Web**: 1 screen
- **Gap**: 80% missing

---

## 7. COMPONENTS COMPARISON

### appejv-expo Components
```
src/components/
├── dashboard/              # Dashboard-specific components
├── optimized/              # Performance-optimized components
├── AccessibleButton.tsx
├── AnimatedProductCard.tsx
├── AppHeader.tsx
├── ConfirmModal.tsx
├── CustomerHeader.tsx
├── ErrorBoundary.tsx
├── FadeInView.tsx
├── NotificationButton.tsx
├── NotificationDrawer.tsx
├── OptimisticOrderStatus.tsx
├── OptimizedImage.tsx
├── OptimizedList.tsx
├── SkeletonLoader.tsx
├── SuccessModal.tsx
└── ValidatedInput.tsx
```

### appejv-app Components
```
components/
├── account/        # Account-related components
├── cart/           # Shopping cart components
├── customer/       # Customer-specific components
├── layout/         # Layout components
├── loading/        # Loading states
├── sales/          # Sales-specific components
└── ui/             # UI primitives (shadcn/ui)
```

### Component Gaps

| Component Type | appejv-expo | appejv-app | Priority | Notes |
|----------------|-------------|------------|----------|-------|
| **Animations** | ✅ FadeInView, AnimatedProductCard | ❌ | 🟢 LOW | Mobile-specific |
| **Optimizations** | ✅ OptimizedImage, OptimizedList | ⚠️ | 🟡 MEDIUM | Web has Next.js Image |
| **Notifications** | ✅ NotificationButton, NotificationDrawer | 🔍 | 🟡 MEDIUM | Check if web has |
| **Modals** | ✅ ConfirmModal, SuccessModal | 🔍 | 🟡 MEDIUM | Check web implementation |
| **Headers** | ✅ AppHeader, CustomerHeader | 🔍 | 🟡 MEDIUM | Check web headers |
| **Error Handling** | ✅ ErrorBoundary | 🔍 | 🟡 MEDIUM | Check if web has |
| **Skeleton Loaders** | ✅ SkeletonLoader | 🔍 | 🟡 MEDIUM | Check web loading states |
| **UI Library** | ❌ | ✅ Radix UI + shadcn/ui | 📝 | Different approach |

---

## 8. STATE MANAGEMENT & DATA FETCHING

| Aspect | appejv-expo | appejv-app | Status |
|--------|-------------|------------|--------|
| **State Management** | Zustand 5.0.11 | Zustand 5.0.11 | ✅ Same |
| **Data Fetching** | TanStack Query 5.90.20 | TanStack Query 5.90.20 | ✅ Same |
| **Auth Context** | ✅ `src/contexts/AuthContext.tsx` | 🔍 | 🟡 MEDIUM |
| **Other Contexts** | 🔍 | 🔍 | 🟡 MEDIUM |

---

## 9. HOOKS & UTILITIES

### Need to Audit
- [ ] List all custom hooks in expo `src/hooks/`
- [ ] List all custom hooks in web `lib/hooks/`
- [ ] Compare utility functions
- [ ] Compare API client implementations

---

## 10. PRIORITY SUMMARY

### 🔴 HIGH PRIORITY (Must Fix)
1. **Admin Portal** - Completely missing in web (6 screens)
2. **Warehouse Features** - 80% missing in web (4 screens)
3. **Customer Assignment** - Check if web has this feature
4. **Inventory Add Form** - Verify web has add functionality

### 🟡 MEDIUM PRIORITY (Should Fix)
1. **Sales Analytics** - Separate page in mobile
2. **Sales Export** - Mobile has, web doesn't
3. **Categories Management** - Mobile has, web doesn't
4. **Warehouse Dashboard** - Mobile has, web doesn't
5. **Notification System** - Verify web implementation
6. **Error Boundaries** - Verify web has proper error handling

### 🟢 LOW PRIORITY (Nice to Have)
1. **Animations** - Mobile-specific, not critical for web
2. **Dashboard Refactored** - Mobile has 2 versions, clarify which is canonical
3. **sales-pages** - Clarify purpose and if needed in web

---

## 11. NEXT STEPS FOR PHASE 1

### Immediate Tasks
- [x] Map all routes in both apps
- [x] List all components
- [ ] **Deep dive into key features**:
  - [ ] Read admin dashboard code (expo)
  - [ ] Read customer selling code (both)
  - [ ] Read warehouse features (expo)
  - [ ] Read audit logs (web)
  - [ ] Compare user management implementations

### Documentation to Create
- [ ] Admin Features Specification
- [ ] Warehouse Features Specification
- [ ] Component Migration Guide
- [ ] API Endpoints Comparison

### Questions to Answer
1. Why does expo have `(sales-pages)/` duplicate?
2. Is audit logs in web but not mobile intentional?
3. What is the canonical dashboard version in expo?
4. Are there any features in web that mobile doesn't have?

---

## 12. ESTIMATED EFFORT

### Admin Portal (Web)
- **Screens**: 6
- **Effort**: 3-4 days
- **Complexity**: Medium (can copy logic from mobile)

### Warehouse Features (Web)
- **Screens**: 4
- **Effort**: 2-3 days
- **Complexity**: Medium

### Feature Parity Fixes
- **Items**: ~10-15 small gaps
- **Effort**: 2-3 days
- **Complexity**: Low-Medium

### Testing & QA
- **Effort**: 2-3 days
- **Complexity**: Medium

**Total Estimate**: 9-13 days (2-3 weeks with 1 developer)

---

## CONCLUSION

### Key Findings
1. ✅ **Core features** have good parity (auth, customer, sales, orders)
2. ❌ **Admin portal** completely missing in web - CRITICAL GAP
3. ⚠️ **Warehouse features** mostly missing in web - IMPORTANT GAP
4. 📝 **Different implementations** for some features (audit logs, export)
5. 🤔 **Unclear purpose** of `(sales-pages)/` in expo

### Recommendations
1. **Start with Admin Portal** - Highest priority, most missing
2. **Add Warehouse Features** - Second priority
3. **Clarify sales-pages** - Understand purpose before implementing
4. **Sync minor features** - Export, categories, analytics
5. **Standardize components** - Create shared patterns

### Success Criteria
- [ ] Admin portal fully functional in web
- [ ] Warehouse features match mobile
- [ ] All customer features verified
- [ ] All sales features verified
- [ ] Component library documented
- [ ] Testing checklist complete

---

**Phase 1 Status**: 🟡 70% Complete  
**Next Phase**: Phase 2 - Admin Features Implementation  
**Last Updated**: 2026-02-25
