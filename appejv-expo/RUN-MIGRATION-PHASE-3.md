# Run Migration for Phase 3

## ⚠️ IMPORTANT: Database Migration Required

Phase 3 requires running database migration `08_add_team_tables.sql` to add team structure.

---

## Migration File Location

**Source**: `appejv-expo/migrations/08_add_team_tables.sql`  
**Copied to**: `appejv-api/migrations/08_add_team_tables.sql`

---

## What This Migration Does

### Tables Created
1. `sales_teams` - Team information with manager (sale_admin)
2. `team_members` - Maps sales people to teams
3. `customer_assignments` - Assignment audit trail

### Columns Added
- `customers`: `assigned_to`, `assigned_at`, `assigned_by`, `team_id`
- `orders`: `created_by`, `team_id`, `approved_by`, `approved_at`

### RLS Policies
- Multi-level access control (admin/sale_admin/sale)
- Team-based data visibility
- Customer assignment tracking

### Functions
- `get_team_member_count(team_uuid)` - Count active team members
- `get_team_customer_count(team_uuid)` - Count team customers
- `assign_customer_to_sale(...)` - Assign customer with history

---

## How to Run Migration

### Option 1: Using appejv-api Script (Recommended)

```bash
cd appejv-api
./run-migration.sh 08_add_team_tables.sql
```

### Option 2: Manual via Supabase Dashboard

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy content from `appejv-api/migrations/08_add_team_tables.sql`
4. Paste and run

### Option 3: Using Supabase CLI

```bash
cd appejv-api
supabase db push
```

---

## Verification

After running migration, verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('sales_teams', 'team_members', 'customer_assignments');

-- Check columns added
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND column_name IN ('assigned_to', 'team_id');

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('created_by', 'team_id');

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_team_member_count', 'assign_customer_to_sale');
```

---

## Rollback (If Needed)

If something goes wrong, rollback with:

```sql
-- Drop new tables
DROP TABLE IF EXISTS customer_assignments CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS sales_teams CASCADE;

-- Remove new columns
ALTER TABLE customers 
  DROP COLUMN IF EXISTS assigned_to,
  DROP COLUMN IF EXISTS assigned_at,
  DROP COLUMN IF EXISTS assigned_by,
  DROP COLUMN IF EXISTS team_id;

ALTER TABLE orders 
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS team_id,
  DROP COLUMN IF EXISTS approved_by,
  DROP COLUMN IF EXISTS approved_at;

-- Drop functions
DROP FUNCTION IF EXISTS get_team_member_count(UUID);
DROP FUNCTION IF EXISTS get_team_customer_count(UUID);
DROP FUNCTION IF EXISTS assign_customer_to_sale(UUID, UUID, UUID, UUID, TEXT);
```

---

## Safety Notes

✅ **Safe to Run**:
- All new columns are nullable (backward compatible)
- Existing data not affected
- RLS policies maintain existing access patterns
- No breaking changes

⚠️ **Caution**:
- Backup database before running
- Test in development first
- Run during low-traffic period
- Monitor for errors

---

## After Migration

Once migration is successful:

1. ✅ Verify tables and columns exist
2. ✅ Test RLS policies
3. ✅ Enable Phase 3 feature flags
4. ✅ Test team features in app

---

## Status

- [ ] Migration file copied to appejv-api
- [ ] Migration run successfully
- [ ] Verification queries passed
- [ ] No errors in logs
- [ ] Ready to enable Phase 3 features

---

**Next**: After migration succeeds, continue with Phase 3 implementation.

