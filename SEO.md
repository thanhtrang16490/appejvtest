# SEO Optimization - APPE JV

## Tổng quan
Website APPE JV đã được tối ưu toàn diện cho SEO với các best practices của Next.js 15 và Google Search.

## URL chính thức
- **Production**: https://appejv.app
- **Sitemap**: https://appejv.app/sitemap.xml
- **Robots**: https://appejv.app/robots.txt

## Các tối ưu đã thực hiện

### 1. Metadata & Meta Tags
✅ **Root Layout** (`app/layout.tsx`):
- Title template với brand name
- Description tối ưu với keywords
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URLs
- Theme color cho PWA
- Viewport settings
- Format detection (phone, email, address)

✅ **Keywords chính**:
- thức ăn chăn nuôi
- thức ăn heo / pig feed
- thức ăn gia cầm / poultry feed
- thức ăn thủy sản / fish feed
- APPE JV Việt Nam
- Hà Nam

### 2. Structured Data (JSON-LD)
✅ **Organization Schema**:
- Tên công ty, logo, địa chỉ
- Thông tin liên hệ (phone, email)
- Năm thành lập (2008)
- Social profiles

✅ **Website Schema**:
- Search action
- Site navigation

✅ **Product Catalog Schema**:
- ItemList cho danh mục sản phẩm
- Product items với category

✅ **Breadcrumb Schema**:
- Navigation hierarchy

### 3. Sitemap & Robots
✅ **Dynamic Sitemap** (`app/sitemap.ts`):
- Homepage (priority: 1.0, weekly)
- Product catalogue (priority: 0.9, daily)
- Auth pages (priority: 0.5, monthly)

✅ **Robots.txt** (`app/robots.ts`):
- Allow public pages
- Disallow private routes (/customer, /sales, /auth, /api)
- Sitemap reference

### 4. Performance & Core Web Vitals
✅ **Image Optimization**:
- Next.js Image component
- SVG logo với fallback PNG
- Responsive images
- Lazy loading

✅ **Font Optimization**:
- Google Fonts với `next/font`
- Font subsetting (latin)
- Font display swap

### 5. Mobile-First & Responsive
✅ **Viewport**:
- Mobile-first design
- Responsive breakpoints
- Touch-friendly UI

✅ **PWA**:
- manifest.json
- Theme color
- App icons (192x192, 512x512)
- Apple touch icons

### 6. Content Optimization
✅ **Semantic HTML**:
- Proper heading hierarchy (h1, h2, h3)
- Semantic tags (header, nav, main, footer)
- Alt text cho images

✅ **Internal Linking**:
- Clear navigation structure
- Breadcrumbs
- Related content links

### 7. Technical SEO
✅ **URL Structure**:
- Clean, readable URLs
- Vietnamese slugs (/san-pham)
- No trailing slashes

✅ **Language**:
- lang="vi" attribute
- Vietnamese content
- Proper encoding (UTF-8)

✅ **Security**:
- HTTPS ready
- Security headers
- CSRF protection

## Checklist triển khai

### Trước khi deploy:
- [ ] Cập nhật domain trong metadata (appejv.app)
- [ ] Generate PWA icons (192x192, 512x512, 180x180)
- [ ] Test sitemap: https://appejv.app/sitemap.xml
- [ ] Test robots: https://appejv.app/robots.txt
- [ ] Verify structured data với [Google Rich Results Test](https://search.google.com/test/rich-results)

### Sau khi deploy:
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Google Search Console ownership
- [ ] Set up Google Analytics (optional)
- [ ] Monitor Core Web Vitals
- [ ] Check mobile-friendliness
- [ ] Test page speed (PageSpeed Insights)

## Google Search Console Setup

1. **Verify ownership**:
   - Add verification meta tag to `app/layout.tsx`
   - Or upload verification file to `public/`

2. **Submit sitemap**:
   ```
   https://appejv.app/sitemap.xml
   ```

3. **Request indexing** cho các trang quan trọng:
   - Homepage: https://appejv.app
   - Products: https://appejv.app/san-pham

## Monitoring & Analytics

### Recommended tools:
- **Google Search Console**: Monitor search performance
- **Google Analytics 4**: Track user behavior (optional)
- **PageSpeed Insights**: Monitor performance
- **Lighthouse**: Audit SEO, performance, accessibility

### Key metrics to track:
- Organic search traffic
- Click-through rate (CTR)
- Average position
- Core Web Vitals (LCP, FID, CLS)
- Mobile usability
- Index coverage

## Local SEO

✅ **Business Information**:
- Tên: Công ty Cổ phần APPE JV Việt Nam
- Địa chỉ: Km 50 Quốc lộ 1A, Xã Tiên Tân, TP. Phủ Lý, Hà Nam
- Phone: +84 3513 595 202/203
- Email: info@appe.com.vn

### Google My Business (recommended):
- Create/claim business listing
- Add photos, hours, services
- Collect customer reviews
- Post updates regularly

## Content Strategy

### Target keywords:
1. **Primary**:
   - thức ăn chăn nuôi
   - thức ăn heo
   - thức ăn gia cầm
   - thức ăn thủy sản

2. **Secondary**:
   - pig feed vietnam
   - poultry feed ha nam
   - fish feed supplier
   - APPE JV

3. **Long-tail**:
   - thức ăn heo chất lượng cao hà nam
   - nhà cung cấp thức ăn gia cầm
   - thức ăn thủy sản xuất khẩu

### Content recommendations:
- Blog về chăn nuôi (best practices)
- Case studies khách hàng
- Product guides
- FAQ section
- Video content

## Technical Notes

### Files structure:
```
app/
├── layout.tsx              # Root metadata
├── sitemap.ts             # Dynamic sitemap
├── robots.ts              # Dynamic robots.txt
├── structured-data.tsx    # JSON-LD schemas
├── page.tsx               # Homepage
└── san-pham/
    ├── page.tsx           # Product catalogue
    └── metadata.ts        # Page-specific metadata

public/
├── robots.txt             # Static robots (backup)
├── manifest.json          # PWA manifest
├── appejv-logo.svg        # Logo
└── favicon.svg            # Favicon
```

### Next.js SEO features used:
- Metadata API
- generateMetadata()
- Dynamic sitemap
- Dynamic robots.txt
- Image optimization
- Font optimization
- Static generation

## Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

---

**Last updated**: 2026-02-06
**Maintained by**: APPE JV Development Team
