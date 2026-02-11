# Sales Team Hierarchy & Management

## Mô Hình Tổ Chức

### Hierarchy Structure
```
Admin (Toàn quyền)
    ↓
Sale Admin (Team Leader)
    ↓ manages
Sale (Team Members)
    ↓ manages
Customers
```

### Sale Admin Role
**Đặc điểm**:
- Vừa là **Manager** (quản lý team)
- Vừa là **Sale** (bán hàng trực tiếp)
- Được assign quản lý một số Sales
- Có customers riêng của mình
- Xem được data của team và của mình

**Quyền hạn**:
1. **Như một Sale**:
   - Có customers riêng được assign
   - Tạo orders cho customers của mình
   - Xem reports cá nhân
   - Bán hàng trực tiếp

2. **Như một Manager**:
   - Xem customers của team members
   - Xem orders của team
   - Assign/reassign customers cho team
   - Approve orders của team (nếu cần)
   - Xem team reports
   - Quản lý performance của team

---

## Database Schema

### 1. Team Management Table
```sql
-- Sales team structure
CREATE TABLE sales_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  manager_id UUID REFERENCES profiles(id), -- Sale Admin
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES sales_teams(id),
  sale_id UUID REFERENCES profiles(id), -- Sale
  joined_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
  UNIQUE(team_id, sale_id)
);

-- Index
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_sale ON team_members(sale_id);
```

### 2. Customer Assignment (Updated)
```sql
-- Update customers table
ALTER TABLE customers ADD COLUMN assigned_to UUID REFERENCES profiles(id);
ALTER TABLE customers ADD COLUMN assigned_at TIMESTAMP;
ALTER TABLE customers ADD COLUMN assigned_by UUID REFERENCES profiles(id);
ALTER TABLE customers ADD COLUMN team_id UUID REFERENCES sales_teams(id);

-- Index
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_customers_team ON customers(team_id);

-- Assignment history
CREATE TABLE customer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  team_id UUID REFERENCES sales_teams(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);
```

### 3. Orders (Updated)
```sql
-- Update orders table
ALTER TABLE orders ADD COLUMN created_by UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN team_id UUID REFERENCES sales_teams(id);

-- Index
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_orders_team ON orders(team_id);
```

---

## RLS Policies

### Customers - Multi-level Access

```sql
-- Sale: Chỉ xem customers được assign cho mình
CREATE POLICY "Sales can view their assigned customers"
ON customers FOR SELECT
USING (
  assigned_to = auth.uid()
  OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Sale Admin: Xem customers của mình + customers của team
CREATE POLICY "Sale admins can view team customers"
ON customers FOR SELECT
USING (
  -- Customers của chính mình
  assigned_to = auth.uid()
  OR
  -- Customers của team members
  (
    auth.uid() IN (
      SELECT manager_id FROM sales_teams
    )
    AND assigned_to IN (
      SELECT sale_id FROM team_members 
      WHERE team_id IN (
        SELECT id FROM sales_teams WHERE manager_id = auth.uid()
      )
    )
  )
  OR
  -- Admin xem tất cả
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Sale Admin: Assign customers cho team
CREATE POLICY "Sale admins can assign customers"
ON customers FOR UPDATE
USING (
  auth.uid() IN (
    SELECT manager_id FROM sales_teams
  )
  AND (
    assigned_to IS NULL 
    OR assigned_to IN (
      SELECT sale_id FROM team_members 
      WHERE team_id IN (
        SELECT id FROM sales_teams WHERE manager_id = auth.uid()
      )
    )
  )
);
```

### Orders - Multi-level Access

```sql
-- Sale: Xem orders của customers mình
CREATE POLICY "Sales can view their orders"
ON orders FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR created_by = auth.uid()
  OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Sale Admin: Xem orders của team
CREATE POLICY "Sale admins can view team orders"
ON orders FOR SELECT
USING (
  -- Orders của chính mình
  customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR created_by = auth.uid()
  OR
  -- Orders của team
  customer_id IN (
    SELECT id FROM customers 
    WHERE assigned_to IN (
      SELECT sale_id FROM team_members 
      WHERE team_id IN (
        SELECT id FROM sales_teams WHERE manager_id = auth.uid()
      )
    )
  )
  OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
```

---

## UI/UX Design

### Sale Admin Dashboard

```
┌─────────────────────────────────────────┐
│  Dashboard - Sale Admin                 │
├─────────────────────────────────────────┤
│                                         │
│  👤 My Performance (Cá nhân)           │
│  ┌─────────────────────────────────┐   │
│  │ Customers: 15  Orders: 45       │   │
│  │ Revenue: 150M  Target: 200M     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  👥 Team Performance                    │
│  ┌─────────────────────────────────┐   │
│  │ Team Members: 5                 │   │
│  │ Total Customers: 75             │   │
│  │ Total Orders: 230               │   │
│  │ Team Revenue: 750M              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📊 Top Performers                      │
│  ┌─────────────────────────────────┐   │
│  │ 1. Nguyễn Văn A - 200M          │   │
│  │ 2. Trần Thị B - 180M            │   │
│  │ 3. Lê Văn C - 150M              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ Pending Actions                     │
│  ┌─────────────────────────────────┐   │
│  │ • 3 orders need approval        │   │
│  │ • 5 customers unassigned        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Customers Page - Sale Admin View

```
┌─────────────────────────────────────────┐
│  Customers                              │
├─────────────────────────────────────────┤
│  [Search...] [Filter ▼] [+ Add]        │
│                                         │
│  Tabs:                                  │
│  [My Customers] [Team Customers] [All] │
│                                         │
│  My Customers (15):                     │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Customer A                   │   │
│  │    Orders: 10 | Revenue: 50M    │   │
│  │    [View] [Create Order]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Team Customers (60):                   │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Customer B                   │   │
│  │    Assigned to: Nguyễn Văn A    │   │
│  │    Orders: 5 | Revenue: 25M     │   │
│  │    [View] [Reassign]            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Team Management Page

```
┌─────────────────────────────────────────┐
│  My Team                                │
├─────────────────────────────────────────┤
│  Team: Sales Team North                 │
│  Manager: You                           │
│                                         │
│  Team Members (5):                      │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Nguyễn Văn A                 │   │
│  │    Customers: 15 | Orders: 50   │   │
│  │    Revenue: 200M | Target: 250M │   │
│  │    Performance: 80%             │   │
│  │    [View Details]               │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Trần Thị B                   │   │
│  │    Customers: 12 | Orders: 45   │   │
│  │    Revenue: 180M | Target: 200M │   │
│  │    Performance: 90%             │   │
│  │    [View Details]               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ Add Team Member]                    │
└─────────────────────────────────────────┘
```

---

## Features Implementation

### Phase 1: Team Structure (Week 1-2)

#### 1.1 Database Setup
- [ ] Create sales_teams table
- [ ] Create team_members table
- [ ] Update customers table with team_id
- [ ] Update orders table with team_id
- [ ] Create RLS policies

**Migration File**: `08_sales_team_structure.sql`

#### 1.2 Team Management UI
- [ ] Create team management page
- [ ] List team members
- [ ] Add/remove team members
- [ ] View team statistics

**Files**:
- `app/(sales)/team/index.tsx`
- `app/(sales)/team/[id].tsx`
- `src/components/sales/TeamOverview.tsx`

---

### Phase 2: Customer Assignment (Week 2-3)

#### 2.1 Assignment Logic
- [ ] Sale Admin assign customers to self or team
- [ ] Reassign customers between team members
- [ ] Track assignment history
- [ ] Bulk assignment

**Files**:
- `app/(sales)/customers/assign.tsx`
- `src/components/sales/CustomerAssignment.tsx`

#### 2.2 Customer Filtering
- [ ] Tab: My Customers (Sale Admin's own)
- [ ] Tab: Team Customers (Team members')
- [ ] Tab: All (Admin only)
- [ ] Filter by assigned sale

**Files**:
- Update `app/(sales)/customers/index.tsx`

---

### Phase 3: Dual Dashboard (Week 3-4)

#### 3.1 Sale Admin Dashboard
- [ ] Personal performance section
- [ ] Team performance section
- [ ] Top performers list
- [ ] Pending actions

**Files**:
- Update `app/(sales)/dashboard.tsx`
- `src/components/sales/SaleAdminDashboard.tsx`
- `src/components/sales/PersonalPerformance.tsx`
- `src/components/sales/TeamPerformance.tsx`

#### 3.2 Reports
- [ ] Personal reports (own customers)
- [ ] Team reports (team members)
- [ ] Comparison charts
- [ ] Export functionality

**Files**:
- `app/(sales)/reports/personal.tsx`
- `app/(sales)/reports/team.tsx`

---

### Phase 4: Order Management (Week 4-5)

#### 4.1 Order Creation
- [ ] Sale Admin creates orders for own customers
- [ ] Sale Admin creates orders for team customers
- [ ] Auto-assign team_id
- [ ] Track created_by

**Files**:
- `app/(sales)/orders/create.tsx`

#### 4.2 Order Filtering
- [ ] Tab: My Orders
- [ ] Tab: Team Orders
- [ ] Filter by team member
- [ ] Filter by status

**Files**:
- Update `app/(sales)/orders/index.tsx`

---

## API Endpoints

### Team Management
```typescript
// Get team info
GET /api/v1/teams/my-team
Response: {
  id, name, manager_id, members: [...], stats: {...}
}

// Get team members
GET /api/v1/teams/:id/members
Response: [
  { id, name, email, customers_count, orders_count, revenue }
]

// Add team member
POST /api/v1/teams/:id/members
Body: { sale_id }

// Remove team member
DELETE /api/v1/teams/:id/members/:sale_id
```

### Customer Assignment
```typescript
// Assign customer
POST /api/v1/customers/:id/assign
Body: { assigned_to, notes }

// Reassign customer
PUT /api/v1/customers/:id/reassign
Body: { assigned_to, notes }

// Get assignment history
GET /api/v1/customers/:id/assignments
Response: [
  { assigned_to, assigned_by, assigned_at, notes }
]
```

### Reports
```typescript
// Personal reports
GET /api/v1/reports/personal
Query: { period, start_date, end_date }

// Team reports
GET /api/v1/reports/team
Query: { period, start_date, end_date }

// Team member performance
GET /api/v1/reports/team/:sale_id
Query: { period, start_date, end_date }
```

---

## Permission Matrix

| Feature | Admin | Sale Admin (Own) | Sale Admin (Team) | Sale |
|---------|-------|------------------|-------------------|------|
| View own customers | ✅ | ✅ | ✅ | ✅ |
| View team customers | ✅ | ✅ | ✅ | ❌ |
| Assign customers | ✅ | ✅ (to team) | ✅ (to team) | ❌ |
| Create orders (own) | ✅ | ✅ | ✅ | ✅ |
| Create orders (team) | ✅ | ✅ | ✅ | ❌ |
| View own reports | ✅ | ✅ | ✅ | ✅ |
| View team reports | ✅ | ✅ | ✅ | ❌ |
| Manage team | ✅ | ✅ | ✅ | ❌ |
| Approve orders | ✅ | ✅ | ✅ | ❌ |

---

## Example Scenarios

### Scenario 1: Sale Admin tạo order
```
1. Sale Admin login
2. Vào Customers
3. Chọn tab "My Customers" hoặc "Team Customers"
4. Click vào customer
5. Click "Create Order"
6. Order được tạo với:
   - customer_id
   - created_by = Sale Admin ID
   - team_id = Sale Admin's team
```

### Scenario 2: Sale Admin assign customer
```
1. Sale Admin login
2. Vào Customers
3. Click "Assign" trên customer chưa assign
4. Chọn team member hoặc assign cho chính mình
5. Customer được update:
   - assigned_to = Selected sale ID
   - assigned_by = Sale Admin ID
   - team_id = Team ID
   - assigned_at = NOW()
```

### Scenario 3: Sale Admin xem reports
```
1. Sale Admin login
2. Vào Reports
3. Tabs available:
   - "My Performance" (own customers)
   - "Team Performance" (team overview)
   - "Team Members" (individual comparison)
4. Select period and view
```

---

## Testing Checklist

### Sale Admin Tests
- [ ] Can view own customers
- [ ] Can view team customers
- [ ] Can assign customers to self
- [ ] Can assign customers to team members
- [ ] Can create orders for own customers
- [ ] Can create orders for team customers
- [ ] Can view personal reports
- [ ] Can view team reports
- [ ] Can see team performance
- [ ] Cannot view customers outside team
- [ ] Cannot assign customers outside team

### Sale Tests
- [ ] Can only view assigned customers
- [ ] Can create orders for assigned customers
- [ ] Can view personal reports
- [ ] Cannot view team customers
- [ ] Cannot assign customers
- [ ] Cannot view team reports

---

## Migration Timeline

**Week 1**: Database schema + RLS policies
**Week 2**: Team management UI
**Week 3**: Customer assignment + filtering
**Week 4**: Dashboard updates
**Week 5**: Reports + testing

**Total**: 5 weeks for complete implementation
