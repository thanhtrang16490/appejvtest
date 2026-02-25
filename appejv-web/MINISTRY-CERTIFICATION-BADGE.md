# Thêm Logo Xác Nhận Bộ Công Thương vào Footer

## Mô tả
Đã thêm logo "Đã thông báo Bộ Công Thương" vào footer của website để tăng độ tin cậy và tuân thủ quy định pháp luật Việt Nam về thương mại điện tử.

## Vị trí
Logo được đặt ở phần **Company Info** (bên phải) trong footer, ngay dưới các icon mạng xã hội, với:
- Border phân cách phía trên
- Link đến trang xác minh chính thức: http://online.gov.vn/Home/WebDetails/110913
- Hiệu ứng hover (opacity giảm khi di chuột)
- Lazy loading để tối ưu hiệu suất

## Thiết kế
- Logo có chiều cao cố định: 12 (h-12)
- Width tự động để giữ tỷ lệ
- Có text mô tả bên dưới (đa ngôn ngữ)
- Hover effect: opacity-80
- Responsive trên mọi thiết bị

## Đa ngôn ngữ
Text mô tả được dịch sang 3 ngôn ngữ:
- **Tiếng Việt**: "Đã thông báo Bộ Công Thương"
- **English**: "Verified by Ministry of Industry and Trade"
- **中文**: "工贸部认证"

## Cấu trúc HTML
```html
<div class="mt-4 pt-4 border-t border-gray-300">
  <a href="http://online.gov.vn/Home/WebDetails/110913" 
     target="_blank" 
     rel="noopener noreferrer">
    <img src="/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png" 
         alt="Đã thông báo Bộ Công Thương"
         class="h-12 w-auto object-contain"
         loading="lazy" />
  </a>
  <p class="text-xs text-gray-500 mt-2">
    Đã thông báo Bộ Công Thương
  </p>
</div>
```

## Lợi ích
✅ Tăng độ tin cậy cho khách hàng
✅ Tuân thủ quy định pháp luật về TMĐT
✅ Cải thiện SEO và uy tín thương hiệu
✅ Hiển thị chuyên nghiệp, phù hợp với Apple-style design
✅ Hỗ trợ đa ngôn ngữ

## Files đã sửa đổi
1. `src/layouts/BaseLayout.astro` - Thêm section logo xác nhận BCT vào footer

## File logo
- Path: `/public/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png`
- Size: 8.7 KB
- Format: PNG với nền trong suốt

## Ngày hoàn thành
25/02/2026
