# Hướng dẫn khắc phục lỗi Loading

## Vấn đề hiện tại
App bị treo ở màn hình loading với logo APPE JV.

## Nguyên nhân có thể
1. AuthContext không hoàn thành khởi tạo
2. Supabase không kết nối được
3. Các màn hình auth vẫn dùng `className` (NativeWind đã bị xóa)

## Các bước khắc phục

### Bước 1: Restart Expo Server (QUAN TRỌNG)
```bash
# Dừng server hiện tại (Ctrl+C)
# Xóa cache và khởi động lại
cd appejv-expo
npx expo start --clear
```

### Bước 2: Kiểm tra logs
Sau khi restart, xem terminal logs để tìm:
- `Supabase Config:` - Kiểm tra URL và key có đúng không
- `AuthProvider: Initializing...` - AuthContext bắt đầu
- `AuthProvider: Getting session...` - Đang lấy session
- `AuthProvider: Session result:` - Kết quả session
- `AuthProvider: Timeout - forcing loading to false` - Nếu thấy dòng này sau 2 giây, có vấn đề

### Bước 3: Kiểm tra kết nối Supabase
Nếu thấy lỗi kết nối Supabase:
1. Kiểm tra file `.env` có đúng URL và key không
2. Kiểm tra internet connection
3. Thử truy cập https://mrcmratcnlsoxctsbalt.supabase.co trên browser

### Bước 4: Nếu vẫn bị treo
Có thể do các màn hình auth vẫn dùng `className`. Cần convert sang inline styles:
- `app/(auth)/login.tsx`
- `app/(auth)/customer-login.tsx`
- `app/(auth)/forgot-password.tsx`

## Thay đổi đã thực hiện

### 0. Cài đặt dependency thiếu
- Đã cài `expo-linking` (required by expo-router)

### 1. Cải thiện AuthContext
- Giảm timeout từ 3s xuống 2s
- Thêm flag `mounted` để tránh memory leak
- Cải thiện error handling
- Thêm nhiều console.log để debug

### 2. Thêm logging vào Supabase client
- Log ra URL và key length khi khởi tạo
- Giúp verify config được load đúng

### 3. Đã convert sang inline styles
- ✅ `app/(customer)/products.tsx`
- ✅ `app/(customer)/orders.tsx`
- ✅ `app/(sales)/customers.tsx`
- ✅ `app/(auth)/login.tsx` - ĐÃ CONVERT
- ✅ `app/(auth)/customer-login.tsx` - ĐÃ CONVERT
- ✅ `app/(auth)/forgot-password.tsx` - ĐÃ CONVERT
- ❌ Dashboard screens - Chưa convert (nhưng không ảnh hưởng loading)

## Logs mong đợi khi chạy đúng

```
Supabase Config: { url: 'https://mrcmratcnlsoxctsbalt.supabase.co', hasKey: true, keyLength: 205 }
AuthProvider: Initializing...
AuthProvider: Getting session...
AuthProvider: Session result: null
Index - loading: false user: null
No user, redirecting to login
```

## Nếu vẫn không được
Hãy gửi logs từ terminal để tôi xem chi tiết lỗi.
