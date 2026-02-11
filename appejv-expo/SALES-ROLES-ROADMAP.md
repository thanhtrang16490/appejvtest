# Kế Hoạch Phát Triển - Sales Roles (Sale & Sale Admin)

## Tổng Quan

Hiện tại app đã có:
- ✅ Customer role (hoàn thiện)
- ✅ Admin role (hoàn thiện)
- ⚠️ Sale & Sale Admin roles (cần hoàn thiện)

## Phân Quyền Hiện Tại

### Admin
- Full access tất cả tính năng
- Quản lý users, customers, products, orders
- Xem reports, analytics
- Quản lý categories, settings

### Sale Admin
- Quản lý team sale dưới quyền
- Xem reports của team
- Approve/reject orders
- Quản lý customers của team
- Không thể xóa users

### Sale
- Xem customers được assign
- Tạo orders cho customers
- Xem products, inventory
- Xem reports cá nhân
- Không thể quản lý users

### Customer
- Xem products
- Tạo orders
- Xem orders của mình
- Quản lý profile

---

## Phase 1: Sales Dashboard & Navigation (Ưu tiên cao)

### 1.1 Sales Dashboard Customization
**Mục tiêu**: Dashboard riêng cho Sale và Sale Admin

**Sale Dashboard**:
- [ ] Hiển thị customers được assign
- [ ] Pending orders cần xử lý
- [ ] Sales performance cá nhân (hôm nay, tuần này, tháng này)
- [ ] Quick actions: Tạo order, Thêm customer
- [ ] Recent activities

**Sale Admin Dashboard**:
- [ ] Team overview (số lượng sale, customers, orders)
- [ ] Team performance comparison
- [ ] Pending approvals
- [ ] Top performers
- [ ] Team activities

**Files cần sửa**:
- `app/(sales)/dashboard.tsx` - Thêm logic phân quyền
- Tạo `src/components/sales/SaleDashboard.tsx`
- Tạo `src/components/sales/SaleAdminDashboard.tsx`

---

### 1.2 Navigation & Menu Restrictions
**Mục tiêu**: Ẩn/hiện menu items theo role

**Sale - Chỉ hiển thị**:
- [ ] Dashboard
- [ ] Customers (của mình)
- [ ] Orders (của mình)
- [ ] Products (read-only)
- [ ] Reports (cá nhân)
- [ ] Account

**Sale Admin - Thêm**:
- [ ] Team Management
- [ ] All Customers (của team)
- [ ] All Orders (của team)
- [ ] Team Reports
- [ ] Approvals

**Files cần sửa**:
- `app/(sales)/_layout.tsx` - Filter bottom nav items
- `app/(sales)/menu.tsx` - Filter menu items
- Tạo `src/lib/permissions.ts` - Permission helper

---

## Phase 2: Customer Management (Ưu tiên cao)

### 2.1 Customer Assignment
**Mục tiêu**: Assign customers cho sales

**Features**:
- [ ] Sale Admin assign customers cho sales
- [ ] Sale chỉ xem customers được assign
- [ ] Reassign customers
- [ ] Customer history tracking

**Database Changes**:
```sql
-- Add assigned_to field to customers table
ALTER TABLE customers ADD COLUMN assigned_to UUID REFERENCES profiles(id);
ALTER TABLE customers ADD COLUMN assigned_at TIMESTAMP;
ALTER TABLE customers ADD COLUMN assigned_by UUID REFERENCES profiles(id);

-- Add index
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
```

**Files cần tạo**:
- `app/(sales)/customers/assign.tsx` - Assign UI
- `src/components/sales/CustomerAssignment.tsx`
- Migration: `08_add_customer_assignment.sql`

---

### 2.2 Customer Filtering
**Mục tiêu**: Filter customers theo assignment

**Features**:
- [ ] Sale: Chỉ xem customers của mình
- [ ] Sale Admin: Xem all customers của team
- [ ] Admin: Xem all customers
- [ ] Filter by sale person
- [ ] Filter by assignment status

**Files cần sửa**:
- `app/(sales)/customers/index.tsx` - Add filters
- `src/lib/queries/customers.ts` - Add RLS policies

---

## Phase 3: Order Management (Ưu tiên cao)

### 3.1 Order Creation & Assignment
**Mục tiêu**: Sales tạo orders cho customers

**Features**:
- [ ] Sale tạo order cho customers được assign
- [ ] Auto-assign order creator
- [ ] Order approval workflow (nếu cần)
- [ ] Order status tracking

**Database Changes**:
```sql
-- Add created_by field to orders table
ALTER TABLE orders ADD COLUMN created_by UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN approved_by UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN approved_at TIMESTAMP;

-- Add index
CREATE INDEX idx_orders_created_by ON orders(created_by);
```

**Files cần tạo**:
- `app/(sales)/orders/create.tsx` - Create order UI
- Migration: `09_add_order_assignment.sql`

---

### 3.2 Order Filtering & Permissions
**Mục tiêu**: Filter orders theo role

**Features**:
- [ ] Sale: Chỉ xem orders của customers mình
- [ ] Sale Admin: Xem orders của team
- [ ] Admin: Xem all orders
- [ ] Filter by sale person
- [ ] Filter by status, date range

**Files cần sửa**:
- `app/(sales)/orders/index.tsx` - Add filters
- `src/lib/queries/orders.ts` - Add RLS policies

---

## Phase 4: Reports & Analytics (Ưu tiên trung bình)

### 4.1 Personal Reports (Sale)
**Mục tiêu**: Reports cá nhân cho sale

**Features**:
- [ ] Sales performance (revenue, orders, customers)
- [ ] Top products sold
- [ ] Customer acquisition
- [ ] Monthly/weekly trends
- [ ] Commission calculation (nếu có)

**Files cần tạo**:
- `app/(sales)/reports/personal.tsx`
- `src/components/sales/PersonalReports.tsx`

---

### 4.2 Team Reports (Sale Admin)
**Mục tiêu**: Reports cho team

**Features**:
- [ ] Team performance overview
- [ ] Individual sales comparison
- [ ] Team targets vs actual
- [ ] Top performers
- [ ] Customer distribution

**Files cần tạo**:
- `app/(sales)/reports/team.tsx`
- `src/components/sales/TeamReports.tsx`

---

### 4.3 Report Filtering
**Mục tiêu**: Filter reports theo role

**Files cần sửa**:
- `app/(sales)/reports.tsx` - Add role-based filtering
- `src/lib/api/reports.ts` - Add permission checks

---

## Phase 5: Team Management (Sale Admin) (Ưu tiên trung bình)

### 5.1 Team Overview
**Mục tiêu**: Quản lý team sales

**Features**:
- [ ] View all sales in team
- [ ] Sales performance metrics
- [ ] Customer assignments per sale
- [ ] Order statistics per sale
- [ ] Activity tracking

**Files cần tạo**:
- `app/(sales)/team/index.tsx`
- `app/(sales)/team/[id].tsx` - Sale detail
- `src/components/sales/TeamOverview.tsx`

---

### 5.2 Performance Tracking
**Mục tiêu**: Track performance của team

**Features**:
- [ ] Daily/weekly/monthly targets
- [ ] Achievement tracking
- [ ] Leaderboard
- [ ] Performance alerts
- [ ] Incentive calculation

**Files cần tạo**:
- `app/(sales)/team/performance.tsx`
- `src/components/sales/PerformanceTracker.tsx`

---

## Phase 6: Approval Workflow (Sale Admin) (Ưu tiên thấp)

### 6.1 Order Approvals
**Mục tiêu**: Sale Admin approve orders

**Features**:
- [ ] Pending approvals list
- [ ] Approve/reject orders
- [ ] Approval history
- [ ] Approval notifications
- [ ] Approval rules (amount threshold)

**Database Changes**:
```sql
-- Add approval fields
ALTER TABLE orders ADD COLUMN requires_approval BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN approval_status VARCHAR(20);
ALTER TABLE orders ADD COLUMN approval_notes TEXT;
```

**Files cần tạo**:
- `app/(sales)/approvals/index.tsx`
- `src/components/sales/ApprovalQueue.tsx`
- Migration: `10_add_order_approvals.sql`

---

## Phase 7: Notifications & Alerts (Ưu tiên thấp)

### 7.1 Sales Notifications
**Mục tiêu**: Thông báo cho sales

**Features**:
- [ ] New customer assigned
- [ ] Order status changed
- [ ] Customer placed order
- [ ] Target achievement
- [ ] Approval required (Sale Admin)

**Files cần sửa**:
- `src/components/NotificationButton.tsx` - Add sales notifications
- Database: Add notification types

---

## Phase 8: Mobile Optimization (Ưu tiên thấp)

### 8.1 Sales Mobile Features
**Mục tiêu**: Optimize cho sales on-the-go

**Features**:
- [ ] Quick order creation
- [ ] Customer quick view
- [ ] Offline mode (basic)
- [ ] Location tracking (optional)
- [ ] Voice notes for orders

---

## Implementation Priority

### Sprint 1 (2 weeks) - Critical Features
1. ✅ Sales Dashboard customization
2. ✅ Navigation restrictions
3. ✅ Customer assignment
4. ✅ Customer filtering

### Sprint 2 (2 weeks) - Core Features
1. ✅ Order creation for sales
2. ✅ Order filtering
3. ✅ Personal reports (Sale)
4. ✅ Team reports (Sale Admin)

### Sprint 3 (2 weeks) - Team Management
1. ✅ Team overview
2. ✅ Performance tracking
3. ✅ Sales comparison

### Sprint 4 (1 week) - Polish & Testing
1. ✅ Approval workflow
2. ✅ Notifications
3. ✅ Bug fixes
4. ✅ Testing

---

## Database Schema Changes Summary

### New Tables
```sql
-- Customer assignments history
CREATE TABLE customer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Sales targets
CREATE TABLE sales_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES profiles(id),
  period VARCHAR(20), -- 'daily', 'weekly', 'monthly'
  target_amount DECIMAL(10,2),
  target_orders INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order approvals
CREATE TABLE order_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  approved_by UUID REFERENCES profiles(id),
  status VARCHAR(20), -- 'pending', 'approved', 'rejected'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Modified Tables
```sql
-- customers table
ALTER TABLE customers ADD COLUMN assigned_to UUID REFERENCES profiles(id);
ALTER TABLE customers ADD COLUMN assigned_at TIMESTAMP;
ALTER TABLE customers ADD COLUMN assigned_by UUID REFERENCES profiles(id);

-- orders table
ALTER TABLE orders ADD COLUMN created_by UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN approved_by UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN approved_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN requires_approval BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN approval_status VARCHAR(20);
```

---

## RLS Policies Summary

### Customers
```sql
-- Sale: Chỉ xem customers được assign
CREATE POLICY "Sales can view assigned customers"
ON customers FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles 
    WHERE role IN ('admin', 'sale_admin')
  )
  OR assigned_to = auth.uid()
);

-- Sale Admin: Xem customers của team
CREATE POLICY "Sale admins can view team customers"
ON customers FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'sale_admin'
  )
  AND assigned_to IN (
    SELECT id FROM profiles WHERE role = 'sale'
  )
);
```

### Orders
```sql
-- Sale: Chỉ xem orders của customers mình
CREATE POLICY "Sales can view their orders"
ON orders FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR created_by = auth.uid()
);
```

---

## Testing Checklist

### Sale Role
- [ ] Chỉ xem customers được assign
- [ ] Tạo orders cho customers của mình
- [ ] Xem reports cá nhân
- [ ] Không thể xem customers khác
- [ ] Không thể xem orders khác
- [ ] Không thể access user management

### Sale Admin Role
- [ ] Xem all customers của team
- [ ] Assign customers cho sales
- [ ] Xem all orders của team
- [ ] Xem team reports
- [ ] Approve/reject orders
- [ ] Không thể xóa users

---

## Documentation Needed

1. [ ] Sales User Guide
2. [ ] Sale Admin User Guide
3. [ ] API Documentation for sales endpoints
4. [ ] Permission Matrix
5. [ ] Workflow Diagrams

---

## Success Metrics

### For Sales
- Time to create order < 2 minutes
- Customer lookup < 5 seconds
- Daily report generation < 3 seconds

### For Sale Admin
- Team overview load < 2 seconds
- Customer assignment < 30 seconds
- Approval process < 1 minute

---

## Notes

- Tất cả changes phải backward compatible
- Cần test kỹ RLS policies
- Mobile-first design
- Performance optimization cho queries lớn
- Cần có audit logs cho sensitive actions
