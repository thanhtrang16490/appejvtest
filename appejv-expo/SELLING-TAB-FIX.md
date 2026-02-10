# Selling Tab Fix - Bottom Navigation

## Issue
Tab "Bán hàng" (selling) không hiển thị trong bottom navigation bar mặc dù đã được cấu hình trong `_layout.tsx`.

## Root Cause
Expo Router đang cache cấu trúc routing cũ. Khi thêm hoặc sửa routes, Expo cần clear cache để nhận diện lại.

## Solution

### Step 1: Clear All Cache
```bash
cd appejv-expo
./fix-selling-tab.sh
```

### Step 2: Restart Development Server
```bash
npm start -- --clear
```

### Step 3: Reload App
- Nhấn `r` trong terminal để reload
- Hoặc shake device và chọn "Reload"

## Expected Result
Bottom navigation sẽ hiển thị 5 tabs theo thứ tự:

1. **Tổng quan** (dashboard) - Grid icon
2. **Đơn hàng** (orders) - Receipt icon
3. **Bán hàng** (selling) - Cart icon ⭐
4. **Khách hàng** (customers) - People icon
5. **Báo cáo** (reports) - Bar chart icon

## Verification
File structure đúng:
```
app/(sales)/
├── _layout.tsx          ✅ Có cấu hình selling tab
├── dashboard.tsx        ✅
├── orders/              ✅
├── selling.tsx          ✅ File này phải là FILE không phải FOLDER
├── customers/           ✅
└── reports.tsx          ✅
```

## Common Issues

### Issue 1: Tab vẫn không hiển thị
**Solution:** 
- Stop app hoàn toàn (Ctrl+C)
- Xóa app khỏi device/simulator
- Clear cache và cài lại

### Issue 2: Tab hiển thị nhưng crash khi click
**Solution:**
- Kiểm tra `selling.tsx` có export default component
- Kiểm tra không có lỗi syntax trong file

### Issue 3: Tab hiển thị sai thứ tự
**Solution:**
- Thứ tự tabs trong `_layout.tsx` quyết định thứ tự hiển thị
- Đảm bảo `selling` nằm giữa `orders` và `customers`

## Files Modified
- `app/(sales)/_layout.tsx` - Cấu hình bottom tabs
- `app/(sales)/selling.tsx` - Trang bán hàng
- `fix-selling-tab.sh` - Script clear cache

## Notes
- Expo Router tự động tạo routes từ file structure
- File names phải match với route names trong `_layout.tsx`
- Hidden routes dùng `href: null` (inventory, menu, users)
- Luôn clear cache khi thay đổi route structure
