# Import Paths Fixed ✅

## Issue
After restructuring files from:
- `orders.tsx` → `orders/index.tsx`
- `inventory.tsx` → `inventory/index.tsx`
- `users.tsx` → `users/index.tsx`

Import paths were broken because files moved one level deeper.

## Solution

Updated all import paths in the moved files to add one more `../`:

### Before (incorrect)
```typescript
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
source={require('../../assets/icon.png')}
```

### After (correct)
```typescript
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
source={require('../../../assets/icon.png')}
```

## Files Fixed

### 1. `app/(sales)/inventory/index.tsx`
- ✅ Fixed AuthContext import
- ✅ Fixed supabase import
- ✅ Fixed assets/icon.png import

### 2. `app/(sales)/orders/index.tsx`
- ✅ Fixed AuthContext import
- ✅ Fixed supabase import
- ✅ Fixed assets/icon.png import

### 3. `app/(sales)/users/index.tsx`
- ✅ Fixed AuthContext import
- ✅ Fixed supabase import
- ✅ Fixed assets/icon.png import

## Path Explanation

### File Structure
```
app/
├── (sales)/
│   ├── dashboard.tsx          # 2 levels from root
│   ├── orders/
│   │   ├── index.tsx         # 3 levels from root (needs ../../../)
│   │   └── [id].tsx          # 3 levels from root (needs ../../../)
│   ├── inventory/
│   │   ├── index.tsx         # 3 levels from root (needs ../../../)
│   │   └── [id].tsx          # 3 levels from root (needs ../../../)
│   └── users/
│       ├── index.tsx         # 3 levels from root (needs ../../../)
│       └── [id].tsx          # 3 levels from root (needs ../../../)
src/
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── supabase.ts
assets/
└── icon.png
```

### Import Path Rules
- From `app/(sales)/dashboard.tsx`: `../../src/...` (2 levels up)
- From `app/(sales)/orders/index.tsx`: `../../../src/...` (3 levels up)
- From `app/(sales)/orders/[id].tsx`: `../../../src/...` (3 levels up)

## Testing
1. ✅ App starts without import errors
2. ✅ Orders page loads correctly
3. ✅ Inventory page loads correctly
4. ✅ Users page loads correctly
5. ✅ Logo images display correctly
6. ✅ AuthContext works in all pages
7. ✅ Supabase queries work in all pages

## Note
When moving files to different folder depths, always update:
1. Import paths to `src/` folder
2. Import paths to `assets/` folder
3. Any other relative imports

The rule is simple: count how many levels deep the file is from the `app/` folder, then use that many `../` to go back up.
