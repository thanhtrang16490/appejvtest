# Refactor Implementation Plan - Option 3 Hybrid

## Status: Ready to Execute

Đây là kế hoạch chi tiết để refactor app theo Option 3 (Hybrid structure).

---

## Phase 1: Setup Foundation (Completed ✅)

### 1.1 Permission System
- [x] Create `src/lib/permissions.ts`
- [x] Define all permission functions
- [x] Add helper functions for role checking
- [x] Add data scope helpers

---

## Phase 2: Create Admin Folder (Next Step)

### 2.1 Create Folder Structure
```bash
mkdir -p app/\(admin\)
mkdir -p app/\(admin\)/users
mkdir -p app/\(admin\)/settings
mkdir -p app/\(admin\)/categories
```

### 2.2 Move Admin-Only Pages
**From `app/(sales)` to `app/(admin)`**:
- `users/` folder → Move entire folder
- `settings.tsx` → Move to `(admin)/settings/index.tsx`
- `categories.tsx` → Move to `(admin)/categories/index.tsx`
- `analytics.tsx` → Move to `(admin)/analytics.tsx`

### 2.3 Create Admin Layout
Create `app/(admin)/_layout.tsx`:
```typescript
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function AdminLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen 
        name="users" 
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />
        }}
      />
      <Tabs.Screen 
        name="categories" 
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Ionicons name="pricetags" size={24} color={color} />
        }}
      />
      <Tabs.Screen 
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
```

### 2.4 Create Admin Dashboard
Create `app/(admin)/dashboard.tsx` - Admin-specific dashboard with system metrics

---

## Phase 3: Update Sales Folder

### 3.1 Keep Current Structure
**No folder changes needed**, just update logic:
- `app/(sales)/_layout.tsx` - Add dynamic navigation
- `app/(sales)/dashboard.tsx` - Add dual dashboard (personal + team)
- `app/(sales)/customers/index.tsx` - Add tabs (My/Team/All)
- `app/(sales)/orders/index.tsx` - Add tabs (My/Team)
- `app/(sales)/reports.tsx` - Add personal/team views

### 3.2 Create New Pages
```bash
mkdir -p app/\(sales\)/team
mkdir -p app/\(sales\)/approvals
mkdir -p app/\(sales\)/customers/assign
```

**New files to create**:
- `app/(sales)/team/index.tsx` - Team overview (sale_admin only)
- `app/(sales)/team/[id].tsx` - Team member detail
- `app/(sales)/approvals/index.tsx` - Order approvals (sale_admin only)
- `app/(sales)/customers/assign.tsx` - Customer assignment UI
- `app/(sales)/orders/create.tsx` - Order creation form
- `app/(sales)/reports/personal.tsx` - Personal reports
- `app/(sales)/reports/team.tsx` - Team reports (sale_admin only)

### 3.3 Update Sales Layout
Update `app/(sales)/_layout.tsx` to show/hide tabs based on role:
```typescript
const isSaleAdmin = profile?.role === 'sale_admin'

// Add team tab for sale_admin
if (isSaleAdmin) {
  // Show team tab
}
```

---

## Phase 4: Update Root Index

### 4.1 Update app/index.tsx
```typescript
import { useAuth } from '../src/contexts/AuthContext'
import { Redirect } from 'expo-router'

export default function Index() {
  const { user, profile } = useAuth()

  if (!user) {
    return <Redirect href="/(auth)/login" />
  }

  switch (profile?.role) {
    case 'admin':
      return <Redirect href="/(admin)/dashboard" />
    case 'sale_admin':
    case 'sale':
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

---

## Phase 5: Database Changes

### 5.1 Create Migration File
Create `appejv-api/migrations/08_sales_team_structure.sql`:

```sql
-- Sales teams table
CREATE TABLE sales_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  manager_id UUID REFERENCES profiles(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES sales_teams(id),
  sale_id UUID REFERENCES profiles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  UNIQUE(team_id, sale_id)
);

-- Update customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES profiles(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES sales_teams(id);

-- Update orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES sales_teams(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_sale ON team_members(sale_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_team ON customers(team_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_by ON orders(created_by);
CREATE INDEX IF NOT EXISTS idx_orders_team ON orders(team_id);

-- Customer assignments history
CREATE TABLE customer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  team_id UUID REFERENCES sales_teams(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- RLS Policies for customers
DROP POLICY IF EXISTS "Sales can view assigned customers" ON customers;
CREATE POLICY "Sales can view assigned customers"
ON customers FOR SELECT
USING (
  assigned_to = auth.uid()
  OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  OR (
    auth.uid() IN (SELECT manager_id FROM sales_teams)
    AND assigned_to IN (
      SELECT sale_id FROM team_members 
      WHERE team_id IN (
        SELECT id FROM sales_teams WHERE manager_id = auth.uid()
      )
    )
  )
);

-- RLS Policies for orders
DROP POLICY IF EXISTS "Sales can view their orders" ON orders;
CREATE POLICY "Sales can view their orders"
ON orders FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR created_by = auth.uid()
  OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  OR (
    auth.uid() IN (SELECT manager_id FROM sales_teams)
    AND customer_id IN (
      SELECT id FROM customers 
      WHERE assigned_to IN (
        SELECT sale_id FROM team_members 
        WHERE team_id IN (
          SELECT id FROM sales_teams WHERE manager_id = auth.uid()
        )
      )
    )
  )
);
```

---

## Phase 6: Component Updates

### 6.1 Create Sales Components
```bash
mkdir -p src/components/sales
```

**New components**:
- `src/components/sales/SaleAdminDashboard.tsx`
- `src/components/sales/SaleDashboard.tsx`
- `src/components/sales/PersonalPerformance.tsx`
- `src/components/sales/TeamPerformance.tsx`
- `src/components/sales/TeamOverview.tsx`
- `src/components/sales/CustomerAssignment.tsx`
- `src/components/sales/TeamMemberCard.tsx`

### 6.2 Create Admin Components
```bash
mkdir -p src/components/admin
```

**New components**:
- `src/components/admin/AdminDashboard.tsx`
- `src/components/admin/SystemMetrics.tsx`
- `src/components/admin/UserManagement.tsx`

---

## Execution Steps (In Order)

### Step 1: Backup Current Code ✅
```bash
git add -A
git commit -m "backup: before refactor to hybrid structure"
git push
```

### Step 2: Create Permission System ✅
- [x] Created `src/lib/permissions.ts`

### Step 3: Create Admin Folder
```bash
cd appejv-expo
mkdir -p app/\(admin\)/{users,settings,categories}
```

### Step 4: Move Admin Pages
```bash
# Move users folder
mv app/\(sales\)/users app/\(admin\)/

# Move settings
mv app/\(sales\)/settings.tsx app/\(admin\)/settings/index.tsx

# Move categories
mv app/\(sales\)/categories.tsx app/\(admin\)/categories/index.tsx

# Move analytics
mv app/\(sales\)/analytics.tsx app/\(admin\)/analytics.tsx
```

### Step 5: Create Admin Layout & Dashboard
- Create `app/(admin)/_layout.tsx`
- Create `app/(admin)/dashboard.tsx`

### Step 6: Update Sales Layout
- Update `app/(sales)/_layout.tsx` with dynamic navigation
- Add role-based tab visibility

### Step 7: Create Team Management Pages
- Create `app/(sales)/team/index.tsx`
- Create `app/(sales)/team/[id].tsx`

### Step 8: Update Customers Page
- Add tabs (My/Team/All) to `app/(sales)/customers/index.tsx`
- Create `app/(sales)/customers/assign.tsx`

### Step 9: Update Orders Page
- Add tabs (My/Team) to `app/(sales)/orders/index.tsx`
- Create `app/(sales)/orders/create.tsx`

### Step 10: Update Reports
- Create `app/(sales)/reports/personal.tsx`
- Create `app/(sales)/reports/team.tsx`

### Step 11: Update Root Index
- Update `app/index.tsx` with new routing logic

### Step 12: Run Migration
```bash
cd appejv-api
./run-migration.sh 08_sales_team_structure.sql
```

### Step 13: Test Each Role
- [ ] Test admin role
- [ ] Test sale_admin role
- [ ] Test sale role
- [ ] Test customer role

### Step 14: Commit Changes
```bash
git add -A
git commit -m "refactor: implement hybrid structure (Option 3)

- Create (admin) folder for system management
- Keep (sales) folder for sale_admin and sale roles
- Add permission system
- Add team management structure
- Update navigation and routing
- Add database migrations for team structure"
git push
```

---

## Rollback Plan

If something goes wrong:
```bash
git reset --hard HEAD~1
git push --force
```

Or restore from backup commit.

---

## Testing Checklist

### Admin Role
- [ ] Can access /(admin)/dashboard
- [ ] Can manage users
- [ ] Can manage categories
- [ ] Can manage settings
- [ ] Can view all data

### Sale Admin Role
- [ ] Can access /(sales)/dashboard
- [ ] Sees personal + team performance
- [ ] Can view own customers
- [ ] Can view team customers
- [ ] Can assign customers
- [ ] Can create orders for own + team customers
- [ ] Can view team reports
- [ ] Can manage team

### Sale Role
- [ ] Can access /(sales)/dashboard
- [ ] Sees only personal performance
- [ ] Can view only assigned customers
- [ ] Can create orders for assigned customers
- [ ] Can view personal reports
- [ ] Cannot see team tab
- [ ] Cannot assign customers

### Customer Role
- [ ] Can access /(customer)/dashboard
- [ ] Can view products
- [ ] Can place orders
- [ ] Can view own orders
- [ ] Cannot access sales/admin features

---

## Estimated Timeline

- **Phase 1**: Setup Foundation - ✅ Done
- **Phase 2**: Create Admin Folder - 2 hours
- **Phase 3**: Update Sales Folder - 4 hours
- **Phase 4**: Update Root Index - 30 minutes
- **Phase 5**: Database Changes - 1 hour
- **Phase 6**: Component Updates - 3 hours
- **Testing**: 2 hours

**Total**: ~13 hours (2 working days)

---

## Next Action

Bạn muốn tôi:
1. ✅ Tiếp tục implement (tạo admin folder và move files)
2. ⏸️ Dừng lại để review plan
3. 📝 Tạo thêm documentation

Chọn option nào?
