# SEO Optimization - APPE JV Web

## Tổng quan
Đã tối ưu SEO cho appejv-web dựa trên cấu trúc SEO tốt của appejv-app.

## Các tối ưu đã thực hiện

### 1. Meta Tags (BaseLayout.astro)
✅ **Basic Meta Tags**
- Title với template động
- Description tùy chỉnh cho từng trang
- Keywords động
- Author, robots, canonical URL

✅ **Open Graph (Facebook, Zalo)**
- og:type, og:url, og:title, og:description
- og:image với kích thước chuẩn (1200x630)
- og:site_name, og:locale
- Zalo-specific tags

✅ **Twitter Cards**
- twitter:card (summary_large_image)
- twitter:title, twitter:description, twitter:image
- twitter:creator, twitter:site

✅ **Mobile & PWA**
- theme-color
- apple-mobile-web-app tags
- mobile-web-app-capable
- msapplication tags
- Format detection (phone, email, address)

### 2. Structured Data (Schema.org)
✅ **Organization Schema**
```json
{
  "@type": "Organization",
  "name": "APPE JV Việt Nam",
  "foundingDate": "2008",
  "address": {...},
  "contactPoint": {...}
}
```

✅ **Website Schema**
```json
{
  "@type": "WebSite",
  "name": "APPE JV Việt Nam",
  "publisher": {...}
}
```

### 3. SEO Files
✅ **robots.txt**
- Allow all major search engines
- Sitemap reference
- Crawl-delay configuration
- Disallow private areas

✅ **sitemap.xml**
- Homepage (priority 1.0)
- About page (priority 0.8)
- Products page (priority 0.9)
- Contact page (priority 0.7)
- Image sitemap included
- Last modified dates

### 4. Page-specific SEO

#### Trang chủ (/)
- Title: "APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản chất lượng cao"
- Keywords: 13 từ khóa chính
- Canonical: /

#### Giới thiệu (/gioi-thieu)
- Title: "Giới thiệu - APPE JV Việt Nam | Thức ăn chăn nuôi chất lượng cao"
- Keywords: Tập trung vào lịch sử, tầm nhìn, sứ mệnh
- Canonical: /gioi-thieu

#### Sản phẩm (/san-pham)
- Title: "Sản phẩm - APPE JV | Thức ăn heo, gia cầm, thủy sản"
- Keywords: Pig feed, poultry feed, fish feed
- Canonical: /san-pham

#### Liên hệ (/lien-he)
- Title: "Liên hệ - APPE JV Việt Nam | Tư vấn thức ăn chăn nuôi"
- Keywords: Hotline, địa chỉ, email, hỗ trợ
- Canonical: /lien-he

### 5. Technical SEO
✅ **Performance**
- Preconnect to external domains
- Optimized meta tags loading

✅ **Accessibility**
- Semantic HTML
- Alt text for images
- ARIA labels

✅ **Mobile-First**
- Responsive viewport
- Touch-friendly navigation
- Mobile app capabilities

## Keywords Strategy

### Primary Keywords
1. thức ăn chăn nuôi
2. thức ăn heo
3. thức ăn gia cầm
4. thức ăn thủy sản
5. APPE JV
6. APPE Việt Nam

### Secondary Keywords
1. pig feed
2. poultry feed
3. fish feed
4. chăn nuôi Hà Nam
5. thức ăn chất lượng cao
6. A Group
7. xuất khẩu thức ăn chăn nuôi

### Long-tail Keywords
1. công ty thức ăn chăn nuôi Hà Nam
2. thức ăn heo chất lượng cao
3. thức ăn gia cầm công nghệ tiên tiến
4. thức ăn thủy sản xuất khẩu
5. tư vấn thức ăn chăn nuôi

## Next Steps (Khuyến nghị)

### 1. Content Marketing
- [ ] Tạo blog về chăn nuôi
- [ ] Hướng dẫn sử dụng sản phẩm
- [ ] Case studies khách hàng
- [ ] Video tutorials

### 2. Local SEO
- [ ] Google My Business
- [ ] Local citations
- [ ] Customer reviews
- [ ] Local keywords

### 3. Technical Improvements
- [ ] Add breadcrumbs schema
- [ ] Product schema for san-pham pages
- [ ] FAQ schema
- [ ] Review schema

### 4. Analytics & Monitoring
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Bing Webmaster Tools
- [ ] Performance monitoring

### 5. Link Building
- [ ] Industry directories
- [ ] Partner websites
- [ ] Social media profiles
- [ ] Press releases

## Testing Checklist

### SEO Tools
- [ ] Google Search Console verification
- [ ] Google PageSpeed Insights
- [ ] Mobile-Friendly Test
- [ ] Rich Results Test
- [ ] Structured Data Testing Tool

### Social Media
- [ ] Facebook Sharing Debugger
- [ ] Twitter Card Validator
- [ ] LinkedIn Post Inspector

### Technical
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Canonical URLs correct
- [ ] No duplicate content
- [ ] HTTPS enabled
- [ ] 404 pages handled

## Performance Metrics

### Target Scores
- Google PageSpeed: 90+
- GTmetrix: A grade
- Core Web Vitals: All green
- Mobile usability: 100%

### Current Status
- ✅ Meta tags: Complete
- ✅ Structured data: Complete
- ✅ robots.txt: Complete
- ✅ sitemap.xml: Complete
- ⏳ Analytics: Pending setup
- ⏳ Search Console: Pending verification

## Contact for SEO Support
- Email: info@appe.com.vn
- Phone: +84 3513 595 202/203
- Website: https://appejv.app

---
Last updated: 2026-02-09
