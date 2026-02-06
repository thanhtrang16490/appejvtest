# Social Media & Zalo SEO Optimization

## Tổng quan
Website APPE JV đã được tối ưu cho chia sẻ trên các nền tảng mạng xã hội phổ biến tại Việt Nam.

## Nền tảng được tối ưu

### 1. Facebook
✅ **Open Graph Tags**:
- `og:type`: website
- `og:url`: https://appejv.app
- `og:title`: APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản chất lượng cao
- `og:description`: Chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao...
- `og:image`: /og-image.png (1200x630px)
- `og:image:width`: 1200
- `og:image:height`: 630
- `og:image:type`: image/png
- `og:locale`: vi_VN
- `og:site_name`: APPE JV Việt Nam
- `fb:app_id`: YOUR_FACEBOOK_APP_ID (cần cập nhật)

**Kích thước hình ảnh tối ưu**:
- Recommended: 1200 x 630 pixels
- Minimum: 600 x 315 pixels
- Aspect ratio: 1.91:1

### 2. Zalo
✅ **Zalo Open Graph Tags**:
- `zalo:app_id`: YOUR_ZALO_APP_ID (cần đăng ký)
- `zalo:title`: APPE JV Việt Nam - Thức ăn chăn nuôi chất lượng cao
- `zalo:description`: Chuyên sản xuất thức ăn heo, gia cầm, thủy sản. Liên hệ: 0351 3595 202
- `zalo:image`: /zalo-og-image.png (1200x630px, tối ưu cho Zalo)
- `zalo:url`: https://appejv.app

**Đặc điểm Zalo**:
- Ưu tiên hình ảnh sáng màu, tương phản cao
- Hiển thị tốt trên mobile
- Hỗ trợ deep linking
- Tích hợp với Zalo Mini App (nếu có)

**Kích thước hình ảnh**:
- Recommended: 1200 x 630 pixels
- Format: PNG hoặc JPG
- File size: < 1MB
- Màu sắc: Sáng, tương phản cao

### 3. Twitter / X
✅ **Twitter Card Tags**:
- `twitter:card`: summary_large_image
- `twitter:site`: @appejv
- `twitter:creator`: @appejv
- `twitter:title`: APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản
- `twitter:description`: Chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao
- `twitter:image`: /og-image.png

**Kích thước hình ảnh**:
- Summary Card: 120 x 120 pixels (minimum)
- Large Image: 1200 x 628 pixels (recommended)
- Aspect ratio: 2:1

### 4. WhatsApp
✅ **WhatsApp Preview**:
- Sử dụng Open Graph tags
- `og:image`: 1200 x 630 pixels
- `og:title`: Tối đa 65 ký tự
- `og:description`: Tối đa 200 ký tự

### 5. Telegram
✅ **Telegram Preview**:
- Sử dụng Open Graph tags
- `og:image`: 1200 x 630 pixels
- Hỗ trợ instant view
- Preview tự động

### 6. LinkedIn
✅ **LinkedIn Preview**:
- Sử dụng Open Graph tags
- `og:image`: 1200 x 627 pixels (recommended)
- Aspect ratio: 1.91:1

## Hình ảnh OG (Open Graph Images)

### Tạo hình ảnh OG:
1. Mở file `scripts/generate-og-image.html` trong browser
2. Chọn loại hình ảnh cần tạo:
   - **General OG Image**: Cho Facebook, Twitter, LinkedIn
   - **Zalo Image**: Tối ưu cho Zalo (màu sáng hơn)
   - **Facebook Image**: Tối ưu cho Facebook (tương phản cao)
3. Download và đổi tên:
   - `og-image.png` - Hình ảnh chung
   - `zalo-og-image.png` - Cho Zalo
   - `facebook-og-image.png` - Cho Facebook
4. Copy vào thư mục `public/`

### Yêu cầu hình ảnh:
- **Kích thước**: 1200 x 630 pixels (tỷ lệ 1.91:1)
- **Format**: PNG hoặc JPG
- **File size**: < 1MB (khuyến nghị < 300KB)
- **Màu sắc**: RGB, không CMYK
- **Nội dung**:
  - Logo rõ ràng
  - Text dễ đọc (font size lớn)
  - Tương phản cao
  - Không có text quá nhỏ
  - Safe zone: 40px từ mép

### Checklist hình ảnh OG:
- [ ] Logo APPE JV hiển thị rõ ràng
- [ ] Tên công ty dễ đọc
- [ ] Màu thương hiệu (#175ead, #2575be)
- [ ] Thông tin liên hệ (phone/website)
- [ ] Kích thước đúng 1200x630px
- [ ] File size < 1MB
- [ ] Test trên nhiều nền tảng

## Component chia sẻ mạng xã hội

### SocialShare Component
File: `components/social/SocialShare.tsx`

**Tính năng**:
- Native share API (mobile)
- Facebook share
- Zalo share
- Telegram share
- WhatsApp share
- Copy link

**Sử dụng**:
```tsx
import { SocialShare } from '@/components/social/SocialShare'

<SocialShare 
  url="https://appejv.app/san-pham"
  title="Danh mục sản phẩm APPE JV"
  description="Khám phá thức ăn chăn nuôi chất lượng cao"
/>
```

## Testing & Validation

### 1. Facebook Debugger
URL: https://developers.facebook.com/tools/debug/

**Cách test**:
1. Nhập URL: https://appejv.app
2. Click "Debug"
3. Kiểm tra preview
4. Click "Scrape Again" nếu cần refresh cache

**Lưu ý**:
- Facebook cache OG tags, cần scrape lại sau khi update
- Kiểm tra warnings và errors
- Test cả desktop và mobile view

### 2. Twitter Card Validator
URL: https://cards-dev.twitter.com/validator

**Cách test**:
1. Nhập URL: https://appejv.app
2. Click "Preview card"
3. Kiểm tra preview

### 3. LinkedIn Post Inspector
URL: https://www.linkedin.com/post-inspector/

**Cách test**:
1. Nhập URL: https://appejv.app
2. Click "Inspect"
3. Kiểm tra preview

### 4. Zalo Testing
**Cách test**:
1. Gửi link qua Zalo chat (test account)
2. Kiểm tra preview hiển thị
3. Click vào link để test deep linking

**Lưu ý Zalo**:
- Cần đăng ký Zalo App ID
- Test trên cả Zalo mobile và Zalo PC
- Kiểm tra preview trên chat và timeline

### 5. WhatsApp Testing
**Cách test**:
1. Gửi link qua WhatsApp (test account)
2. Kiểm tra preview
3. Test trên cả iOS và Android

### 6. Manual Testing
**Checklist**:
- [ ] Facebook: Share link, kiểm tra preview
- [ ] Zalo: Gửi link qua chat, kiểm tra preview
- [ ] Twitter: Tweet link, kiểm tra card
- [ ] LinkedIn: Post link, kiểm tra preview
- [ ] WhatsApp: Gửi link, kiểm tra preview
- [ ] Telegram: Gửi link, kiểm tra instant view
- [ ] Messenger: Gửi link, kiểm tra preview

## Đăng ký App IDs

### Facebook App ID
1. Truy cập: https://developers.facebook.com/
2. Tạo app mới
3. Copy App ID
4. Cập nhật trong `app/layout.tsx`:
   ```tsx
   <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
   ```

### Zalo App ID
1. Truy cập: https://developers.zalo.me/
2. Đăng ký tài khoản developer
3. Tạo app mới
4. Copy App ID
5. Cập nhật trong `app/layout.tsx`:
   ```tsx
   <meta property="zalo:app_id" content="YOUR_ZALO_APP_ID" />
   ```

### Twitter Username
1. Tạo Twitter account: @appejv
2. Cập nhật trong metadata:
   ```tsx
   twitter: {
     site: "@appejv",
     creator: "@appejv",
   }
   ```

## Best Practices

### 1. Hình ảnh
- ✅ Sử dụng hình ảnh chất lượng cao
- ✅ Tối ưu file size (< 1MB)
- ✅ Tương phản cao, dễ đọc
- ✅ Logo rõ ràng
- ✅ Text không quá nhỏ
- ❌ Tránh hình ảnh mờ, pixel
- ❌ Tránh text quá nhiều
- ❌ Tránh màu sắc quá tối

### 2. Text
- ✅ Title: 60-90 ký tự
- ✅ Description: 150-200 ký tự
- ✅ Ngắn gọn, súc tích
- ✅ Call-to-action rõ ràng
- ✅ Bao gồm keywords
- ❌ Tránh text quá dài
- ❌ Tránh spam keywords

### 3. URLs
- ✅ Sử dụng HTTPS
- ✅ Clean URLs
- ✅ Canonical URLs
- ✅ UTM parameters cho tracking
- ❌ Tránh URLs quá dài
- ❌ Tránh special characters

### 4. Testing
- ✅ Test trên nhiều nền tảng
- ✅ Test cả mobile và desktop
- ✅ Refresh cache sau khi update
- ✅ Monitor analytics
- ❌ Không skip testing
- ❌ Không assume cache cleared

## UTM Parameters cho Tracking

### Campaign tracking:
```
https://appejv.app?utm_source=facebook&utm_medium=social&utm_campaign=product_launch

https://appejv.app?utm_source=zalo&utm_medium=social&utm_campaign=product_launch

https://appejv.app?utm_source=telegram&utm_medium=social&utm_campaign=product_launch
```

### Sử dụng với SocialShare:
```tsx
<SocialShare 
  url="https://appejv.app?utm_source=facebook&utm_medium=social"
  title="APPE JV Products"
/>
```

## Analytics & Monitoring

### Metrics to track:
- Social shares count
- Click-through rate (CTR)
- Engagement rate
- Referral traffic
- Conversion from social

### Tools:
- Google Analytics 4
- Facebook Pixel
- Zalo Analytics (if available)
- Custom tracking events

## Troubleshooting

### Preview không hiển thị:
1. Kiểm tra OG tags trong HTML source
2. Validate với debugging tools
3. Clear cache (Facebook Debugger)
4. Kiểm tra image URL accessible
5. Verify image size và format

### Hình ảnh bị crop:
1. Kiểm tra aspect ratio (1.91:1)
2. Sử dụng safe zone (40px margin)
3. Test trên nhiều nền tảng
4. Adjust image composition

### Zalo không hiển thị preview:
1. Kiểm tra Zalo App ID
2. Verify zalo:* meta tags
3. Test với Zalo test account
4. Kiểm tra image format và size
5. Contact Zalo support nếu cần

---

**Last updated**: 2026-02-06
**Maintained by**: APPE JV Development Team
