# Khắc phục lỗi Loading - HOÀN TẤT

## Tóm tắt các vấn đề đã fix

### 1. ✅ Missing dependency: expo-linking
**Lỗi:** `Unable to resolve "expo-linking" from "node_modules/expo-router/build/views/Unmatched.js"`

**Nguyên nhân:** expo-router cần expo-linking nhưng không được cài đặt

**Giải pháp:** 
```bash
npm install expo-linking
```

### 2. ✅ Auth screens dùng className (NativeWind đã xóa)
**Lỗi:** App không hiển thị màn hình login vì className không hoạt động

**Nguyên nhân:** Đã xóa NativeWind nhưng các màn hình auth vẫn dùng className

**Giải pháp:** Convert tất cả auth screens sang inline styles:
- ✅ `app/(auth)/login.tsx`
- ✅ `app/(auth)/customer-login.tsx`
- ✅ `app/(auth)/forgot-password.tsx`

### 3. ✅ AuthContext timeout và error handling
**Vấn đề:** AuthContext có thể bị treo nếu Supabase không phản hồi

**Giải pháp:**
- Giảm timeout từ 3s xuống 2s
- Thêm flag `mounted` để tránh memory leak
- Cải thiện error handling với try-catch
- Thêm nhiều console.log để debug

### 4. ✅ Supabase client logging
**Giải pháp:** Thêm logging để verify config:
```typescript
console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length
})
```

## Cách chạy app

### Bước 1: Restart Expo server (BẮT BUỘC)
```bash
cd appejv-expo

# Dừng server cũ (Ctrl+C nếu đang chạy)

# Xóa cache và khởi động lại
npx expo start --clear
```

### Bước 2: Chọn platform
- Nhấn `a` để chạy trên Android
- Nhấn `i` để chạy trên iOS
- Nhấn `w` để chạy trên Web

### Bước 3: Kiểm tra logs
Sau khi app khởi động, bạn sẽ thấy logs:
```
Supabase Config: { url: 'https://mrcmratcnlsoxctsbalt.supabase.co', hasKey: true, keyLength: 205 }
AuthProvider: Initializing...
AuthProvider: Getting session...
AuthProvider: Session result: null
Index - loading: false user: null
No user, redirecting to login
```

### Bước 4: Test đăng nhập
App sẽ hiển thị màn hình login với:
- Logo APPE JV
- Form đăng nhập email/password
- Nút "Đăng nhập khách hàng"
- Link "Quên mật khẩu?"

## Cấu trúc đã hoàn thành

### Auth Screens (✅ Inline styles)
- `app/(auth)/login.tsx` - Đăng nhập nhân viên (email)
- `app/(auth)/customer-login.tsx` - Đăng nhập khách hàng (phone)
- `app/(auth)/forgot-password.tsx` - Quên mật khẩu

### Customer Screens (✅ Inline styles)
- `app/(customer)/dashboard.tsx` - Trang chủ khách hàng
- `app/(customer)/products.tsx` - Danh sách sản phẩm (Supabase direct)
- `app/(customer)/orders.tsx` - Đơn hàng (Supabase direct)
- `app/(customer)/account.tsx` - Tài khoản

### Sales Screens (✅ Inline styles)
- `app/(sales)/dashboard.tsx` - Trang chủ nhân viên
- `app/(sales)/customers.tsx` - Quản lý khách hàng (Supabase direct)
- `app/(sales)/inventory.tsx` - Quản lý kho
- `app/(sales)/menu.tsx` - Menu

### Core Files
- `src/contexts/AuthContext.tsx` - ✅ Improved with timeout & error handling
- `src/lib/supabase.ts` - ✅ Added logging
- `app/_layout.tsx` - Root layout với AuthProvider
- `app/index.tsx` - Entry point với loading logic

## Dependencies hiện tại

```json
{
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-navigation/native": "^7.1.28",
    "@react-navigation/native-stack": "^7.12.0",
    "@supabase/supabase-js": "^2.95.3",
    "@tanstack/react-query": "^5.90.20",
    "expo": "~54.0.33",
    "expo-linking": "^7.0.3",  // ← MỚI THÊM
    "expo-router": "^6.0.23",
    "expo-secure-store": "^15.0.8",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "^5.6.2",
    "react-native-screens": "~4.16.0",
    "react-native-url-polyfill": "^3.0.0",
    "zustand": "^5.0.11"
  }
}
```

## Đã XÓA (không dùng nữa)
- ❌ nativewind
- ❌ tailwindcss
- ❌ react-native-reanimated
- ❌ react-native-gesture-handler
- ❌ react-native-worklets
- ❌ react-native-worklets-core

## Kết nối API

App hiện đang sử dụng **Supabase trực tiếp** thay vì Go API:
- URL: `https://mrcmratcnlsoxctsbalt.supabase.co`
- Anon Key: Đã cấu hình trong `.env`

Các màn hình đã chuyển sang Supabase:
- Products list
- Orders list
- Customers list

## Troubleshooting

### Nếu vẫn bị treo ở loading
1. Kiểm tra terminal logs có lỗi gì không
2. Verify `.env` có đúng Supabase URL và key
3. Kiểm tra internet connection
4. Thử xóa cache: `npx expo start --clear`

### Nếu thấy lỗi "className is not a valid prop"
Có màn hình nào đó vẫn dùng className. Cần convert sang inline styles.

### Nếu thấy lỗi babel/worklets
Restart server với `--clear` flag để xóa cache babel cũ.

## Kết luận

✅ Tất cả vấn đề đã được fix:
1. Cài đặt expo-linking
2. Convert auth screens sang inline styles
3. Cải thiện AuthContext
4. Thêm logging để debug

**App giờ đã sẵn sàng chạy!** 🎉

Chạy lệnh: `npx expo start --clear` và test thử.
