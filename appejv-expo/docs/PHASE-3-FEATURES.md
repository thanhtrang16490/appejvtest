# Phase 3: Team Management Features

## Tổng quan

Phase 3 bổ sung các tính năng quản lý team cho vai trò `sale_admin`, cho phép quản lý nhân viên bán hàng và theo dõi hiệu suất team.

## Tính năng đã triển khai

### 1. My/Team/All Tabs - Customers Page

**File:** `app/(sales)/customers/index.tsx`

**Chức năng:**
- Tab "Của tôi": Hiển thị khách hàng được phân công cho user hiện tại
- Tab "Team": Hiển thị khách hàng của toàn bộ team (chỉ sale_admin)
- Tab "Tất cả": Hiển thị tất cả khách hàng (chỉ sale_admin)

**Logic:**
```typescript
// Của tôi: assigned_to = current_user_id
// Team: assigned_to IN (team_member_ids)
// Tất cả: Không filter
```

### 2. My/Team Tabs - Orders Page

**File:** `app/(sales)/orders/index.tsx`

**Chức năng:**
- Tab "Của tôi": Đơn hàng của khách hàng được phân công cho user
- Tab "Team": Đơn hàng của khách hàng trong team (chỉ sale_admin)

**Logic:**
```typescript
// Join orders với customers để filter theo assigned_to
```

### 3. Team Performance Dashboard

**File:** `app/(sales)/dashboard.tsx`

**Chức năng:**
- Hiển thị section "Hiệu suất Team" cho sale_admin
- Thống kê:
  - Tổng số thành viên team
  - Tổng khách hàng của team
  - Tổng đơn hàng của team
  - Tổng doanh thu của team

**Hiển thị:**
- Chỉ hiển thị khi user có role = 'sale_admin'
- Sử dụng feature flag: `ENABLE_TEAM_DASHBOARD`

### 4. Customer Assignment UI

**File:** `app/(sales)/customers/assign.tsx`

**Chức năng:**
- Phân công khách hàng cho nhân viên trong team
- Dropdown chọn nhân viên
- Cập nhật `assigned_to` field trong customers table

**Quyền truy cập:**
- Chỉ sale_admin mới có thể assign

### 5. Team Management Pages

**Files:**
- `app/(sales)/team/index.tsx` - Danh sách team members
- `app/(sales)/team/[id].tsx` - Chi tiết team member

**Chức năng:**
- Xem danh sách nhân viên trong team
- Xem chi tiết hiệu suất từng nhân viên
- Thống kê khách hàng và đơn hàng của từng người

**Quyền truy cập:**
- Chỉ sale_admin (manager_id = current_user_id)

### 6. Menu "Quản lý Team"

**File:** `app/(sales)/menu.tsx`

**Chức năng:**
- Thêm menu item "Quản lý Team" cho sale_admin
- Icon: people-outline
- Link: /(sales)/team

**Hiển thị:**
- Chỉ hiển thị khi role = 'sale_admin'
- Sử dụng feature flag: `ENABLE_TEAM_MANAGEMENT`

## Feature Flags

**File:** `src/lib/feature-flags.ts`

```typescript
export const FEATURE_FLAGS = {
  // Phase 3: Team Management
  ENABLE_TEAM_TABS: true,           // My/Team/All tabs
  ENABLE_TEAM_DASHBOARD: true,      // Team performance section
  ENABLE_TEAM_MANAGEMENT: true,     // Team management pages
  ENABLE_CUSTOMER_ASSIGNMENT: true, // Assign customers
}
```

**Cách sử dụng:**
```typescript
import { FEATURE_FLAGS } from '@/lib/feature-flags'

if (FEATURE_FLAGS.ENABLE_TEAM_TABS && user.role === 'sale_admin') {
  // Show team tabs
}
```

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sale', 'sale_admin', 'customer', 'warehouse')),
  manager_id UUID REFERENCES profiles(id),
  CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'sale', 'sale_admin', 'customer', 'warehouse'))
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Hierarchy Query
```sql
-- Lấy team members của sale_admin
SELECT id, full_name, role
FROM profiles
WHERE manager_id = :current_user_id
  AND role IN ('sale', 'sale_admin');
```

## Testing

### Test Scenarios

1. **Sale Admin Login:**
   - Kiểm tra menu "Quản lý Team" hiển thị
   - Kiểm tra dashboard có section "Hiệu suất Team"
   - Kiểm tra customers page có 3 tabs

2. **Sale Login:**
   - Kiểm tra menu "Quản lý Team" KHÔNG hiển thị
   - Kiểm tra dashboard KHÔNG có section team
   - Kiểm tra customers page chỉ có tab "Của tôi"

3. **Customer Assignment:**
   - Sale admin vào customers page
   - Chọn khách hàng
   - Assign cho team member
   - Verify assigned_to được update

4. **Team Performance:**
   - Sale admin vào dashboard
   - Kiểm tra số liệu team hiển thị đúng
   - Verify query chỉ lấy data của team

## Known Issues

### Đã giải quyết:
- ✅ Import paths trong admin folder (đã fix từ `../../../src/` thành `../../src/`)
- ✅ Menu "Quản lý Team" không hiển thị (đã thêm AppHeader component)
- ✅ Feature flags ban đầu là false (đã enable tất cả)

### Chưa có issue nào

## Migration Guide

### Bước 1: Update Role Constraint
```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'sale', 'sale_admin', 'customer', 'warehouse'));
```

### Bước 2: Add manager_id (nếu chưa có)
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id);
```

### Bước 3: Add assigned_to to customers (nếu chưa có)
```sql
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id);
```

### Bước 4: Enable Feature Flags
```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  ENABLE_TEAM_TABS: true,
  ENABLE_TEAM_DASHBOARD: true,
  ENABLE_TEAM_MANAGEMENT: true,
  ENABLE_CUSTOMER_ASSIGNMENT: true,
}
```

### Bước 5: Test
1. Tạo sale_admin user
2. Tạo sale users với manager_id = sale_admin.id
3. Assign customers cho sale users
4. Login as sale_admin và test các tính năng

## Future Enhancements

- [ ] Team performance charts
- [ ] Export team reports
- [ ] Team notifications
- [ ] Team goals & targets
- [ ] Team leaderboard
- [ ] Bulk customer assignment
- [ ] Team calendar
- [ ] Team chat/messaging

## Support

Nếu gặp vấn đề với Phase 3 features:
1. Kiểm tra feature flags đã enable
2. Kiểm tra role constraint trong database
3. Kiểm tra manager_id hierarchy
4. Check console logs để debug
5. Verify assigned_to field trong customers table
