# App Store Policies - Hoàn Thành ✅

## 📋 Tổng Quan

Đã tạo đầy đủ các chính sách pháp lý cần thiết để đưa APPE JV lên Google Play Store và Apple App Store.

## ✅ Các File Đã Tạo

### 1. Chính Sách Trên Website (Khuyến nghị)

#### Privacy Policy
- **URL:** https://appejv.com/app-privacy-policy
- **File:** `appejv-web/src/pages/app-privacy-policy.astro`
- **Nội dung:**
  - Thu thập dữ liệu gì
  - Sử dụng dữ liệu như thế nào
  - Chia sẻ với ai
  - Bảo mật dữ liệu
  - Quyền của người dùng
  - Tuân thủ pháp luật (GDPR, CCPA, Việt Nam)

#### Terms of Service
- **URL:** https://appejv.com/app-terms-of-service
- **File:** `appejv-web/src/pages/app-terms-of-service.astro`
- **Nội dung:**
  - Điều khoản sử dụng
  - Quyền và trách nhiệm
  - Đơn hàng và thanh toán
  - Giới hạn trách nhiệm
  - Giải quyết tranh chấp

### 2. Chính Sách Trong App (Backup)

#### Privacy Policy (Markdown)
- **File:** `appejv-expo/docs/PRIVACY-POLICY.md`
- **Mục đích:** Backup, có thể hiển thị trong app nếu cần

#### Terms of Service (Markdown)
- **File:** `appejv-expo/docs/TERMS-OF-SERVICE.md`
- **Mục đích:** Backup, có thể hiển thị trong app nếu cần

### 3. Hướng Dẫn Submit

#### App Store Submission Guide
- **File:** `appejv-expo/docs/APP-STORE-SUBMISSION-GUIDE.md`
- **Nội dung:**
  - Checklist đầy đủ
  - Hướng dẫn Apple App Store
  - Hướng dẫn Google Play Store
  - Screenshots requirements
  - App descriptions
  - Testing checklist

## 🔗 URLs Cần Dùng Khi Submit

### Apple App Store
```
Privacy Policy URL: https://appejv.app/app-privacy-policy
Terms of Service URL: https://appejv.app/app-terms-of-service
Support URL: https://appejv.app/lien-he
Marketing URL: https://appejv.app
```

### Google Play Store
```
Privacy Policy URL: https://appejv.app/app-privacy-policy
Terms of Service URL: https://appejv.app/app-terms-of-service
Website: https://appejv.app
Support Email: info@appejv.app
Phone: +84 351 3595 202
```

## 📱 App Configuration

### app.json Updates
Đã cập nhật `appejv-expo/app.json` với:
- iOS permissions descriptions
- Android permissions
- Bundle identifiers

```json
{
  "ios": {
    "bundleIdentifier": "com.appejv.app",
    "infoPlist": {
      "NSCameraUsageDescription": "Ứng dụng cần quyền truy cập camera để chụp ảnh sản phẩm",
      "NSPhotoLibraryUsageDescription": "Ứng dụng cần quyền truy cập thư viện ảnh để tải lên hình ảnh sản phẩm"
    }
  },
  "android": {
    "package": "com.appejv.android",
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

## ⚠️ Thông Tin Doanh Nghiệp (Đã Cập Nhật)

### Thông Tin Công Ty
- **Tên:** Công ty Cổ phần APPE JV Việt Nam
- **Địa chỉ:** Km 50 Quốc lộ 1A, Xã Tiên Tân, Phủ Lý, Hà Nam, Việt Nam
- **Điện thoại:** 0351 3595 202 / 0351 3595 203
- **Email:** info@appejv.app
- **Website:** https://appejv.app
- **Năm thành lập:** 2008
- **Lĩnh vực:** Thức ăn chăn nuôi và thủy sản

### Thông Tin Đã Cập Nhật
- ✅ Domain: appejv.app (không phải .com)
- ✅ Email: info@appejv.app
- ✅ Địa chỉ: Km 50 QL1A, Phủ Lý, Hà Nam
- ✅ Điện thoại: 0351 3595 202
- ✅ Tên công ty đầy đủ: Công ty Cổ phần APPE JV Việt Nam

### 3. Website
- [x] Deploy các trang chính sách lên production
- [ ] Test các URLs hoạt động
- [ ] Đảm bảo responsive trên mobile

### 4. App Assets
- [ ] Icon app (1024x1024px)
- [ ] Screenshots (iOS và Android)
- [ ] Feature Graphic (Android: 1024x500px)
- [ ] Video demo (tùy chọn)

### 5. Demo Account
Tạo tài khoản demo cho reviewers:
- [ ] Username: demo@appejv.app
- [ ] Password: [Tạo password mạnh]
- [ ] Có dữ liệu mẫu để test

## ⚠️ Cần Làm Trước Khi Submit

### 1. Deploy Website
```bash
cd appejv-web
npm run build
# Deploy lên hosting
```

### 2. Verify URLs
- [ ] https://appejv.app/app-privacy-policy
- [ ] https://appejv.app/app-terms-of-service
- [ ] https://appejv.app/lien-he

### 3. Setup Email
- [ ] Đảm bảo info@appejv.app hoạt động
- [ ] Test nhận email từ users

## 🎯 Lợi Ích Của Việc Dùng Website

### ✅ Tại Sao Nên Dùng Website (Không Chỉ Trong App)

1. **Yêu cầu bắt buộc:** App Store và Play Store yêu cầu URL công khai
2. **Dễ cập nhật:** Sửa trên web không cần update app
3. **SEO và Trust:** Tăng độ tin cậy, người dùng xem trước khi tải
4. **Tuân thủ pháp luật:** Nhiều quốc gia yêu cầu chính sách công khai
5. **Chia sẻ dễ dàng:** Gửi link cho đối tác, khách hàng
6. **Không tốn dung lượng app:** Giảm kích thước app bundle

### 📊 So Sánh

| Tiêu chí | Website | Trong App |
|----------|---------|-----------|
| Yêu cầu Store | ✅ Đáp ứng | ❌ Không đủ |
| Cập nhật | ✅ Ngay lập tức | ❌ Cần update app |
| SEO | ✅ Có | ❌ Không |
| Chia sẻ | ✅ Dễ dàng | ❌ Khó |
| Kích thước app | ✅ Không ảnh hưởng | ❌ Tăng size |
| Tuân thủ pháp luật | ✅ Đầy đủ | ⚠️ Có thể thiếu |

## 🚀 Các Bước Tiếp Theo

### 1. Deploy Website (Ưu tiên cao)
```bash
cd appejv-web

# Build website
npm run build

# Deploy lên production
# (Vercel, Netlify, hoặc hosting của bạn)
```

### 2. Verify URLs
Sau khi deploy, kiểm tra:
- https://appejv.com/app-privacy-policy
- https://appejv.com/app-terms-of-service

### 3. Cập nhật Thông Tin
- Sửa các placeholder trong chính sách
- Cập nhật app.json nếu cần
- Tạo demo account

### 4. Chuẩn Bị Assets
- Tạo screenshots
- Tạo feature graphic
- Viết app descriptions

### 5. Build App
```bash
cd appejv-expo

# Build cho iOS
eas build --platform ios --profile production

# Build cho Android
eas build --platform android --profile production
```

### 6. Submit
- Làm theo hướng dẫn trong `APP-STORE-SUBMISSION-GUIDE.md`
- Submit lên Apple App Store
- Submit lên Google Play Store

## 📞 Support

Nếu cần hỗ trợ:
- Xem: `APP-STORE-SUBMISSION-GUIDE.md`
- Apple Developer Support: https://developer.apple.com/support/
- Google Play Support: https://support.google.com/googleplay/android-developer

## ✅ Checklist Cuối Cùng

Trước khi submit, đảm bảo:
- [x] Privacy Policy có URL công khai
- [x] Terms of Service có URL công khai
- [ ] Các URLs hoạt động và accessible
- [ ] Thông tin công ty đã cập nhật
- [ ] Email domains đã setup
- [ ] Demo account đã tạo
- [ ] App assets đã chuẩn bị
- [ ] App đã test kỹ
- [ ] Tuân thủ guidelines của Apple và Google

## 🎉 Kết Luận

Bạn đã có đầy đủ chính sách pháp lý cần thiết để đưa APPE JV lên App Store và Play Store!

**Khuyến nghị:** Sử dụng URLs từ website (https://appejv.app) thay vì đưa nội dung vào app. Điều này đáp ứng yêu cầu của stores và dễ bảo trì hơn.

---

**Ngày tạo:** 25 tháng 2, 2026  
**Phiên bản:** 1.1 (Đã cập nhật thông tin thực tế)  
**Domain:** appejv.app  
**Công ty:** Công ty Cổ phần APPE JV Việt Nam
