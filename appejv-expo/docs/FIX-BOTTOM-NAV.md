# Fix Bottom Navigation - Xóa Cache

## Vấn đề
Bottom navigation vẫn hiển thị các mục không mong muốn như `orders[id]`, `inventory[id]`, `users[id]`.

## Nguyên nhân
Expo Router cache các route cũ. Khi restructure files, cần clear cache để Expo Router nhận diện lại cấu trúc mới.

## Giải pháp

### Cách 1: Sử dụng script (Khuyến nghị)
```bash
# Trong thư mục appejv-expo
./clear-cache.sh

# Sau đó start lại app với flag --clear
npm start -- --clear
```

### Cách 2: Manual
```bash
# 1. Stop app hiện tại (Ctrl+C)

# 2. Xóa cache
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# 3. Start lại với clear flag
npm start -- --clear

# 4. Trong terminal Expo, nhấn:
# - 'r' để reload
# - hoặc 'shift+r' để clear cache và reload
```

### Cách 3: Trên thiết bị/simulator
1. **iOS Simulator:**
   - Device → Erase All Content and Settings
   - Hoặc: Xóa app và cài lại

2. **Android Emulator:**
   - Settings → Apps → Expo Go → Clear Data
   - Hoặc: Xóa app và cài lại

3. **Physical Device:**
   - Xóa app Expo Go
   - Cài lại từ App Store/Play Store
   - Scan QR code lại

## Kiểm tra
Sau khi clear cache và restart, bottom nav phải hiển thị đúng 5 tabs:
1. ✅ Tổng quan
2. ✅ Đơn hàng
3. ✅ Bán hàng
4. ✅ Khách hàng
5. ✅ Báo cáo

Không được hiển thị:
- ❌ orders[id]
- ❌ inventory[id]
- ❌ users[id]
- ❌ inventory
- ❌ menu
- ❌ users

## Lưu ý
- Mỗi khi thay đổi cấu trúc routes, nên clear cache
- Nếu vẫn không work, thử xóa app hoàn toàn và cài lại
- Đảm bảo không có process Expo nào đang chạy trước khi start lại

## Cấu trúc đúng
```
app/(sales)/
├── _layout.tsx              # Tabs: 5 tabs chính
├── dashboard.tsx            # ✅ Tab 1
├── orders/                  # ✅ Tab 2
│   ├── _layout.tsx         # Stack layout
│   ├── index.tsx           # List page
│   └── [id].tsx            # Detail page (hidden)
├── selling.tsx              # ✅ Tab 3
├── customers.tsx            # ✅ Tab 4
├── reports.tsx              # ✅ Tab 5
├── inventory/               # ❌ Hidden (href: null)
│   ├── _layout.tsx
│   ├── index.tsx
│   └── [id].tsx
├── menu.tsx                 # ❌ Hidden (href: null)
└── users/                   # ❌ Hidden (href: null)
    ├── _layout.tsx
    ├── index.tsx
    └── [id].tsx
```
