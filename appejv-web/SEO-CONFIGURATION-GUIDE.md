# Hướng dẫn Cấu hình SEO - APPE JV Website

## 🔧 CÁC BƯỚC CẤU HÌNH

### 1. TẠO OG IMAGE (Bắt buộc)

Tạo file `/public/og-image.png` với thông số:

**Kích thước:** 1200x630px  
**Format:** PNG  
**Dung lượng:** < 300KB  
**Nội dung:**
- Logo APPE JV (center)
- Tagline: "Giải pháp dinh dưỡng chuyên nghiệp cho chăn nuôi"
- Background: Gradient #175ead
- Text: White, bold, readable

**Tools để tạo:**
- Canva: https://www.canva.com/
- Figma: https://www.figma.com/
- Photoshop
- Online OG Image Generator

**Template gợi ý:**
```
┌─────────────────────────────────────┐
│                                     │
│         [APPE JV LOGO]              │
│                                     │
│   Giải pháp dinh dưỡng chuyên nghiệp│
│        cho chăn nuôi                │
│                                     │
│   🐷 Pig Feed | 🐔 Poultry | 🐟 Fish│
│                                     │
└─────────────────────────────────────┘
```

---

### 2. GOOGLE ANALYTICS 4

**Bước 1:** Tạo tài khoản Google Analytics
- Truy cập: https://analytics.google.com/
- Tạo property mới
- Chọn "Web" platform
- Lấy Measurement ID (dạng: G-XXXXXXXXXX)

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```javascript
// Dòng ~150
gtag('config', 'G-XXXXXXXXXX', {
```

Thay `G-XXXXXXXXXX` bằng Measurement ID thực tế.

**Bước 3:** Verify
- Deploy website
- Truy cập Google Analytics
- Vào Realtime → Overview
- Mở website và kiểm tra có hiển thị visitor không

---

### 3. FACEBOOK PIXEL

**Bước 1:** Tạo Facebook Pixel
- Truy cập: https://business.facebook.com/
- Events Manager → Pixels
- Create a Pixel
- Lấy Pixel ID (dạng: 1234567890)

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```javascript
// Dòng ~160
fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
```

Và:

```html
// Dòng ~170
<img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_FACEBOOK_PIXEL_ID&ev=PageView&noscript=1"
/>
```

Thay `YOUR_FACEBOOK_PIXEL_ID` bằng Pixel ID thực tế.

**Bước 3:** Verify
- Cài Facebook Pixel Helper extension
- Mở website
- Kiểm tra extension có hiển thị pixel không

---

### 4. ZALO TRACKING

**Bước 1:** Đăng ký Zalo for Business
- Truy cập: https://developers.zalo.me/
- Tạo app mới
- Lấy App ID

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```html
// Dòng ~130
<meta property="zalo:app_id" content="YOUR_ZALO_APP_ID" />
```

Thay `YOUR_ZALO_APP_ID` bằng App ID thực tế.

**Bước 3:** Test Zalo sharing
- Share link website lên Zalo
- Kiểm tra preview có hiển thị đúng không

---

### 5. GOOGLE SEARCH CONSOLE

**Bước 1:** Verify ownership
- Truy cập: https://search.google.com/search-console
- Add property: https://appejv.app
- Chọn phương thức verify: HTML tag

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```html
// Dòng ~145
<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
```

Thay `YOUR_GOOGLE_VERIFICATION_CODE` bằng verification code.

**Bước 3:** Submit sitemap
- Vào Search Console
- Sitemaps → Add new sitemap
- Nhập: https://appejv.app/sitemap.xml
- Submit

---

### 6. BING WEBMASTER TOOLS

**Bước 1:** Verify ownership
- Truy cập: https://www.bing.com/webmasters
- Add site: https://appejv.app
- Chọn phương thức verify: Meta tag

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```html
// Dòng ~148
<meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
```

**Bước 3:** Submit sitemap
- Vào Bing Webmaster
- Sitemaps → Submit sitemap
- Nhập: https://appejv.app/sitemap.xml

---

### 7. FACEBOOK DOMAIN VERIFICATION

**Bước 1:** Get verification code
- Truy cập: https://business.facebook.com/
- Business Settings → Brand Safety → Domains
- Add domain: appejv.app
- Lấy verification code

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```html
// Dòng ~143
<meta name="facebook-domain-verification" content="YOUR_FB_DOMAIN_VERIFICATION" />
```

---

### 8. HOTJAR (Optional)

**Bước 1:** Tạo tài khoản Hotjar
- Truy cập: https://www.hotjar.com/
- Create site
- Lấy Hotjar ID

**Bước 2:** Cập nhật code
Mở file `src/layouts/BaseLayout.astro`, tìm và thay:

```javascript
// Dòng ~180
h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
```

Thay `YOUR_HOTJAR_ID` bằng Hotjar ID thực tế.

---

## 📊 KIỂM TRA SAU KHI CẤU HÌNH

### 1. Test SEO
```bash
# Google PageSpeed Insights
https://pagespeed.web.dev/?url=https://appejv.app

# Mobile-Friendly Test
https://search.google.com/test/mobile-friendly?url=https://appejv.app

# Rich Results Test
https://search.google.com/test/rich-results?url=https://appejv.app
```

### 2. Test Social Sharing
```bash
# Facebook Debugger
https://developers.facebook.com/tools/debug/?q=https://appejv.app

# Twitter Card Validator
https://cards-dev.twitter.com/validator

# LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/
```

### 3. Test Structured Data
```bash
# Schema Markup Validator
https://validator.schema.org/#url=https://appejv.app

# Google Rich Results Test
https://search.google.com/test/rich-results?url=https://appejv.app
```

### 4. Test Performance
```bash
# GTmetrix
https://gtmetrix.com/?url=https://appejv.app

# WebPageTest
https://www.webpagetest.org/?url=https://appejv.app

# Lighthouse (Chrome DevTools)
F12 → Lighthouse → Generate report
```

---

## 🎯 CHECKLIST HOÀN THÀNH

- [ ] Tạo og-image.png (1200x630px)
- [ ] Cấu hình Google Analytics 4
- [ ] Cấu hình Facebook Pixel
- [ ] Cấu hình Zalo App ID
- [ ] Verify Google Search Console
- [ ] Verify Bing Webmaster Tools
- [ ] Verify Facebook Domain
- [ ] Submit sitemap to Google
- [ ] Submit sitemap to Bing
- [ ] Test social sharing (Facebook, Twitter, Zalo)
- [ ] Test structured data
- [ ] Test mobile-friendly
- [ ] Test page speed
- [ ] Cấu hình Hotjar (optional)

---

## 📝 GHI CHÚ QUAN TRỌNG

### Domain Configuration
Đảm bảo domain đã được cấu hình đúng:
- DNS records đã trỏ đúng
- SSL certificate đã active
- HTTPS redirect đã enable
- www redirect đã setup (nếu cần)

### Environment Variables
Nếu muốn dùng environment variables thay vì hardcode:

1. Tạo file `.env`:
```bash
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_FB_PIXEL_ID=1234567890
PUBLIC_ZALO_APP_ID=your-zalo-app-id
PUBLIC_HOTJAR_ID=1234567
```

2. Cập nhật BaseLayout.astro:
```javascript
const GA_ID = import.meta.env.PUBLIC_GA_ID
const FB_PIXEL_ID = import.meta.env.PUBLIC_FB_PIXEL_ID
const ZALO_APP_ID = import.meta.env.PUBLIC_ZALO_APP_ID
const HOTJAR_ID = import.meta.env.PUBLIC_HOTJAR_ID
```

### Monitoring
Sau khi deploy, theo dõi:
- Google Analytics: Daily visitors, bounce rate, conversions
- Search Console: Impressions, clicks, CTR, position
- Facebook Pixel: Events, conversions
- Page Speed: Core Web Vitals

### Maintenance
- Cập nhật sitemap khi có sản phẩm mới (tự động)
- Kiểm tra broken links hàng tháng
- Review analytics data hàng tuần
- Update structured data khi có thay đổi

---

## 🆘 TROUBLESHOOTING

### Google Analytics không tracking
- Kiểm tra Measurement ID đúng chưa
- Kiểm tra ad blocker
- Kiểm tra console có lỗi không
- Đợi 24-48h để data hiển thị

### Facebook Pixel không fire
- Kiểm tra Pixel ID đúng chưa
- Cài Facebook Pixel Helper extension
- Kiểm tra console có lỗi không
- Test với Facebook Event Testing tool

### Sitemap không index
- Kiểm tra sitemap.xml accessible
- Kiểm tra format XML đúng
- Submit lại trong Search Console
- Đợi vài ngày để Google crawl

### Social sharing không hiển thị image
- Kiểm tra og-image.png tồn tại
- Kiểm tra kích thước 1200x630px
- Kiểm tra URL absolute (https://)
- Clear cache với Facebook Debugger

---

## 📞 HỖ TRỢ

Nếu cần hỗ trợ:
- Email: info@appe.com.vn
- Phone: +84 3513 595 202/203
- Documentation: Xem file SEO-OPTIMIZATION-COMPLETE.md

---

**Cập nhật lần cuối:** 2026-02-18  
**Version:** 1.0.0
