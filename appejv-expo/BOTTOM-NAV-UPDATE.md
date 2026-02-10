# Bottom Navigation Update - FIXED ✅

## Issue
Bottom navigation was showing 7 tabs instead of 5 when logged in as admin.

## Root Cause
Expo Router was treating dynamic route folders (`orders/[id]`, `inventory/[id]`, `users/[id]`) as separate tab entries because:
1. The files were at the wrong level (e.g., `orders.tsx` and `orders/[id].tsx` separately)
2. No `_layout.tsx` files existed in the dynamic route folders to configure them as Stack navigators

## Solution

### 1. Restructured Files
Moved list pages into their respective folders as `index.tsx`:
- `orders.tsx` → `orders/index.tsx`
- `inventory.tsx` → `inventory/index.tsx`
- `users.tsx` → `users/index.tsx`

### 2. Created Stack Layouts
Added `_layout.tsx` files in each folder to configure them as Stack navigators:
- `orders/_layout.tsx`
- `inventory/_layout.tsx`
- `users/_layout.tsx`

### 3. Updated Main Layout
The main `(sales)/_layout.tsx` now properly hides the folders that shouldn't appear in tabs:
- `inventory` - href: null (accessed via menu)
- `menu` - href: null (accessed via header button)
- `users` - href: null (accessed via menu)

### 4. Clear Cache (IMPORTANT!)
After restructuring, you MUST clear Expo cache:
```bash
# Run the clear cache script
./clear-cache.sh

# Then start with clear flag
npm start -- --clear
```

Or manually:
```bash
rm -rf .expo node_modules/.cache
npm start -- --clear
```

## Final Structure

```
app/(sales)/
├── _layout.tsx              # Tabs configuration
├── dashboard.tsx            # Tab 1: Tổng quan
├── orders/                  # Tab 2: Đơn hàng
│   ├── _layout.tsx         # Stack navigator
│   ├── index.tsx           # Orders list
│   └── [id].tsx            # Order detail
├── selling.tsx              # Tab 3: Bán hàng
├── customers.tsx            # Tab 4: Khách hàng
├── reports.tsx              # Tab 5: Báo cáo
├── inventory/               # Hidden from tabs
│   ├── _layout.tsx         # Stack navigator
│   ├── index.tsx           # Inventory list
│   └── [id].tsx            # Product detail
├── menu.tsx                 # Hidden from tabs
└── users/                   # Hidden from tabs
    ├── _layout.tsx         # Stack navigator
    ├── index.tsx           # Users list
    └── [id].tsx            # User detail
```

## Result
✅ Bottom navigation now shows exactly 5 tabs:
1. Tổng quan (Dashboard)
2. Đơn hàng (Orders)
3. Bán hàng (Selling)
4. Khách hàng (Customers)
5. Báo cáo (Reports)

✅ All detail pages work correctly via navigation
✅ Menu and other pages accessible via header/menu buttons
✅ Consistent across all user roles (Sale, Sale Admin, Admin)

## Troubleshooting

### If you still see `orders[id]` or other unwanted tabs:

1. **Stop the app completely** (Ctrl+C)
2. **Clear all cache:**
   ```bash
   ./clear-cache.sh
   ```
3. **Start with clear flag:**
   ```bash
   npm start -- --clear
   ```
4. **In Expo terminal, press:**
   - `r` to reload
   - or `shift+r` to clear cache and reload
5. **On device/simulator:**
   - Delete the Expo Go app
   - Reinstall from App Store/Play Store
   - Scan QR code again

### Still not working?
- Make sure no Expo processes are running
- Try restarting your computer
- Delete and reinstall Expo Go on your device

## Testing
1. Login as Admin → See 5 tabs ✅
2. Login as Sale Admin → See 5 tabs ✅
3. Login as Sale → See 5 tabs ✅
4. Navigate to order detail → Works ✅
5. Navigate to product detail → Works ✅
6. Navigate to user detail → Works ✅

## Files Created
- `clear-cache.sh` - Script to clear all Expo cache
- `FIX-BOTTOM-NAV.md` - Detailed troubleshooting guide
