# Permission System Documentation

## 🎯 Overview

Hệ thống phân quyền 4 cấp với hierarchy rõ ràng:

```
Admin (Quản lý toàn bộ hệ thống)
  └── Sale_admin (Quản lý team sales)
        └── Sale (Quản lý customers)
              └── Customer (End user)
```

## 📊 Database Schema

### profiles Table

```sql
profiles:
  id              uuid (PK, FK to auth.users)
  email           text (unique)
  full_name       text
  role            text (admin | sale_admin | sale | customer)
  phone           text
  avatar_url      text
  deleted_at      timestamptz
  created_at      timestamptz
  
  -- Hierarchy fields
  manager_id      uuid (FK to profiles) -- For sales: points to sale_admin
  assigned_sale_id uuid (FK to profiles) -- For customers: points to sale
  
  -- Customer fields
  customer_code   text (unique)
  address         text
```

### Relationships

```sql
-- Sale → Sale_admin
sale.manager_id → sale_admin.id

-- Customer → Sale
customer.assigned_sale_id → sale.id

-- Order → Customer
order.customer_id → customer.id (profiles where role='customer')

-- Order → Sale
order.sale_id → sale.id (profiles where role='sale')
```

## 🔐 Permission Matrix

| Role | View Own Profile | View Team | View All | Manage Team | Manage All |
|------|-----------------|-----------|----------|-------------|------------|
| **Customer** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Sale** | ✅ | ✅ Customers | ❌ | ✅ Customers | ❌ |
| **Sale_admin** | ✅ | ✅ Sales + Customers | ❌ | ✅ Team | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

## 📋 Detailed Permissions

### 1. Customer Permissions

**Can:**
- ✅ View own profile
- ✅ Update own profile
- ✅ View own orders
- ✅ Create orders for themselves
- ✅ Update own draft/ordered orders
- ✅ View all products (public)

**Cannot:**
- ❌ View other customers
- ❌ View sales/admins
- ❌ Manage any other data

**RLS Policies:**
```sql
-- View own profile
USING (id = auth.uid())

-- View own orders
USING (customer_id = auth.uid() AND role = 'customer')
```

---

### 2. Sale Permissions

**Can:**
- ✅ View own profile
- ✅ Update own profile
- ✅ View assigned customers (where assigned_sale_id = sale.id)
- ✅ Update assigned customers
- ✅ View orders of assigned customers
- ✅ Create orders for assigned customers
- ✅ Update orders of assigned customers
- ✅ View all products

**Cannot:**
- ❌ View other sales
- ❌ View customers not assigned to them
- ❌ View/manage sale_admins or admins
- ❌ Reassign customers to other sales

**RLS Policies:**
```sql
-- View assigned customers
USING (
  role = 'customer' 
  AND assigned_sale_id = auth.uid()
  AND get_user_role() = 'sale'
)

-- View customer orders
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = orders.customer_id
    AND profiles.assigned_sale_id = auth.uid()
  )
)
```

---

### 3. Sale_admin Permissions

**Can:**
- ✅ View own profile
- ✅ Update own profile
- ✅ View managed sales (where manager_id = sale_admin.id)
- ✅ Update managed sales
- ✅ View team customers (customers of managed sales)
- ✅ Update team customers (reassign, edit)
- ✅ View team orders (orders from team sales/customers)
- ✅ Update team orders
- ✅ Create orders for team
- ✅ View all products
- ✅ View reports for their team

**Cannot:**
- ❌ View other sale_admins
- ❌ View sales not in their team
- ❌ View customers outside their team
- ❌ Manage admins

**RLS Policies:**
```sql
-- View managed sales
USING (
  role = 'sale'
  AND manager_id = auth.uid()
  AND get_user_role() = 'sale_admin'
)

-- View team customers
USING (
  role = 'customer'
  AND EXISTS (
    SELECT 1 FROM profiles sales
    WHERE sales.id = assigned_sale_id
    AND sales.manager_id = auth.uid()
  )
  AND get_user_role() = 'sale_admin'
)

-- View team orders
USING (
  get_user_role() = 'sale_admin'
  AND (
    -- Orders by team sales
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = orders.sale_id
      AND profiles.manager_id = auth.uid()
    )
    -- OR orders from team customers
    OR EXISTS (
      SELECT 1 FROM profiles customers
      JOIN profiles sales ON sales.id = customers.assigned_sale_id
      WHERE customers.id = orders.customer_id
      AND sales.manager_id = auth.uid()
    )
  )
)
```

---

### 4. Admin Permissions

**Can:**
- ✅ View all profiles (all roles)
- ✅ Update all profiles
- ✅ Create new users (all roles)
- ✅ Delete users (soft delete)
- ✅ View all orders
- ✅ Update all orders
- ✅ Manage all products
- ✅ View all reports
- ✅ Manage system settings
- ✅ View audit logs

**Cannot:**
- Nothing - full access

**RLS Policies:**
```sql
-- View all
USING (is_admin_or_sale_admin())

-- Manage all
USING (is_admin_or_sale_admin())
WITH CHECK (is_admin_or_sale_admin())
```

---

## 🔄 Common Workflows

### Workflow 1: Assign Customer to Sale

```sql
-- Sale_admin or Admin assigns customer to sale
UPDATE profiles
SET assigned_sale_id = '<sale_id>'
WHERE id = '<customer_id>'
  AND role = 'customer';
```

**Permissions:**
- ✅ Sale_admin: If customer is in their team
- ✅ Admin: Always

---

### Workflow 2: Assign Sale to Sale_admin

```sql
-- Admin assigns sale to sale_admin
UPDATE profiles
SET manager_id = '<sale_admin_id>'
WHERE id = '<sale_id>'
  AND role = 'sale';
```

**Permissions:**
- ✅ Admin: Always
- ❌ Sale_admin: Cannot assign sales to themselves

---

### Workflow 3: Create Order

```sql
-- Create order for customer
INSERT INTO orders (customer_id, sale_id, ...)
VALUES ('<customer_id>', '<sale_id>', ...);
```

**Permissions:**
- ✅ Customer: For themselves
- ✅ Sale: For their assigned customers
- ✅ Sale_admin: For team customers
- ✅ Admin: For anyone

---

### Workflow 4: View Team Performance

```sql
-- Sale_admin views team orders
SELECT 
  o.*,
  c.full_name as customer_name,
  s.full_name as sale_name
FROM orders o
JOIN profiles c ON c.id = o.customer_id
JOIN profiles s ON s.id = o.sale_id
WHERE s.manager_id = auth.uid();
```

**Permissions:**
- ✅ Sale_admin: See their team
- ✅ Admin: See all

---

## 🧪 Testing Permissions

### Test as Customer

```sql
-- Should see only own profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Should see only own orders
SELECT * FROM orders WHERE customer_id = auth.uid();

-- Should NOT see other customers
SELECT * FROM profiles WHERE role = 'customer'; -- Returns only self
```

### Test as Sale

```sql
-- Should see assigned customers
SELECT * FROM profiles 
WHERE role = 'customer' 
  AND assigned_sale_id = auth.uid();

-- Should see customer orders
SELECT o.* FROM orders o
JOIN profiles p ON p.id = o.customer_id
WHERE p.assigned_sale_id = auth.uid();

-- Should NOT see other sales' customers
SELECT * FROM profiles 
WHERE role = 'customer' 
  AND assigned_sale_id != auth.uid(); -- Returns empty
```

### Test as Sale_admin

```sql
-- Should see managed sales
SELECT * FROM profiles 
WHERE role = 'sale' 
  AND manager_id = auth.uid();

-- Should see team customers
SELECT c.* FROM profiles c
JOIN profiles s ON s.id = c.assigned_sale_id
WHERE c.role = 'customer'
  AND s.manager_id = auth.uid();

-- Should see team orders
SELECT o.* FROM orders o
JOIN profiles s ON s.id = o.sale_id
WHERE s.manager_id = auth.uid();
```

### Test as Admin

```sql
-- Should see everything
SELECT * FROM profiles; -- All profiles
SELECT * FROM orders; -- All orders
```

---

## 🚨 Security Considerations

### 1. Prevent Privilege Escalation

```sql
-- Users cannot change their own role
CREATE POLICY "users_cannot_change_own_role"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );
```

### 2. Prevent Circular Hierarchy

```sql
-- Sale_admin cannot set themselves as their own manager
-- Admin cannot set themselves as sale_admin's manager
-- Enforce in application logic
```

### 3. Audit Trail

```sql
-- Log all permission changes
-- Track who assigned customers to sales
-- Track who changed user roles
```

---

## 📝 Migration Files

1. **00_simple_customer_migration.sql** - Base schema + RLS
2. **05_add_sale_admin_hierarchy_policies.sql** - Sale_admin policies

---

## 🔧 Troubleshooting

### Issue: Sale_admin cannot see team customers

**Check:**
```sql
-- Verify sales have correct manager_id
SELECT id, full_name, manager_id 
FROM profiles 
WHERE role = 'sale';

-- Verify customers have correct assigned_sale_id
SELECT id, full_name, assigned_sale_id 
FROM profiles 
WHERE role = 'customer';
```

### Issue: Policies not working

**Check:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'orders');

-- Verify policies exist
SELECT * FROM pg_policies 
WHERE tablename IN ('profiles', 'orders');
```

---

## 📚 References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- Migration files in `appejv-api/migrations/`

---

**Last Updated:** 2026-02-09
**Version:** 1.0
