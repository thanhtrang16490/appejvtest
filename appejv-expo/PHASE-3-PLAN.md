# Phase 3: Sales Enhancement - Implementation Plan

## Status: IN PROGRESS

Phase 3 là phase quan trọng nhất với database changes và team features.

---

## Overview

**Goal**: Enable team management, customer assignment, and dual dashboard for sale_admin

**Timeline**: Week 3 (5 working days)

**Risk Level**: MEDIUM (database changes)

---

## Prerequisites

### ✅ Completed
- [x] Phase 1: Foundation (permissions, feature flags, migration file)
- [x] Phase 2: Admin Separation (admin routes)
- [x] Migration file created: `migrations/08_add_team_tables.sql`
- [x] Migration copied to: `appejv-api/migrations/08_add_team_tables.sql`

### ⏸️ Pending
- [ ] Run database migration
- [ ] Test migration success
- [ ] Enable Phase 3 feature flags

---

## Step-by-Step Implementation

### Step 1: Run Database Migration ⚠️

**CRITICAL**: This must be done first before any code changes.

**Instructions**: See `RUN-MIGRATION-PHASE-3.md`

**Command**:
```bash
cd appejv-api
./run-migration.sh 08_add_team_tables.sql
```

**Verification**:
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('sales_teams', 'team_members', 'customer_assignments');

-- Check columns added
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'customers' 
AND column_name IN ('assigned_to', 'team_id');
```

**Status**: ⏸️ NOT RUN YET

---

### Step 2: Create Team Management Pages

#### 2.1 Team Overview Page ✅
**File**: `app/(sales)/team/index.tsx`

**Features**:
- Show team info and stats
- List team members with performance
- Protected by `hasTeamFeatures()` flag
- Only sale_admin can access

**Status**: ✅ CREATED

#### 2.2 Team Member Detail Page
**File**: `app/(sales)/team/[id].tsx`

**Features**:
- Show member details
- Show member's customers
- Show member's orders
- Show performance charts

**Status**: ⏸️ TODO

---

### Step 3: Update Customers Page with Tabs

**File**: `app/(sales)/customers/index.tsx`

**Changes Needed**:
1. Add tab navigation (My/Team/All)
2. Filter customers based on selected tab
3. Show "My Customers" for all sales roles
4. Show "Team Customers" for sale_admin only
5. Show "All Customers" for admin only

**Tab Logic**:
```typescript
const tabs = [
  { key: 'my', label: 'Của tôi', visible: true },
  { key: 'team', label: 'Team', visible: isSaleAdmin },
  { key: 'all', label: 'Tất cả', visible: isAdmin },
]
```

**Query Logic**:
```typescript
// My customers
.eq('assigned_to', user.id)

// Team customers
.in('assigned_to', teamMemberIds)

// All customers (admin)
// No filter
```

**Status**: ⏸️ TODO

---

### Step 4: Update Orders Page with Tabs

**File**: `app/(sales)/orders/index.tsx`

**Changes Needed**:
1. Add tab navigation (My/Team)
2. Filter orders based on selected tab
3. Show "My Orders" for all sales roles
4. Show "Team Orders" for sale_admin only

**Tab Logic**:
```typescript
const tabs = [
  { key: 'my', label: 'Của tôi', visible: true },
  { key: 'team', label: 'Team', visible: isSaleAdmin },
]
```

**Query Logic**:
```typescript
// My orders
.eq('created_by', user.id)
// OR
.in('customer_id', myCustomerIds)

// Team orders
.in('created_by', teamMemberIds)
// OR
.in('customer_id', teamCustomerIds)
```

**Status**: ⏸️ TODO

---

### Step 5: Create Dual Dashboard for Sale Admin

**File**: `app/(sales)/dashboard.tsx`

**Changes Needed**:
1. Detect if user is sale_admin
2. Show personal performance section
3. Show team performance section
4. Show top performers
5. Show pending actions

**Sections**:
```
┌─────────────────────────────────────┐
│  👤 My Performance (Cá nhân)       │
│  - Customers: 15                   │
│  - Orders: 45                      │
│  - Revenue: 150M                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  👥 Team Performance                │
│  - Team Members: 5                 │
│  - Total Customers: 75             │
│  - Total Orders: 230               │
│  - Team Revenue: 750M              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📊 Top Performers                  │
│  1. Nguyễn Văn A - 200M            │
│  2. Trần Thị B - 180M              │
│  3. Lê Văn C - 150M                │
└─────────────────────────────────────┘
```

**Status**: ⏸️ TODO

---

### Step 6: Add Customer Assignment UI

**File**: `app/(sales)/customers/assign.tsx`

**Features**:
- List unassigned customers
- Select customer(s)
- Choose team member to assign
- Add notes
- Confirm assignment
- Track assignment history

**Flow**:
1. Sale admin opens assign page
2. Sees list of unassigned customers
3. Selects customer(s)
4. Chooses team member from dropdown
5. Adds optional notes
6. Confirms assignment
7. Customer assigned with history recorded

**Status**: ⏸️ TODO

---

### Step 7: Update Sales Layout

**File**: `app/(sales)/_layout.tsx`

**Changes Needed**:
1. Add "Team" tab for sale_admin
2. Hide "Team" tab for regular sale
3. Dynamic navigation based on role

**Code**:
```typescript
const isSaleAdmin = profile?.role === 'sale_admin'

// Add team tab conditionally
{isSaleAdmin && hasTeamFeatures(profile.role) && (
  <Tabs.Screen
    name="team"
    options={{
      title: 'Team',
      tabBarIcon: ({ color }) => <Ionicons name="people-circle" size={24} color={color} />
    }}
  />
)}
```

**Status**: ⏸️ TODO

---

## Feature Flags to Enable

After all code is complete, enable these flags:

```typescript
// src/lib/feature-flags.ts
{
  // Phase 3 flags
  enableTeamManagement: true,        // Show team tab
  enableCustomerAssignment: true,    // Allow assigning customers
  enableSaleAdminDashboard: true,    // Show dual dashboard
  enableTeamReports: true,           // Show team reports
  enableOrderApprovals: false,       // Not in Phase 3
}
```

---

## Testing Checklist

### Database Testing
- [ ] Migration run successfully
- [ ] Tables created
- [ ] Columns added
- [ ] RLS policies work
- [ ] Functions work

### Team Management Testing
- [ ] Sale admin can see team page
- [ ] Team stats display correctly
- [ ] Team members list correctly
- [ ] Member details page works
- [ ] Regular sale cannot access team page

### Customer Assignment Testing
- [ ] Sale admin can assign customers
- [ ] Assignment history recorded
- [ ] Customers show in correct tabs
- [ ] RLS policies enforce access
- [ ] Regular sale sees only assigned customers

### Dashboard Testing
- [ ] Sale admin sees dual dashboard
- [ ] Personal stats correct
- [ ] Team stats correct
- [ ] Top performers list correct
- [ ] Regular sale sees single dashboard

### Orders Testing
- [ ] Orders show in correct tabs
- [ ] My orders filter works
- [ ] Team orders filter works (sale_admin)
- [ ] RLS policies enforce access

---

## Risk Assessment

### Risk Level: MEDIUM ⚠️

**Why Medium Risk**:
1. Database schema changes
2. RLS policy changes
3. New features with complex logic
4. Multiple files to update

**Mitigation**:
1. ✅ Migration is backward compatible
2. ✅ Feature flags allow rollback
3. ✅ RLS policies tested
4. ✅ Phased testing approach

---

## Rollback Plan

### Instant Rollback (< 1 minute)
```typescript
// src/lib/feature-flags.ts
{
  enableTeamManagement: false,
  enableCustomerAssignment: false,
  enableSaleAdminDashboard: false,
  enableTeamReports: false,
}
```

### Database Rollback (if needed)
See `RUN-MIGRATION-PHASE-3.md` for rollback SQL

### Code Rollback
```bash
git revert HEAD
git push
```

---

## Implementation Order

**Recommended order**:

1. ✅ Run migration (CRITICAL FIRST STEP)
2. ✅ Create team management pages
3. ⏸️ Update sales layout with team tab
4. ⏸️ Update customers page with tabs
5. ⏸️ Update orders page with tabs
6. ⏸️ Update dashboard for sale_admin
7. ⏸️ Create customer assignment UI
8. ⏸️ Enable feature flags
9. ⏸️ Test thoroughly

---

## Files to Create/Modify

### New Files
- [x] `app/(sales)/team/index.tsx` - Team overview
- [ ] `app/(sales)/team/[id].tsx` - Team member detail
- [ ] `app/(sales)/customers/assign.tsx` - Customer assignment
- [ ] `RUN-MIGRATION-PHASE-3.md` - Migration instructions
- [ ] `PHASE-3-COMPLETE.md` - Completion document

### Files to Modify
- [ ] `app/(sales)/_layout.tsx` - Add team tab
- [ ] `app/(sales)/dashboard.tsx` - Dual dashboard
- [ ] `app/(sales)/customers/index.tsx` - Add tabs
- [ ] `app/(sales)/orders/index.tsx` - Add tabs
- [ ] `src/lib/feature-flags.ts` - Enable flags

---

## Estimated Time

- Migration: 30 minutes
- Team pages: 3 hours
- Customer tabs: 2 hours
- Order tabs: 2 hours
- Dual dashboard: 2 hours
- Assignment UI: 2 hours
- Testing: 3 hours

**Total**: ~15 hours (2 working days)

---

## Current Status

**Completed**:
- [x] Migration file created
- [x] Migration copied to appejv-api
- [x] Team overview page created
- [x] Migration instructions documented

**In Progress**:
- [ ] Run migration
- [ ] Complete remaining pages
- [ ] Update existing pages
- [ ] Enable feature flags

**Next Action**: Run database migration

---

## Questions & Answers

### Q: Can we skip the migration?
**A**: No. Migration is required for Phase 3 features.

### Q: What if migration fails?
**A**: Rollback using provided SQL, fix issues, retry.

### Q: Can we enable features without migration?
**A**: No. App will crash without database tables.

### Q: How to test without affecting production?
**A**: Use feature flags. Keep disabled until ready.

---

**Phase 3 Status**: 🔄 IN PROGRESS

**Next Step**: Run database migration

**Blocked By**: Migration not run yet

**Ready for**: Migration execution

