# Hướng dẫn tạo Icons cho PWA

## Cách 1: Sử dụng HTML Generator (Đơn giản nhất)

1. Mở file `scripts/generate-icons.html` trong trình duyệt
2. Nhấn nút "Generate All Icons"
3. Các file icon sẽ tự động download về máy
4. Copy tất cả các file vào thư mục `public/`

## Cách 2: Sử dụng Online Tool

1. Truy cập: https://realfavicongenerator.net/
2. Upload file `public/appejv-logo.svg`
3. Cấu hình các tùy chọn:
   - iOS: Chọn màu nền trắng
   - Android: Chọn màu theme #175ead
   - Windows: Chọn màu nền trắng
4. Generate và download
5. Copy các file vào thư mục `public/`

## Cách 3: Sử dụng CLI (Cần cài đặt sharp)

```bash
npm install -g sharp-cli
sharp -i public/appejv-logo.svg -o public/icon-192.png resize 192 192
sharp -i public/appejv-logo.svg -o public/icon-512.png resize 512 512
sharp -i public/appejv-logo.svg -o public/apple-icon-180.png resize 180 180
sharp -i public/appejv-logo.svg -o public/favicon-32x32.png resize 32 32
```

## Danh sách các file cần tạo:

- ✅ `favicon.svg` - Đã có (copy từ appejv-logo.svg)
- ⏳ `icon-192.png` - Icon PWA standard
- ⏳ `icon-512.png` - Icon PWA standard
- ⏳ `icon-maskable-192.png` - Icon PWA maskable (có padding nhiều hơn)
- ⏳ `icon-maskable-512.png` - Icon PWA maskable
- ⏳ `apple-icon-180.png` - Icon cho iOS
- ⏳ `favicon-32x32.png` - Favicon PNG

## Kiểm tra PWA

Sau khi tạo xong các icon:

1. Build project: `npm run build`
2. Start production: `npm start`
3. Mở Chrome DevTools > Application > Manifest
4. Kiểm tra tất cả các icon hiển thị đúng
5. Test "Add to Home Screen" trên mobile

## Lưu ý

- Tất cả icon nên có nền trắng
- Logo APPE JV có màu xanh (#175ead, #2575be)
- Maskable icons cần padding nhiều hơn để tránh bị cắt trên một số thiết bị
