# Khởi động App - Hướng dẫn nhanh

## Lệnh chạy app

```bash
cd appejv-expo
npx expo start --clear
```

Sau đó chọn:
- `a` - Android
- `i` - iOS  
- `w` - Web

## Logs mong đợi

Khi app chạy đúng, bạn sẽ thấy:

```
Supabase Config: { 
  url: 'https://mrcmratcnlsoxctsbalt.supabase.co', 
  hasKey: true, 
  keyLength: 205 
}
AuthProvider: Initializing...
AuthProvider: Getting session...
AuthProvider: Session result: null
Index - loading: false user: null
No user, redirecting to login
```

## Màn hình đăng nhập

App sẽ hiển thị:
- Logo APPE JV
- Form email + password
- Nút "Đăng nhập"
- Link "Quên mật khẩu?"
- Nút "Đăng nhập khách hàng"

## Test accounts

### Nhân viên (Email login)
- Email: admin@appejv.app
- Password: [hỏi admin]

### Khách hàng (Phone login)
- Phone: 0123456789
- Password: [hỏi admin]

## Nếu có lỗi

Xem file `LOADING-FIX.md` để biết chi tiết các lỗi đã fix và cách khắc phục.

## Files quan trọng

- `.env` - Cấu hình Supabase
- `src/contexts/AuthContext.tsx` - Xử lý authentication
- `app/(auth)/login.tsx` - Màn hình đăng nhập
- `babel.config.js` - Cấu hình babel (đơn giản)
