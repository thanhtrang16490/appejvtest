# Customers Table Separation Plan

## Tổng quan

Tách bảng `customers` riêng khỏi `profiles` để phân biệt rõ ràng giữa:
- **profiles**: System users (admin, sale, sale_admin, warehouse)
- **customers**: Business customers (không login vào hệ thống)

## Lý do tách riêng

### Ưu điểm
✅ Phân biệt rõ ràng user hệ thống vs khách hàng
✅ Customers không cần authentication
✅ Dễ mở rộng thêm fields cho customers (company, tax_code, credit_limit...)
✅ Performance tốt hơn (không query chung với users)
✅ Security tốt hơn (customers không có access token)

### Nhược điểm
❌ Phức tạp hơn về cấu trúc
❌ Cần update nhiều code
❌ Migration data có rủi ro

## Cấu trúc mới

### Bảng `customers`
```sql
- id (UUID, PK)
- email (TEXT, unique) - Email liên hệ, không dùng để login
- full_name (TEXT)
- phone (TEXT)
- address (TEXT)
- assigned_to (UUID, FK → profiles.id) - Sale phụ trách
- company (TEXT) - Tên công ty
- tax_code (TEXT) - Mã số thuế
- notes (TEXT) - Ghi chú
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Bảng `profiles` (chỉ còn system users)
```sql
- id (UUID, PK)
- email (TEXT) - Email đăng nhập
- full_name (TEXT)
- phone (TEXT)
- role (ENUM: admin, sale_admin, sale, warehouse) - Bỏ 'customer'
- manager_id (UUID, FK) - Cho sale hierarchy
- ...
```

### Bảng `orders`
```sql
- customer_id (UUID, FK → customers.id) - Trỏ đến customers table
- sale_id (UUID, FK → profiles.id) - Sale xử lý
- ...
```

## Migration Steps

### Phase 1: Preparation (Không ảnh hưởng production)
1. ✅ Tạo migration file: `10_separate_customers_table.sql`
2. ✅ Review migration script
3. ⬜ Backup database
4. ⬜ Test migration trên staging

### Phase 2: Database Migration
1. ⬜ Chạy migration:
```bash
cd appejv-api
psql "$SUPABASE_DB_URL" -f migrations/10_separate_customers_table.sql
```

2. ⬜ Verify data migrated:
```sql
-- Check customer count
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM profiles WHERE role = 'customer';

-- Should be equal
```

### Phase 3: Code Updates

#### Backend API (appejv-api)
⬜ Update models:
- Create `internal/models/customer.go`
- Update order queries to join customers table

⬜ Update handlers:
- Customer CRUD operations
- Order creation/update

#### Mobile App (appejv-expo)
⬜ Update customer queries:
- `app/(sales)/customers/` - List customers
- `app/(sales-pages)/customers/` - Customer management
- `app/(warehouse)/orders.tsx` - Order customer info

⬜ Update order queries:
- Join with customers table instead of profiles
- Update customer selection in order creation

#### Web App (appejv-app)
⬜ Update customer management:
- `app/sales/customers/` pages
- Customer forms and actions

### Phase 4: Testing
⬜ Test customer CRUD
⬜ Test order creation with customers
⬜ Test customer assignment to sales
⬜ Test warehouse viewing customers
⬜ Test reports with customer data

### Phase 5: Cleanup (Optional)
⬜ Remove customer profiles:
```sql
DELETE FROM profiles WHERE role = 'customer';
```

⬜ Update role enum (breaking change):
```sql
-- Remove 'customer' from user_role enum
```

## Code Changes Required

### 1. Customer Queries (Mobile)

**Before:**
```typescript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('role', 'customer')
```

**After:**
```typescript
const { data } = await supabase
  .from('customers')
  .select('*, assigned_sale:profiles!customers_assigned_to_fkey(full_name)')
```

### 2. Order Queries

**Before:**
```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    customer:profiles!orders_customer_id_fkey(full_name, phone)
  `)
```

**After:**
```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    customer:customers(full_name, phone, email, company)
  `)
```

### 3. Customer Creation

**Before:**
```typescript
// Create auth user + profile
const { data: authData } = await supabase.auth.signUp({
  email, password
})
await supabase.from('profiles').insert({
  id: authData.user.id,
  role: 'customer',
  ...
})
```

**After:**
```typescript
// Just create customer record (no auth)
await supabase.from('customers').insert({
  email,
  full_name,
  phone,
  assigned_to: currentUserId,
  ...
})
```

## Rollback Plan

Nếu có vấn đề, rollback bằng cách:

```sql
-- 1. Drop customers table
DROP TABLE IF EXISTS public.customers CASCADE;

-- 2. Restore customer profiles (if deleted)
-- Use backup to restore profiles with role='customer'

-- 3. Revert code changes
git revert <commit-hash>
```

## Timeline

- **Preparation**: 1 day
- **Migration**: 2 hours
- **Code Updates**: 2-3 days
- **Testing**: 1 day
- **Deployment**: 1 day

**Total**: ~5 days

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Full backup before migration |
| Foreign key conflicts | Medium | Test on staging first |
| App downtime | High | Deploy during off-peak hours |
| Code bugs | Medium | Comprehensive testing |

## Decision

⬜ **GO** - Proceed with separation
⬜ **NO-GO** - Keep current structure
⬜ **DEFER** - Postpone to later

**Recommended**: Start with Phase 1-2 (database only), keep both structures temporarily, then gradually migrate code.
