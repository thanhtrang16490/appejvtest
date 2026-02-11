# Kế Hoạch Tái Cấu Trúc App - Multi-Role Architecture

## Vấn Đề Hiện Tại

Hiện tại có 2 folders:
- `app/(sales)` - Cho admin, sale, sale_admin
- `app/(customer)` - Cho customer

**Vấn đề**:
- Khi thêm role "warehouse" (kho), không rõ nên đặt ở đâu
- Logic phân quyền phức tạp trong cùng 1 folder
- Khó maintain khi có nhiều roles
- Code reuse không tối ưu

---

## Đề Xuất Cấu Trúc Mới

### Option 1: Tách Folder Theo Role (Khuyến nghị)

```
app/
├── (auth)/              # Login, register, forgot password
│   ├── login.tsx
│   ├── customer-login.tsx
│   └── forgot-password.tsx
│
├── (admin)/             # Admin only
│   ├── _layout.tsx      # Admin navigation
│   ├── dashboard.tsx
│   ├── users/
│   ├── settings/
│   ├── categories/
│   └── analytics/
│
├── (sale-admin)/        # Sale Admin
│   ├── _layout.tsx      # Sale Admin navigation
│   ├── dashboard.tsx
│   ├── team/
│   ├── customers/
│   ├── orders/
│   ├── reports/
│   └── approvals/
│
├── (sale)/              # Sale
│   ├── _layout.tsx      # Sale navigation
│   ├── dashboard.tsx
│   ├── customers/       # Assigned customers only
│   ├── orders/          # Own orders only
│   ├── products/        # Read-only
│   └── reports/         # Personal reports
│
├── (warehouse)/         # Warehouse role (mới)
│   ├── _layout.tsx      # Warehouse navigation
│   ├── dashboard.tsx
│   ├── inventory/       # Stock management
│   ├── receiving/       # Nhập kho
│   ├── shipping/        # Xuất kho
│   ├── stocktake/       # Kiểm kê
│   └── reports/         # Warehouse reports
│
├── (customer)/          # Customer
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   ├── products.tsx
│   ├── orders/
│   ├── selling.tsx
│   └── account.tsx
│
└── index.tsx            # Root redirect based on role
```

**Ưu điểm**:
- ✅ Rõ ràng, dễ hiểu
- ✅ Dễ maintain và scale
- ✅ Mỗi role có navigation riêng
- ✅ Code isolation tốt
- ✅ Dễ test từng role

**Nhược điểm**:
- ❌ Duplicate code giữa các roles
- ❌ Nhiều folders hơn

---

### Option 2: Shared Folder + Role-Based Rendering

```
app/
├── (auth)/
│
├── (shared)/            # Shared pages cho nhiều roles
│   ├── customers/
│   ├── orders/
│   ├── products/
│   └── reports/
│
├── (admin)/             # Admin-specific pages
│   ├── users/
│   ├── settings/
│   └── analytics/
│
├── (warehouse)/         # Warehouse-specific pages
│   ├── receiving/
│   ├── shipping/
│   └── stocktake/
│
└── (customer)/          # Customer pages
```

**Ưu điểm**:
- ✅ Ít duplicate code
- ✅ Shared components dễ reuse

**Nhược điểm**:
- ❌ Logic phân quyền phức tạp trong component
- ❌ Khó maintain khi scale
- ❌ Khó test

---

### Option 3: Hybrid (Khuyến nghị nhất) - UPDATED

```
app/
├── (auth)/              # Authentication
│
├── (admin)/             # Admin only (system management)
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   ├── users/           # User management
│   ├── settings/        # System settings
│   ├── categories/      # Category management
│   └── analytics/       # System analytics
│
├── (sales)/             # Sales roles (sale_admin, sale)
│   ├── _layout.tsx      # Dynamic navigation based on role
│   ├── dashboard.tsx    # Dual dashboard (personal + team for sale_admin)
│   │
│   ├── customers/       # Customer management
│   │   ├── index.tsx    # List with tabs (My/Team/All)
│   │   ├── [id].tsx     # Customer detail
│   │   ├── add.tsx      # Add customer
│   │   └── assign.tsx   # Assign to team (sale_admin only)
│   │
│   ├── orders/          # Order management
│   │   ├── index.tsx    # List with tabs (My/Team)
│   │   ├── [id].tsx     # Order detail
│   │   └── create.tsx   # Create order
│   │
│   ├── inventory/       # Product catalog (read-only for sale)
│   │   ├── index.tsx
│   │   ├── [id].tsx
│   │   └── add.tsx      # Admin only
│   │
│   ├── reports/         # Reports
│   │   ├── index.tsx    # Main reports
│   │   ├── personal.tsx # Personal performance
│   │   └── team.tsx     # Team performance (sale_admin only)
│   │
│   ├── team/            # Team management (sale_admin only)
│   │   ├── index.tsx    # Team overview
│   │   └── [id].tsx     # Team member detail
│   │
│   ├── approvals/       # Order approvals (sale_admin only)
│   │   └── index.tsx
│   │
│   ├── menu.tsx         # Menu with role-based items
│   └── settings.tsx     # Personal settings
│
├── (warehouse)/         # Warehouse role
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   ├── inventory/       # Stock management
│   ├── receiving/       # Nhập kho
│   ├── shipping/        # Xuất kho
│   ├── stocktake/       # Kiểm kê
│   └── reports/         # Warehouse reports
│
├── (customer)/          # Customer
│   ├── _layout.tsx
│   ├── dashboard.tsx
│   ├── products.tsx
│   ├── orders/
│   ├── selling.tsx
│   └── account.tsx
│
└── index.tsx            # Role-based redirect
```

**Key Changes**:
- ✅ Admin folder chỉ cho system management
- ✅ Sales folder cho cả sale_admin và sale
- ✅ Sale Admin = Manager + Sale (dual role)
- ✅ Dynamic rendering based on role trong sales folder
- ✅ Team management features cho sale_admin

**Ưu điểm**:
- ✅ Balance giữa clarity và code reuse
- ✅ Sales roles share folder (workflow tương tự, chỉ khác quyền)
- ✅ Sale Admin có thể làm việc như Sale + quản lý team
- ✅ Warehouse tách riêng (workflow khác biệt)
- ✅ Dễ scale và maintain

---

## Warehouse Role - Features Cần Có

### Dashboard
- [ ] Tồn kho hiện tại
- [ ] Sản phẩm sắp hết
- [ ] Phiếu nhập/xuất pending
- [ ] Lịch sử giao dịch gần đây
- [ ] Alerts (hết hàng, quá hạn)

### Inventory Management
- [ ] Xem tồn kho real-time
- [ ] Cập nhật số lượng
- [ ] Batch/lot tracking
- [ ] Expiry date management
- [ ] Location tracking (vị trí trong kho)

### Receiving (Nhập kho)
- [ ] Tạo phiếu nhập kho
- [ ] Scan barcode/QR
- [ ] Verify quantities
- [ ] Quality check
- [ ] Update inventory

### Shipping (Xuất kho)
- [ ] Xem orders cần xuất
- [ ] Pick list generation
- [ ] Scan & verify items
- [ ] Pack & ship
- [ ] Update inventory

### Stocktake (Kiểm kê)
- [ ] Tạo phiếu kiểm kê
- [ ] Scan & count
- [ ] Compare với system
- [ ] Adjust discrepancies
- [ ] Generate reports

### Reports
- [ ] Inventory movement
- [ ] Stock levels
- [ ] Receiving/shipping history
- [ ] Discrepancy reports
- [ ] Aging inventory

---

## Migration Plan

### Phase 1: Preparation (1 tuần)
1. [ ] Backup current code
2. [ ] Create new folder structure
3. [ ] Setup routing tests
4. [ ] Document changes

### Phase 2: Move Admin (3 ngày)
1. [ ] Create `app/(admin)` folder
2. [ ] Move admin-only pages
3. [ ] Update navigation
4. [ ] Test admin flow

### Phase 3: Refactor Sales (1 tuần)
1. [ ] Keep `app/(sales)` folder
2. [ ] Add role-based rendering in _layout
3. [ ] Create role-specific components
4. [ ] Update navigation logic
5. [ ] Test all sales roles

### Phase 4: Create Warehouse (1 tuần)
1. [ ] Create `app/(warehouse)` folder
2. [ ] Build warehouse pages
3. [ ] Implement features
4. [ ] Test warehouse flow

### Phase 5: Update Root (2 ngày)
1. [ ] Update `app/index.tsx` with role routing
2. [ ] Test all role redirects
3. [ ] Update documentation

---

## Recommended Structure (Final)

```
appejv-expo/
├── app/
│   ├── (auth)/                    # Public routes
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── customer-login.tsx
│   │   └── forgot-password.tsx
│   │
│   ├── (admin)/                   # Admin role
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── users/
│   │   ├── settings/
│   │   ├── categories/
│   │   └── system/
│   │
│   ├── (sales)/                   # Sales roles (admin, sale_admin, sale)
│   │   ├── _layout.tsx            # Dynamic nav based on role
│   │   ├── dashboard.tsx          # Dynamic dashboard
│   │   ├── customers/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── assign.tsx         # Sale admin only
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── create.tsx
│   │   ├── inventory/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── add.tsx            # Admin only
│   │   ├── reports/
│   │   │   ├── index.tsx
│   │   │   ├── personal.tsx       # Sale only
│   │   │   └── team.tsx           # Sale admin only
│   │   ├── team/                  # Sale admin only
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── approvals/             # Sale admin only
│   │   │   └── index.tsx
│   │   ├── menu.tsx
│   │   └── settings.tsx
│   │
│   ├── (warehouse)/               # Warehouse role
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── inventory/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── adjust.tsx
│   │   ├── receiving/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── create.tsx
│   │   ├── shipping/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── pick.tsx
│   │   ├── stocktake/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── create.tsx
│   │   ├── reports/
│   │   │   └── index.tsx
│   │   └── menu.tsx
│   │
│   ├── (customer)/                # Customer role
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── products.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── selling.tsx
│   │   └── account.tsx
│   │
│   ├── _layout.tsx                # Root layout
│   └── index.tsx                  # Role-based redirect
│
├── src/
│   ├── components/
│   │   ├── admin/                 # Admin components
│   │   ├── sales/                 # Sales components
│   │   ├── warehouse/             # Warehouse components
│   │   ├── customer/              # Customer components
│   │   └── shared/                # Shared components
│   │
│   ├── lib/
│   │   ├── permissions.ts         # Permission helpers
│   │   ├── role-routing.ts        # Role-based routing
│   │   └── ...
│   │
│   └── types/
│       └── roles.ts               # Role types
```

---

## Role Routing Logic - UPDATED

### app/index.tsx
```typescript
import { useAuth } from '../src/contexts/AuthContext'
import { Redirect } from 'expo-router'

export default function Index() {
  const { user, profile } = useAuth()

  if (!user) {
    return <Redirect href="/(auth)/login" />
  }

  // Role-based redirect
  switch (profile?.role) {
    case 'admin':
      return <Redirect href="/(admin)/dashboard" />
    
    case 'sale_admin':
    case 'sale':
      // Both go to sales folder, but see different features
      return <Redirect href="/(sales)/dashboard" />
    
    case 'warehouse':
      return <Redirect href="/(warehouse)/dashboard" />
    
    case 'customer':
      return <Redirect href="/(customer)/dashboard" />
    
    default:
      return <Redirect href="/(auth)/login" />
  }
}
```

### Sales Layout - Dynamic Navigation

```typescript
// app/(sales)/_layout.tsx
import { useAuth } from '../../src/contexts/AuthContext'

export default function SalesLayout() {
  const { profile } = useAuth()
  const isSaleAdmin = profile?.role === 'sale_admin'
  const isSale = profile?.role === 'sale'

  // Bottom nav items based on role
  const navItems = [
    { name: 'dashboard', label: 'Dashboard', icon: 'home' },
    { name: 'customers', label: 'Customers', icon: 'people' },
    { name: 'orders', label: 'Orders', icon: 'receipt' },
    { name: 'inventory', label: 'Products', icon: 'cube' },
    { name: 'reports', label: 'Reports', icon: 'stats-chart' },
  ]

  // Add team tab for sale_admin only
  if (isSaleAdmin) {
    navItems.splice(4, 0, { 
      name: 'team', 
      label: 'Team', 
      icon: 'people-circle' 
    })
  }

  return (
    <Tabs>
      {navItems.map(item => (
        <Tabs.Screen key={item.name} name={item.name} {...item} />
      ))}
    </Tabs>
  )
}
```

---

## Permission Helper - UPDATED

### src/lib/permissions.ts
```typescript
export type Role = 'admin' | 'sale_admin' | 'sale' | 'warehouse' | 'customer'

export const permissions = {
  // Admin permissions (system management)
  canManageUsers: (role: Role) => role === 'admin',
  canManageSettings: (role: Role) => role === 'admin',
  canManageCategories: (role: Role) => role === 'admin',
  canDeleteProducts: (role: Role) => role === 'admin',
  canViewSystemAnalytics: (role: Role) => role === 'admin',
  
  // Sales permissions
  canViewOwnCustomers: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewTeamCustomers: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canViewAllCustomers: (role: Role) => role === 'admin',
  
  canAssignCustomers: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canReassignCustomers: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  canCreateOrders: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewOwnOrders: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewTeamOrders: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canApproveOrders: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  canViewPersonalReports: (role: Role) => ['admin', 'sale_admin', 'sale'].includes(role),
  canViewTeamReports: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  canManageTeam: (role: Role) => ['admin', 'sale_admin'].includes(role),
  canViewTeamPerformance: (role: Role) => ['admin', 'sale_admin'].includes(role),
  
  // Warehouse permissions
  canManageInventory: (role: Role) => ['admin', 'warehouse'].includes(role),
  canReceiveStock: (role: Role) => ['admin', 'warehouse'].includes(role),
  canShipOrders: (role: Role) => ['admin', 'warehouse'].includes(role),
  canStocktake: (role: Role) => ['admin', 'warehouse'].includes(role),
  
  // Customer permissions
  canPlaceOrders: (role: Role) => ['customer', 'sale', 'sale_admin', 'admin'].includes(role),
  canViewProducts: (role: Role) => true, // All roles can view products
}

export const hasPermission = (role: Role, permission: keyof typeof permissions) => {
  return permissions[permission](role)
}

// Helper to check if user is in sales team
export const isSalesRole = (role: Role) => ['sale_admin', 'sale'].includes(role)

// Helper to check if user can manage team
export const canManageTeam = (role: Role) => ['admin', 'sale_admin'].includes(role)

// Helper to check data scope
export const getDataScope = (role: Role) => {
  switch (role) {
    case 'admin':
      return 'all' // See everything
    case 'sale_admin':
      return 'team' // See own + team
    case 'sale':
      return 'own' // See only own
    case 'warehouse':
      return 'warehouse' // Warehouse data
    case 'customer':
      return 'customer' // Customer data
    default:
      return 'none'
  }
}
```

---

## Database Changes for Warehouse

```sql
-- Add warehouse role
ALTER TYPE user_role ADD VALUE 'warehouse';

-- Warehouse transactions table
CREATE TABLE warehouse_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL, -- 'receive', 'ship', 'adjust', 'stocktake'
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  from_location VARCHAR(100),
  to_location VARCHAR(100),
  reference_id UUID, -- Order ID or PO ID
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stock locations table
CREATE TABLE stock_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE,
  type VARCHAR(20), -- 'warehouse', 'shelf', 'bin'
  parent_id UUID REFERENCES stock_locations(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product locations table (track where products are)
CREATE TABLE product_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  location_id UUID REFERENCES stock_locations(id),
  quantity INTEGER NOT NULL,
  batch_number VARCHAR(50),
  expiry_date DATE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, location_id, batch_number)
);

-- Stocktake table
CREATE TABLE stocktakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  location_id UUID REFERENCES stock_locations(id),
  scheduled_date DATE,
  completed_date DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stocktake items
CREATE TABLE stocktake_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stocktake_id UUID REFERENCES stocktakes(id),
  product_id UUID REFERENCES products(id),
  expected_quantity INTEGER,
  counted_quantity INTEGER,
  variance INTEGER,
  notes TEXT,
  counted_by UUID REFERENCES profiles(id),
  counted_at TIMESTAMP
);
```

---

## Recommendation

**Dùng Option 3 (Hybrid)**:
- Tách `(admin)` riêng
- Giữ `(sales)` cho admin/sale_admin/sale với dynamic rendering
- Tạo `(warehouse)` riêng
- Giữ `(customer)` như hiện tại

**Lý do**:
1. Sales roles có workflow tương tự → share folder OK
2. Warehouse workflow khác biệt hoàn toàn → cần folder riêng
3. Admin có nhiều system features → nên tách riêng
4. Customer đơn giản → giữ nguyên

**Timeline**: 3-4 tuần để refactor hoàn chỉnh
