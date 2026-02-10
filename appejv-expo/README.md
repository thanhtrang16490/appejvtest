# APPE JV Expo - React Native Mobile App

Ứng dụng di động cho hệ thống quản lý APPE JV, được xây dựng bằng React Native và Expo.

## Tính năng

### Khách hàng
- Đăng nhập bằng số điện thoại
- Xem danh sách sản phẩm
- Xem đơn hàng
- Quản lý tài khoản

### Nhân viên bán hàng
- Đăng nhập bằng email
- Quản lý khách hàng
- Quản lý kho hàng
- Xem báo cáo
- Quản lý đơn hàng

### Quản trị viên
- Tất cả tính năng của nhân viên
- Quản lý người dùng
- Xem audit logs
- Cài đặt hệ thống

## Công nghệ sử dụng

- **React Native** - Framework mobile
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **Supabase** - Authentication & Database
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **React Native Reanimated** - Animations
- **React Native Gesture Handler** - Gestures

## Cài đặt

### Yêu cầu
- Node.js >= 20.9.0
- npm >= 10.0.0
- Expo CLI
- iOS Simulator (Mac) hoặc Android Emulator

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd appejv-expo
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:
```env
EXPO_PUBLIC_API_URL=http://localhost:8081/api/v1
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Bước 4: Chạy ứng dụng

#### iOS (Mac only)
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

#### Development với Expo Go
```bash
npx expo start
```

Sau đó quét QR code bằng ứng dụng Expo Go trên điện thoại.

## Cấu trúc thư mục

```
appejv-expo/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── customer-login.tsx
│   │   └── forgot-password.tsx
│   ├── (customer)/        # Customer screens
│   │   ├── dashboard.tsx
│   │   ├── products.tsx
│   │   ├── orders.tsx
│   │   └── account.tsx
│   ├── (sales)/           # Sales screens
│   │   ├── dashboard.tsx
│   │   ├── customers.tsx
│   │   ├── inventory.tsx
│   │   └── menu.tsx
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/               # Libraries & utilities
│   │   ├── supabase.ts
│   │   └── api-client.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── assets/                # Images, fonts, etc.
├── .env.example           # Environment variables template
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## Scripts

- `npm run android` - Chạy trên Android
- `npm run ios` - Chạy trên iOS
- `npm run web` - Chạy trên web browser
- `npm start` - Khởi động Expo development server

## Build Production

### Android APK
```bash
eas build --platform android --profile preview
```

### iOS
```bash
eas build --platform ios --profile preview
```

### Cả hai platforms
```bash
eas build --platform all --profile production
```

## Tích hợp với Backend

Ứng dụng kết nối với:
- **appejv-api** (Go backend) - API endpoints
- **Supabase** - Authentication & Database

Đảm bảo backend đang chạy trước khi test ứng dụng:
```bash
# Trong thư mục appejv-api
make run
```

## Testing

### Test trên thiết bị thật
1. Cài đặt Expo Go từ App Store/Play Store
2. Chạy `npx expo start`
3. Quét QR code bằng Expo Go

### Test trên emulator
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios
```

## Troubleshooting

Gặp lỗi? Xem [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) để biết giải pháp chi tiết.

### Quick Fixes

**Lỗi babel-preset-expo:**
```bash
npm install babel-preset-expo --save-dev --legacy-peer-deps
```

**Lỗi Metro bundler:**
```bash
npx expo start --clear
```

**Lỗi dependencies:**
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

**Port đang được sử dụng:**
```bash
lsof -ti:8081 | xargs kill -9
```

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Copyright © 2024 APPE JV Việt Nam
