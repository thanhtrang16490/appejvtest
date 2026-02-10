# Quick Start - APPE JV Expo

Hướng dẫn nhanh để chạy ứng dụng APPE JV Expo.

## Bước 1: Cài đặt Dependencies

```bash
cd appejv-expo
npm install
```

## Bước 2: Cấu hình Environment

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:8081/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Bước 3: Khởi động Backend

Đảm bảo backend đang chạy:

```bash
# Terminal 1 - API
cd appejv-api
make run
```

## Bước 4: Chạy Expo App

### Option 1: Expo Go (Khuyến nghị cho development)

```bash
npx expo start
```

Sau đó:
- Quét QR code bằng Expo Go app trên điện thoại
- Hoặc nhấn `i` cho iOS simulator
- Hoặc nhấn `a` cho Android emulator

### Option 2: Development Build

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Tài khoản Test

### Nhân viên (Email Login)
- Email: `admin@appejv.app`
- Password: `admin123`

### Khách hàng (Phone Login)
- Phone: `0123456789`
- Password: `customer123`

## Troubleshooting

### Lỗi "Cannot find module 'babel-preset-expo'"
```bash
npm install babel-preset-expo --save-dev --legacy-peer-deps
```

### Lỗi "Unable to resolve asset"
Đảm bảo các file assets tồn tại:
```bash
ls -la assets/
# Cần có: icon.png, splash.png, adaptive-icon.png, favicon.png
```

### Port 8081 đang được sử dụng
```bash
# Kill process trên port 8081
lsof -ti:8081 | xargs kill -9

# Hoặc chạy trên port khác
npx expo start --port 8082
```

### Clear cache nếu gặp lỗi
```bash
npm run reset
# hoặc
npx expo start --clear
```

### Reinstall dependencies
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### iOS Simulator không khởi động
```bash
# Mở Xcode và chạy simulator thủ công
open -a Simulator
```

### Android Emulator không khởi động
```bash
# Mở Android Studio và chạy emulator thủ công
# Hoặc sử dụng AVD Manager
```

## Cấu trúc Screens

### Authentication
- `/` - Redirect dựa trên auth state
- `/(auth)/login` - Đăng nhập nhân viên
- `/(auth)/customer-login` - Đăng nhập khách hàng
- `/(auth)/forgot-password` - Quên mật khẩu

### Customer App
- `/(customer)/dashboard` - Trang chủ khách hàng
- `/(customer)/products` - Danh sách sản phẩm
- `/(customer)/orders` - Đơn hàng của tôi
- `/(customer)/account` - Tài khoản

### Sales App
- `/(sales)/dashboard` - Tổng quan bán hàng
- `/(sales)/customers` - Quản lý khách hàng
- `/(sales)/inventory` - Quản lý kho hàng
- `/(sales)/menu` - Menu & cài đặt

## Development Tips

### Hot Reload
- Shake device để mở Dev Menu
- Hoặc nhấn `r` trong terminal để reload
- Hoặc nhấn `m` để toggle menu

### Debug
- Nhấn `j` để mở Chrome DevTools
- Sử dụng React DevTools extension
- Xem logs trong terminal

### Network Debugging
- iOS: Sử dụng Network Link Conditioner
- Android: Sử dụng Chrome DevTools Network tab

## Next Steps

1. Customize UI/UX theo brand guidelines
2. Thêm các tính năng mới
3. Tích hợp push notifications
4. Setup analytics
5. Prepare for production build

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
