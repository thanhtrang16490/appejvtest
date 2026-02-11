# APPE JV Expo - React Native Mobile App

Ứng dụng di động cho hệ thống quản lý APPE JV, được xây dựng bằng React Native và Expo.

## Tính năng

### Khách hàng (Customer)
- Đăng nhập bằng số điện thoại
- Xem danh sách sản phẩm với giá và hình ảnh
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và xác nhận đơn hàng
- Xem lịch sử đơn hàng
- Quản lý tài khoản cá nhân

### Nhân viên bán hàng (Sale)
- Đăng nhập bằng email
- Quản lý khách hàng của mình
- Quản lý kho hàng
- Tạo và theo dõi đơn hàng
- Xem báo cáo bán hàng
- Quản lý thông tin cá nhân

### Quản lý bán hàng (Sale Admin) - Phase 3
- Tất cả tính năng của nhân viên bán hàng
- Xem và quản lý team (nhân viên dưới quyền)
- Xem khách hàng và đơn hàng của cả team
- Dashboard hiển thị hiệu suất team
- Phân công khách hàng cho nhân viên
- Quản lý người dùng trong team

### Quản trị viên (Admin)
- Tất cả tính năng của Sale Admin
- Quản lý toàn bộ người dùng hệ thống
- Xem audit logs
- Cài đặt hệ thống
- Quản lý danh mục sản phẩm
- Xem báo cáo tổng hợp

## Công nghệ sử dụng

- **React Native** - Framework mobile
- **Expo** - Development platform (SDK 52)
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **Supabase** - Authentication & Database
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **React Native Reanimated** - Animations
- **React Native Gesture Handler** - Gestures
- **Ionicons** - Icon library

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

### Bước 4: Cấu hình Database

Đảm bảo database đã được setup đúng:

1. **Profiles Table Structure:**
```sql
-- Bảng profiles phải có các cột:
id (uuid, primary key)
full_name (text)
phone (text, nullable)
role (text, check constraint)
manager_id (uuid, nullable, foreign key to profiles.id)
```

2. **Role Constraint:**
```sql
-- Chạy migration để đảm bảo role constraint đúng:
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'sale', 'sale_admin', 'customer', 'warehouse'));
```

3. **Không sử dụng Database Triggers:**
   - App tự tạo profile khi tạo user mới
   - Không cần trigger `on_auth_user_created`
   - Đảm bảo tất cả triggers đã bị disable

### Bước 5: Chạy ứng dụng

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
│   │   ├── login.tsx      # Đăng nhập nhân viên (email)
│   │   ├── customer-login.tsx  # Đăng nhập khách hàng (phone)
│   │   └── forgot-password.tsx # Quên mật khẩu
│   ├── (customer)/        # Customer screens
│   │   ├── dashboard.tsx  # Trang chủ khách hàng
│   │   ├── products/      # Sản phẩm & giỏ hàng
│   │   ├── orders/        # Đơn hàng
│   │   └── account.tsx    # Tài khoản
│   ├── (sales)/           # Sales & Sale Admin screens
│   │   ├── dashboard.tsx  # Dashboard với team performance
│   │   ├── customers/     # Quản lý khách hàng (My/Team/All tabs)
│   │   ├── orders/        # Quản lý đơn hàng (My/Team tabs)
│   │   ├── inventory.tsx  # Quản lý kho
│   │   ├── team/          # Quản lý team (sale_admin only)
│   │   ├── users/         # Quản lý người dùng
│   │   └── menu.tsx       # Menu & cài đặt
│   ├── (admin)/           # Admin screens
│   │   ├── dashboard.tsx  # Admin dashboard
│   │   ├── users/         # Quản lý người dùng
│   │   ├── categories.tsx # Quản lý danh mục
│   │   └── settings.tsx   # Cài đặt hệ thống
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/               # Libraries & utilities
│   │   ├── supabase.ts    # Supabase client
│   │   ├── api-client.ts  # API client
│   │   └── feature-flags.ts  # Feature flags
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   └── components/        # Shared components
├── assets/                # Images, fonts, etc.
├── migrations/            # Database migrations
├── docs/                  # Additional documentation
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
- `npm run reset` - Clear cache và restart

## Phân quyền (Role-Based Access)

### Roles
- `customer` - Khách hàng (màu xanh lá #10b981)
- `sale` - Nhân viên bán hàng (màu xanh dương #175ead)
- `sale_admin` - Quản lý bán hàng (màu xanh dương #175ead)
- `admin` - Quản trị viên (màu đỏ #ef4444)
- `warehouse` - Nhân viên kho

### Hierarchy
```
admin (toàn quyền)
  └── sale_admin (quản lý team)
      └── sale (nhân viên)
          └── customer (khách hàng)
```

### Feature Flags (Phase 3)
```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  ENABLE_TEAM_TABS: true,           // My/Team/All tabs
  ENABLE_TEAM_DASHBOARD: true,      // Team performance section
  ENABLE_TEAM_MANAGEMENT: true,     // Team management pages
  ENABLE_CUSTOMER_ASSIGNMENT: true, // Assign customers to team
}
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

## User Management

### Tạo người dùng mới

Từ app (Admin hoặc Sale Admin):
1. Vào menu "Quản lý người dùng"
2. Nhấn nút "Thêm người dùng"
3. Điền thông tin:
   - Email (bắt buộc, định dạng email hợp lệ)
   - Mật khẩu (bắt buộc, tối thiểu 6 ký tự)
   - Họ tên (bắt buộc, tối thiểu 2 ký tự)
   - Số điện thoại (tùy chọn, 10-11 số nếu có)
   - Vai trò (role)
4. App sẽ tự động:
   - Tạo user trong `auth.users`
   - Tạo profile trong `public.profiles`
   - Không cần database trigger

### Validation Rules
- Email: Required, valid format, auto trim & lowercase
- Password: Required, minimum 6 characters
- Full name: Required, minimum 2 characters, auto trim
- Phone: Optional, 10-11 digits if provided

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

### Tài khoản test
Tạo tài khoản test từ app hoặc Supabase dashboard.

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

## Troubleshooting

### Lỗi "Cannot coerce to single JSON object"
- Nguyên nhân: User không có profile trong `public.profiles`
- Giải pháp: App tự tạo profile khi đăng nhập hoặc tạo user mới
- Đảm bảo không có trigger gây conflict

### Lỗi "profiles_role_check constraint"
- Nguyên nhân: Role không hợp lệ
- Giải pháp: Chạy migration để update constraint cho phép: admin, sale, sale_admin, customer, warehouse

### User mới không hiện trong danh sách
- Kiểm tra query filter trong user management page
- Đảm bảo profile đã được tạo trong database
- Check console.log để debug

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

## Documentation

- [QUICK-START.md](./QUICK-START.md) - Hướng dẫn nhanh
- [docs/](./docs/) - Tài liệu chi tiết
- [migrations/](./migrations/) - Database migrations

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Copyright © 2024 APPE JV Việt Nam
