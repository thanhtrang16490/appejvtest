# Customers Separation - Complete ✅

**Date**: February 13, 2026  
**Status**: COMPLETED

## Overview

Successfully separated customers from the `profiles` table into a dedicated `customers` table. This allows customers to exist without authentication and provides better data separation between users and customers.

## Database Changes

### Migration: `10_separate_customers_table.sql`

1. **Dropped** existing `customers` VIEW
2. **Created** `customers` TABLE with fields:
   - `id` (UUID, primary key)
   - `email` (TEXT, for contact only)
   - `full_name` (TEXT)
   - `phone` (TEXT)
   - `address` (TEXT)
   - `assigned_to` (UUID, references profiles)
   - `company` (TEXT)
   - `tax_code` (TEXT)
   - `notes` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

3. **Migrated** 1 customer from profiles to customers table

4. **Created** 6 RLS policies:
   - Admin full access
   - Sale view own assigned customers
   - Sale update own assigned customers
   - Sale Admin view team customers
   - Sale Admin update team customers
   - Warehouse view all customers

5. **Created** 5 indexes for performance:
   - `idx_customers_assigned_to`
   - `idx_customers_email`
   - `idx_customers_phone`
   - `idx_customers_company`
   - `idx_customers_created_at`

## Code Changes

### Mobile App (appejv-expo) - 7 Files Updated

#### Priority 1: Critical Files ✅

1. **`app/(warehouse)/orders.tsx`**
   - Changed: `customer:profiles!orders_customer_id_fkey` → `customer:customers`
   - Warehouse can now view customer info from customers table

2. **`app/(sales)/customers/index.tsx`**
   - Changed: `FROM profiles WHERE role='customer'` → `FROM customers`
   - Added filtering by `assigned_to` for sales

3. **`app/(sales-pages)/customers/index.tsx`**
   - Changed: `FROM profiles WHERE role='customer'` → `FROM customers`
   - Added filtering by `assigned_to` for sales

4. **`app/(sales-pages)/customers/[id].tsx`**
   - Changed: `FROM profiles` → `FROM customers`
   - Removed role selector (customers don't have roles)
   - Added email field to edit form
   - Simplified update logic (no role changes)

5. **`app/(sales-pages)/customers/add.tsx`**
   - Changed: `INSERT INTO profiles` → `INSERT INTO customers`
   - Removed `auth.signUp()` (customers don't need authentication)
   - Direct insert to customers table

#### Priority 2: Important Files ✅

6. **`app/(sales)/dashboard.tsx`**
   - Changed: `FROM profiles WHERE role='customer'` → `FROM customers`
   - Added filtering by `assigned_to` for sale and sale_admin
   - Customer count now accurate per user

#### Priority 3: Nice to Have ✅

7. **`app/(sales-pages)/customers/assign.tsx`**
   - Changed: `FROM profiles` → `FROM customers`
   - Fetch only unassigned customers (`assigned_to IS NULL`)
   - Simplified assignment logic (removed assigned_at, assigned_by)

### Files Not Requiring Changes

- **`app/(sales)/selling/index.tsx`**: Doesn't exist yet
- **`app/(sales)/reports/index.tsx`**: Doesn't query customers

## Key Differences: Customers vs Users

| Aspect | Customers (New) | Users (Profiles) |
|--------|----------------|------------------|
| Authentication | ❌ No auth needed | ✅ Required |
| Email | Contact only | Login credential |
| Role | N/A (always customer) | sale, admin, warehouse, etc. |
| Table | `customers` | `profiles` |
| Assignment | `assigned_to` field | N/A |

## Benefits

1. **Separation of Concerns**: Customers and users are now separate entities
2. **No Auth Required**: Customers don't need login credentials
3. **Better Performance**: Dedicated table with optimized indexes
4. **Cleaner Data Model**: No mixing of customer and user data
5. **Flexible Assignment**: Easy to assign/reassign customers to sales

## Testing Checklist

- [x] Customer list loads correctly
- [x] Customer detail page works
- [x] Create new customer (no auth)
- [x] Update customer info
- [x] Customer assignment to sales
- [x] Order list shows customer info
- [x] Warehouse can view customers
- [x] Dashboard shows correct customer count
- [x] No TypeScript errors

## Rollback Plan

If issues occur, run:

```sql
-- Drop customers table
DROP TABLE customers CASCADE;

-- Restore customers view
CREATE VIEW customers AS 
SELECT * FROM profiles WHERE role = 'customer';
```

## Next Steps (Optional)

1. Consider removing old customer records from `profiles` table
2. Add customer import/export functionality
3. Add customer search by company/tax_code
4. Add customer activity tracking
5. Add customer notes/comments feature

## Files Modified

### Database
- `appejv-api/migrations/10_separate_customers_table.sql`
- `appejv-api/verify-customers-migration.sql`

### Documentation
- `appejv-api/CUSTOMERS-SEPARATION-PLAN.md`
- `appejv-expo/docs/CUSTOMERS-CODE-UPDATE-CHECKLIST.md`
- `CUSTOMERS-SEPARATION-COMPLETE.md` (this file)

### Mobile App Code
- `appejv-expo/app/(warehouse)/orders.tsx`
- `appejv-expo/app/(sales)/customers/index.tsx`
- `appejv-expo/app/(sales)/dashboard.tsx`
- `appejv-expo/app/(sales-pages)/customers/index.tsx`
- `appejv-expo/app/(sales-pages)/customers/[id].tsx`
- `appejv-expo/app/(sales-pages)/customers/add.tsx`
- `appejv-expo/app/(sales-pages)/customers/assign.tsx`

---

**Migration Status**: ✅ COMPLETE  
**Code Status**: ✅ ALL FILES UPDATED  
**Testing Status**: ✅ NO ERRORS  
**Ready for Production**: ✅ YES
