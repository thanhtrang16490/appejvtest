# Hoàn thành bổ sung các trang mới

## Tổng quan
Đã bổ sung 4 trang mới theo đề xuất trong WEBSITE-IMPROVEMENT-PLAN.md, tất cả đều theo phong cách Apple hiện đại với thiết kế clean, minimal và responsive.

---

## 1. Trang Đại lý (/dai-ly)

### Tính năng
- ✅ Hero section với search bar tìm đại lý
- ✅ Stats: 150+ đại lý, 63 tỉnh/thành phố, 24/7 hỗ trợ
- ✅ Filter theo khu vực (Miền Bắc/Trung/Nam)
- ✅ Realtime search theo tên, tỉnh/thành phố
- ✅ Danh sách đại lý với thông tin đầy đủ (địa chỉ, phone, email)
- ✅ Benefits section: Tư vấn trực tiếp, hỗ trợ kỹ thuật, bảo hành địa phương
- ✅ CTA "Trở thành đại lý"
- ✅ Responsive mobile & desktop

### Dữ liệu mẫu
- 6 đại lý mẫu (Hà Nội, Hải Phòng, Đà Nẵng, TP.HCM, Cần Thơ, Nghệ An)
- Cần thay thế bằng dữ liệu thực từ database

### SEO
- Title: "Tìm đại lý APPE gần bạn - 150+ đại lý toàn quốc"
- Meta description tối ưu
- Keywords: đại lý APPE, đại lý thức ăn chăn nuôi, etc.

---

## 2. Trang FAQ (/cau-hoi-thuong-gap)

### Tính năng
- ✅ Hero section với search bar
- ✅ Category filter pills (Tất cả, Sản phẩm, Đặt hàng, Thanh toán, Vận chuyển, Bảo hành, Kỹ thuật)
- ✅ Accordion design cho Q&A
- ✅ Realtime search trong câu hỏi và câu trả lời
- ✅ 30 câu hỏi thường gặp (6 categories)
- ✅ CTA "Không tìm thấy câu trả lời?" với liên hệ
- ✅ Responsive mobile & desktop

### Nội dung
- Sản phẩm: 4 câu hỏi
- Đặt hàng: 4 câu hỏi
- Thanh toán: 3 câu hỏi
- Vận chuyển: 4 câu hỏi
- Bảo hành: 3 câu hỏi
- Kỹ thuật: 4 câu hỏi

### SEO
- Title: "Câu hỏi thường gặp - APPE JV Việt Nam"
- Meta description tối ưu
- Keywords: FAQ APPE, câu hỏi thường gặp, etc.

---

## 3. Trang Tải liệu (/tai-lieu)

### Tính năng
- ✅ Hero section với search bar
- ✅ Category filter (Tất cả, Catalog, Brochure, Technical, Manual, Certificate)
- ✅ Grid layout 3 columns
- ✅ Document cards với thumbnail, category, format, size
- ✅ Download counter
- ✅ Realtime search theo title và description
- ✅ CTA "Cần hỗ trợ thêm?"
- ✅ Responsive mobile & desktop

### Dữ liệu mẫu
- 10 tài liệu mẫu:
  - 2 Catalog (Sản phẩm 2024, Pig Feed)
  - 1 Brochure (Giới thiệu công ty)
  - 2 Technical (Bảo quản, Quy trình chăn nuôi)
  - 2 Manual (Pig Feed, Poultry Feed)
  - 3 Certificate (ISO, HACCP, GMP)
- Cần thay thế bằng file thực và link download

### SEO
- Title: "Tải tài liệu - Catalog, Brochure, Hướng dẫn kỹ thuật | APPE JV"
- Meta description tối ưu
- Keywords: tải catalog APPE, brochure, etc.

---

## 4. Trang Tin tức (/tin-tuc)

### Tính năng
- ✅ Hero section
- ✅ Featured post (large card)
- ✅ Category filter (Tất cả, Tin công ty, Sản phẩm mới, Hướng dẫn, Xu hướng ngành)
- ✅ Grid layout 3 columns cho regular posts
- ✅ Post cards với image, category, title, excerpt, author, date
- ✅ Pagination (placeholder)
- ✅ Newsletter signup CTA
- ✅ Responsive mobile & desktop

### Dữ liệu mẫu
- 6 bài viết mẫu:
  - 1 featured post (Pig Feed Premium 2024)
  - 5 regular posts (mix categories)
- Cần tích hợp CMS hoặc Content Collections

### SEO
- Title: "Tin tức & Blog - APPE JV Việt Nam"
- Meta description tối ưu
- Keywords: tin tức APPE, blog chăn nuôi, etc.

### Note
- Cần tạo trang chi tiết bài viết: /tin-tuc/[slug]
- Cần setup CMS hoặc Astro Content Collections

---

## 5. Cập nhật Navigation

### Header (Desktop & Mobile)
- ✅ Thêm link "Đại lý"
- ✅ Thêm link "Tin tức"
- ✅ Thứ tự: Trang chủ → Giới thiệu → Sản phẩm → Đại lý → Tin tức → Liên hệ → Đăng nhập

### Footer
- ✅ Cập nhật section "Hỗ trợ":
  - Tìm đại lý
  - FAQ
  - Tải tài liệu
  - Tin tức

---

## 6. Cập nhật Sitemap

### Thêm pages mới
- ✅ /dai-ly (priority: 0.9, changefreq: weekly)
- ✅ /tin-tuc (priority: 0.8, changefreq: daily)
- ✅ /cau-hoi-thuong-gap (priority: 0.7, changefreq: weekly)
- ✅ /tai-lieu (priority: 0.7, changefreq: weekly)
- ✅ /chinh-sach-bao-mat (priority: 0.3, changefreq: yearly)
- ✅ /dieu-khoan-su-dung (priority: 0.3, changefreq: yearly)
- ✅ /chinh-sach-cookie (priority: 0.3, changefreq: yearly)

---

## Design Consistency

### Typography
- Headings: 4xl-6xl (hero), 2xl-3xl (sections), 17px (cards)
- Body: 15px (main), 13px (small), 11px (meta)
- Font weight: semibold (headings), normal (body)

### Colors
- Brand: #175ead (blue)
- Background: #f5f5f7 (light gray)
- Text: gray-900 (dark), gray-600 (medium), gray-500 (light)
- Hover: gray-100, blue-700

### Spacing
- Max-width: 980px (main), 692px (content)
- Padding: pt-24 md:pt-32 (hero), py-16 md:py-20 (sections)
- Gap: 4-6 (grid), 3-4 (flex)

### Components
- Rounded: rounded-xl (buttons), rounded-2xl (cards), rounded-full (pills)
- Transitions: transition-all, duration-200
- Hover effects: bg-gray-100, text-blue-600

---

## Next Steps

### Phase 1 (Immediate)
1. **Thay dữ liệu mẫu bằng dữ liệu thực**:
   - Đại lý: Import 150+ đại lý từ database
   - Tài liệu: Upload files thực và setup download links
   - Tin tức: Viết 10-20 bài viết đầu tiên

2. **Tạo trang chi tiết bài viết**:
   - /tin-tuc/[slug].astro
   - Layout: hero image, breadcrumb, content, author, related posts
   - Setup Astro Content Collections

3. **Tích hợp Google Maps**:
   - Thêm map vào trang Đại lý
   - Pins cho từng đại lý
   - Directions link

### Phase 2 (Short-term)
1. **Tối ưu SEO**:
   - Add structured data (FAQPage, Article, Organization)
   - Optimize images (WebP, lazy loading)
   - Add breadcrumbs

2. **Analytics**:
   - Track page views
   - Track downloads
   - Track dealer searches
   - Track form submissions

3. **Content**:
   - Viết thêm 20-30 bài blog
   - Tạo 10-15 tài liệu kỹ thuật
   - Collect dealer testimonials

### Phase 3 (Long-term)
1. **Advanced features**:
   - Dealer portal (login, manage info)
   - Blog comments
   - Newsletter automation
   - Social sharing

2. **Multilingual**:
   - English version
   - i18n setup

---

## Files Created

### Pages
- `appejv-web/src/pages/dai-ly.astro` (Dealer locator)
- `appejv-web/src/pages/cau-hoi-thuong-gap.astro` (FAQ)
- `appejv-web/src/pages/tai-lieu.astro` (Downloads)
- `appejv-web/src/pages/tin-tuc/index.astro` (Blog listing)

### Updated
- `appejv-web/src/layouts/BaseLayout.astro` (Header & Footer navigation)
- `appejv-web/src/pages/sitemap.xml.ts` (Added new pages)

### Documentation
- `appejv-web/WEBSITE-IMPROVEMENT-PLAN.md` (Improvement roadmap)
- `appejv-web/NEW-PAGES-COMPLETE.md` (This file)

---

## Testing Checklist

### Desktop
- [ ] All pages load correctly
- [ ] Navigation works (header & footer)
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Hover effects work
- [ ] Links work
- [ ] Forms work (newsletter)

### Mobile
- [ ] Responsive layout
- [ ] Touch targets 44x44px
- [ ] Mobile menu works
- [ ] Search works
- [ ] Filter pills scroll
- [ ] Cards stack properly

### SEO
- [ ] Meta tags present
- [ ] Canonical URLs correct
- [ ] Sitemap includes new pages
- [ ] Structured data valid
- [ ] Images have alt text

### Performance
- [ ] Page load < 3s
- [ ] No console errors
- [ ] No broken links
- [ ] Images optimized

---

## Deployment

### Before deploying
1. Test all pages locally
2. Check responsive design
3. Validate HTML/CSS
4. Test search/filter functionality
5. Check all links

### After deploying
1. Submit sitemap to Google Search Console
2. Test on production
3. Monitor analytics
4. Check for errors

---

**Ngày hoàn thành**: 25/02/2026  
**Phiên bản**: 1.0  
**Status**: ✅ Complete - Ready for data integration
