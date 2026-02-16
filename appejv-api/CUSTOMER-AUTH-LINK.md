# Customer Authentication Link

## Overview

Migration 11 adds support for customers to have optional login accounts by linking the `customers` table with `auth.users`.

## Changes Made

### 1. Database Schema

- Added `user_id` column to `customers` table (nullable)
- Created unique index on `user_id` (one user = one customer)
- Migrated existing customers with matching emails to link with auth accounts

### 2. Helper Functions

Created three helper functions to simplify RLS policies:

```sql
is_admin()      -- Check if current user is admin
is_sale()       -- Check if current user is sale
is_sale_admin() -- Check if current user is sale_admin
```

### 3. RLS Policies Updated

Added new policies for customer self-access:

- `customers_self_view` - Customers can view their own data
- `customers_self_update` - Customers can update their own data

Simplified existing policies using helper functions.

### 4. Email Sync Trigger

Created trigger `trigger_sync_customer_email` that logs when customer email changes (for customers with login accounts).

## Customer Types

### Type 1: Customer WITHOUT Login (user_id = NULL)
- Created by sales staff
- Email is for contact only
- Cannot login to system
- Can only be viewed/edited by assigned sale or admin

### Type 2: Customer WITH Login (user_id = UUID)
- Has account in auth.users
- Can login to customer portal
- Can view and update their own information
- Email is used for both contact and login

## Email Management

### Current Behavior

When admin/sale updates customer email:
1. Email in `customers` table is updated
2. If customer has `user_id`, a warning is shown
3. Email in `auth.users` is NOT automatically updated (requires admin API)

### Why Not Auto-Update auth.users?

Updating `auth.users.email` requires:
- Supabase Admin API access
- Service role key (security risk in client app)
- Email verification flow

### Recommended Approach

**Option 1: Manual Process (Current)**
- Admin updates email in customers table
- Customer contacts admin to update login email separately
- Admin uses Supabase Dashboard to update auth.users.email

**Option 2: API Endpoint (Future)**
- Create backend API endpoint with service role
- Endpoint updates both customers.email and auth.users.email
- Triggers email verification flow

**Option 3: Customer Self-Service (Best)**
- Customer logs in and updates their own email
- System updates both tables
- Automatic email verification

## Code Changes

### Mobile App

Updated customer detail pages to check for `user_id`:

```typescript
// If customer has user_id (can login)
if (customer.user_id && editedData.email !== customer.email) {
  Alert.alert(
    'Lưu ý',
    'Email đã được cập nhật trong hệ thống. Nếu khách hàng có tài khoản đăng nhập, họ cần liên hệ admin để cập nhật email đăng nhập.'
  )
}
```

Files updated:
- `appejv-expo/app/(sales)/customers/[id].tsx`
- `appejv-expo/app/(sales-pages)/customers/[id].tsx`

## Migration Steps

1. Run migration:
```bash
cd appejv-api
./run-migration.sh 11_add_user_id_to_customers.sql
```

2. Verify:
```sql
-- Check customers with auth accounts
SELECT 
  c.id,
  c.full_name,
  c.email,
  c.user_id,
  au.email as auth_email
FROM customers c
LEFT JOIN auth.users au ON c.user_id = au.id;
```

## Customer Login Flow

### For Existing Customers (Migrated)

If customer was created before migration and has matching email:
1. `user_id` is automatically linked
2. Customer can login with existing credentials
3. Customer sees their own data in customer portal

### For New Customers

**Without Login:**
```typescript
// Sales creates customer (no auth)
const { data } = await supabase
  .from('customers')
  .insert({
    full_name: 'Customer Name',
    email: 'customer@example.com',
    phone: '0123456789',
    assigned_to: saleId
  })
```

**With Login:**
```typescript
// 1. Create auth account
const { data: authData } = await supabase.auth.signUp({
  email: 'customer@example.com',
  password: 'secure_password'
})

// 2. Create customer record with user_id
const { data } = await supabase
  .from('customers')
  .insert({
    user_id: authData.user.id,
    full_name: 'Customer Name',
    email: 'customer@example.com',
    phone: '0123456789',
    assigned_to: saleId
  })
```

## Security Considerations

1. **RLS Policies**: Customers can only view/update their own data
2. **Email Verification**: Should be enabled for customer accounts
3. **Password Reset**: Customers can reset their own passwords
4. **Data Isolation**: Customers cannot see other customers' data

## Future Enhancements

1. **Customer Portal**: Dedicated UI for customers to:
   - View their orders
   - Update their profile
   - Change password
   - View invoices

2. **Email Sync API**: Backend endpoint to sync email changes between tables

3. **Customer Registration**: Self-service registration flow

4. **Email Notifications**: Notify customers when their data changes

## Rollback

If needed, rollback with:

```sql
BEGIN;

-- Remove policies
DROP POLICY IF EXISTS "customers_self_view" ON customers;
DROP POLICY IF EXISTS "customers_self_update" ON customers;

-- Remove trigger
DROP TRIGGER IF EXISTS trigger_sync_customer_email ON customers;
DROP FUNCTION IF EXISTS sync_customer_email();

-- Remove helper functions
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_sale();
DROP FUNCTION IF EXISTS is_sale_admin();

-- Remove column
ALTER TABLE customers DROP COLUMN user_id;

COMMIT;
```

## Testing Checklist

- [ ] Customers with user_id can login
- [ ] Customers can view their own data
- [ ] Customers can update their own profile
- [ ] Customers cannot see other customers
- [ ] Sales can still view assigned customers
- [ ] Admin can view all customers
- [ ] Email update shows warning for customers with login
- [ ] New customers can be created without login
- [ ] New customers can be created with login

---

**Migration Status**: Ready to run  
**Breaking Changes**: None (backward compatible)  
**Requires Code Deploy**: Yes (mobile app updated)
