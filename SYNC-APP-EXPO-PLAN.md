# Kế Hoạch Đồng Bộ Hóa appejv-app với appejv-expo

## Tổng Quan

**Mục tiêu**: Đồng bộ hóa appejv-app (Next.js web app) với appejv-expo (React Native mobile app) để có cùng tính năng, cấu trúc và trải nghiệm người dùng.

**Ngày tạo**: 2026-02-25

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1. Tech Stack Comparison

| Aspect | appejv-app (Web) | appejv-expo (Mobile) | Status |
|--------|------------------|----------------------|--------|
| **Framework** | Next.js 16.1.6 | Expo ~54.0.33 | ✅ Different (OK) |
| **React** | 19.2.3 | 19.1.0 | ✅ Similar |
| **Routing** | Next.js App Router | Expo Router 6.0.23 | ⚠️ Different approach |
| **State Management** | Zustand 5.0.11 | Zustand 5.0.11 | ✅ Same |
| **Data Fetching** | TanStack Query 5.90.20 | TanStack Query 5.90.20 | ✅ Same |
| **Auth/DB** | Supabase 2.94.1 | Supabase 2.95.3 | ✅ Similar |
| **Styling** | Tailwind CSS 4 | NativeWind (implied) | ⚠️ Different |
| **Forms** | React Hook Form 7.71.1 | ❌ Not present | ❌ Missing |
| **UI Components** | Radix UI + shadcn/ui | Custom components | ⚠️ Different |

### 1.2. Routing Structure Comparison

#### appejv-app (Web)
```
app/
├── account/          # Account management
├── api/              # API routes
├── auth/             # Authentication pages
├── customer/         # Customer portal
├── sales/            # Sales dashboard
└── warehouse/        # Warehouse management
```

#### appejv-expo (Mobile)
```
app/
├── (admin)/          # Admin features (NEW!)
├── (auth)/           # Authentication
├── (customer)/       # Customer portal
├── (sales-pages)/    # Sales pages (NEW!)
├── (sales)/          # Sales dashboard
└── (warehouse)/      # Warehouse management
```

**Khác biệt chính**:
- ✅ Expo có `(admin)/` - Web KHÔNG có
- ✅ Expo có `(sales-pages)/` - Web KHÔNG có
- ❌ Web có `account/` - Expo KHÔNG có (merged vào customer?)
- ❌ Web có `api/` routes - Expo không cần (mobile app)

---

## 2. TÍNH NĂNG CẦN ĐỒNG BỘ

### 2.1. Authentication & Authorization ✅ (Đã có cả 2)
- [x] Login/Logout
- [x] Password reset
- [x] Role-based access (Sales, Customer, Warehouse)
- [x] Session management

### 2.2. Customer Features

#### appejv-expo HAS (Mobile)
- ✅ Dashboard with quick actions
- ✅ Product browsing & search
- ✅ Shopping cart
- ✅ Order placement
- ✅ Order history & tracking
- ✅ Profile management
- ✅ Selling products (customer-to-customer)

#### appejv-app NEEDS (Web)
- ⚠️ Check if all customer features match mobile
- ⚠️ Verify selling feature exists
- ⚠️ Compare UI/UX flow

### 2.3. Sales Features

#### appejv-expo HAS (Mobile)
- ✅ Sales dashboard
- ✅ Customer management
- ✅ Order management
- ✅ Inventory management
- ✅ Reports & analytics
- ✅ User management
- ✅ Audit logs
- ✅ Settings

#### appejv-app NEEDS (Web)
- ⚠️ Verify all sales features exist
- ⚠️ Check if audit logs implemented
- ⚠️ Compare dashboard metrics

### 2.4. Warehouse Features

#### appejv-expo HAS (Mobile)
- ✅ Order fulfillment
- ✅ Inventory tracking
- ✅ Warehouse-specific views

#### appejv-app NEEDS (Web)
- ⚠️ Verify warehouse features match

### 2.5. Admin Features ❌ (MISSING in Web)

#### appejv-expo HAS (Mobile)
- ✅ Admin dashboard
- ✅ System settings
- ✅ User role management
- ✅ Advanced configurations

#### appejv-app NEEDS (Web)
- ❌ Create `app/admin/` route group
- ❌ Implement admin dashboard
- ❌ Add system-wide settings
- ❌ Add advanced user management

---

## 3. KẾ HOẠCH THỰC HIỆN

### PHASE 1: Audit & Documentation (1-2 days)
**Mục tiêu**: Hiểu rõ tất cả tính năng hiện có

#### Task 1.1: Deep Dive appejv-expo
- [ ] List all screens/pages in each route group
- [ ] Document all components and their props
- [ ] Map out data flow and API calls
- [ ] Document state management patterns
- [ ] List all hooks and utilities

#### Task 1.2: Deep Dive appejv-app
- [ ] List all pages and routes
- [ ] Document existing components
- [ ] Map out data flow and API calls
- [ ] Identify missing features vs expo

#### Task 1.3: Create Feature Matrix
- [ ] Create detailed comparison spreadsheet
- [ ] Mark: ✅ Exists, ⚠️ Partial, ❌ Missing
- [ ] Prioritize features by importance

**Deliverable**: `FEATURE-COMPARISON-MATRIX.md`

---

### PHASE 2: Admin Features (3-4 days)
**Mục tiêu**: Thêm admin portal vào web app

#### Task 2.1: Create Admin Route Structure
```bash
app/admin/
├── layout.tsx          # Admin layout with sidebar
├── page.tsx            # Admin dashboard
├── users/
│   ├── page.tsx        # User management list
│   └── [id]/
│       └── page.tsx    # User detail/edit
├── settings/
│   └── page.tsx        # System settings
└── logs/
    └── page.tsx        # System logs
```

#### Task 2.2: Admin Components
- [ ] AdminSidebar component
- [ ] AdminHeader component
- [ ] UserManagementTable
- [ ] SystemSettingsForm
- [ ] AuditLogViewer

#### Task 2.3: Admin Permissions
- [ ] Add admin role check middleware
- [ ] Protect admin routes
- [ ] Add permission-based UI rendering

**Deliverable**: Fully functional admin portal

---

### PHASE 3: Customer Features Sync (3-4 days)
**Mục tiêu**: Đảm bảo customer features giống nhau

#### Task 3.1: Compare Customer Screens
- [ ] Dashboard comparison
- [ ] Products browsing
- [ ] Cart & checkout
- [ ] Order history
- [ ] Profile management
- [ ] Selling feature

#### Task 3.2: Add Missing Features
- [ ] Implement any missing customer features
- [ ] Sync UI/UX patterns
- [ ] Add mobile-like quick actions

#### Task 3.3: Customer Selling Feature
- [ ] Verify selling feature exists in web
- [ ] If not, implement from expo version
- [ ] Add product listing form
- [ ] Add seller dashboard

**Deliverable**: Parity in customer features

---

### PHASE 4: Sales Features Sync (2-3 days)
**Mục tiêu**: Đảm bảo sales features giống nhau

#### Task 4.1: Sales Dashboard
- [ ] Compare dashboard metrics
- [ ] Sync chart components
- [ ] Add missing widgets

#### Task 4.2: Sales Management
- [ ] Customer management comparison
- [ ] Order management comparison
- [ ] Inventory management comparison
- [ ] Reports comparison

#### Task 4.3: Audit Logs
- [ ] Check if audit logs exist in web
- [ ] If not, implement from expo
- [ ] Add log viewer UI
- [ ] Add filtering and search

**Deliverable**: Parity in sales features

---

### PHASE 5: Warehouse Features Sync (1-2 days)
**Mục tiêu**: Đảm bảo warehouse features giống nhau

#### Task 5.1: Compare Warehouse Screens
- [ ] Order fulfillment flow
- [ ] Inventory tracking
- [ ] Warehouse dashboard

#### Task 5.2: Add Missing Features
- [ ] Implement any missing features
- [ ] Sync workflows

**Deliverable**: Parity in warehouse features

---

### PHASE 6: UI/UX Consistency (2-3 days)
**Mục tiêu**: Đảm bảo trải nghiệm người dùng nhất quán

#### Task 6.1: Component Library Sync
- [ ] Create shared component patterns
- [ ] Standardize button styles
- [ ] Standardize form inputs
- [ ] Standardize cards and layouts

#### Task 6.2: Navigation Patterns
- [ ] Sync navigation structure
- [ ] Add breadcrumbs where needed
- [ ] Standardize menu items

#### Task 6.3: Responsive Design
- [ ] Ensure mobile-responsive web app
- [ ] Test on different screen sizes
- [ ] Add mobile-first optimizations

**Deliverable**: Consistent UI/UX across platforms

---

### PHASE 7: Testing & QA (2-3 days)
**Mục tiêu**: Đảm bảo chất lượng và không có regression

#### Task 7.1: Feature Testing
- [ ] Test all customer features
- [ ] Test all sales features
- [ ] Test all warehouse features
- [ ] Test all admin features

#### Task 7.2: Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Task 7.3: Performance Testing
- [ ] Page load times
- [ ] API response times
- [ ] Bundle size optimization

**Deliverable**: Tested and stable application

---

## 4. TECHNICAL CONSIDERATIONS

### 4.1. Shared Code Opportunities
- ✅ API client logic (Supabase)
- ✅ Type definitions (database.types.ts)
- ✅ Business logic hooks
- ✅ Validation schemas (Zod)
- ⚠️ UI components (need adaptation)

### 4.2. Platform-Specific Differences
- **Navigation**: Next.js Link vs Expo Router Link
- **Styling**: Tailwind CSS vs NativeWind
- **Storage**: localStorage vs AsyncStorage
- **File handling**: Different APIs
- **Camera/Media**: Web APIs vs Expo APIs

### 4.3. Recommended Approach
1. **Create shared package** (optional):
   ```
   packages/
   └── shared/
       ├── types/
       ├── utils/
       ├── hooks/
       └── validation/
   ```

2. **Keep platform-specific**:
   - UI components
   - Navigation logic
   - Platform APIs

---

## 5. PRIORITY MATRIX

### High Priority (Must Have)
1. ✅ Admin features (completely missing)
2. ✅ Customer selling feature (if missing)
3. ✅ Audit logs (if missing)
4. ✅ Feature parity in core flows

### Medium Priority (Should Have)
1. ⚠️ UI/UX consistency
2. ⚠️ Component library standardization
3. ⚠️ Performance optimizations

### Low Priority (Nice to Have)
1. 📝 Shared code extraction
2. 📝 Advanced animations
3. 📝 PWA features for web

---

## 6. RISKS & MITIGATION

### Risk 1: Breaking Existing Features
**Mitigation**: 
- Create feature branches
- Comprehensive testing before merge
- Gradual rollout

### Risk 2: Different User Expectations
**Mitigation**:
- User testing on both platforms
- Gather feedback early
- Iterate based on usage patterns

### Risk 3: Performance Issues
**Mitigation**:
- Monitor bundle size
- Lazy load components
- Optimize images and assets

---

## 7. SUCCESS METRICS

### Functional Parity
- [ ] 100% of expo features available in web
- [ ] All user roles supported
- [ ] All workflows functional

### Quality Metrics
- [ ] 0 critical bugs
- [ ] < 5 minor bugs
- [ ] 95%+ test coverage for new features

### Performance Metrics
- [ ] Page load < 2s
- [ ] Time to interactive < 3s
- [ ] Lighthouse score > 90

---

## 8. NEXT STEPS

### Immediate Actions (Today)
1. ✅ Review this plan with team
2. ⬜ Start Phase 1: Audit appejv-expo screens
3. ⬜ Create FEATURE-COMPARISON-MATRIX.md

### This Week
1. ⬜ Complete Phase 1 audit
2. ⬜ Start Phase 2: Admin features
3. ⬜ Set up testing environment

### Next Week
1. ⬜ Continue Phase 2-3
2. ⬜ Begin Phase 4
3. ⬜ Regular progress reviews

---

## 9. RESOURCES NEEDED

### Development
- 1 Senior Full-stack Developer (lead)
- 1 Frontend Developer (UI/UX)
- 1 QA Engineer (testing)

### Time Estimate
- **Total**: 15-20 working days
- **With 2 developers**: 2-3 weeks
- **With 1 developer**: 4-5 weeks

### Tools
- Git for version control
- Figma for design reference
- Jira/Linear for task tracking
- Postman for API testing

---

## 10. DOCUMENTATION TO CREATE

1. ✅ `SYNC-APP-EXPO-PLAN.md` (this file)
2. ⬜ `FEATURE-COMPARISON-MATRIX.md`
3. ⬜ `ADMIN-FEATURES-SPEC.md`
4. ⬜ `COMPONENT-LIBRARY-GUIDE.md`
5. ⬜ `TESTING-CHECKLIST.md`
6. ⬜ `DEPLOYMENT-GUIDE.md`

---

## APPENDIX A: Quick Reference

### Key Files to Review

**appejv-expo**:
- `app/(admin)/` - Admin features
- `app/(customer)/selling.tsx` - Selling feature
- `app/(sales)/audit-logs/` - Audit logs
- `src/components/` - Reusable components
- `src/contexts/AuthContext.tsx` - Auth logic

**appejv-app**:
- `app/customer/` - Customer features
- `app/sales/` - Sales features
- `components/` - UI components
- `lib/auth/` - Auth logic

### Commands

```bash
# Start web app
cd appejv-app && npm run dev

# Start mobile app
cd appejv-expo && npm start

# Run tests
npm test

# Build for production
npm run build
```

---

**Last Updated**: 2026-02-25
**Status**: 📋 Planning Phase
**Next Review**: After Phase 1 completion
