# Kế hoạch Cải tiến Website APPE JV

## 📊 Tổng quan Tiến độ

**Ngày cập nhật**: 25/02/2026  
**Phiên bản**: 2.0  
**Trạng thái**: Phase 1 - 80% hoàn thành

### Đã hoàn thành ✅
- ✅ Trang FAQ (30 câu hỏi, 6 categories)
- ✅ Trang Tải liệu (10 tài liệu mẫu, 5 categories)
- ✅ Trang Tin tức/Blog (listing + detail, 3 bài viết mẫu)
- ✅ Trang 404 (Apple-style, với quick links)
- ✅ Google Maps integration (trang Liên hệ)
- ✅ Navigation updates (header + footer)
- ✅ Sitemap updates
- ✅ Data structure cho blog (`src/data/blog-posts.ts`)

### Đang triển khai 🚧
- Không có

### Chưa triển khai ⏳
- ⏳ Trang Tuyển dụng
- ⏳ Multilingual (English)
- ⏳ Advanced features (chatbot, newsletter automation)

### Đã loại bỏ ❌
- ❌ Trang Đại lý (theo yêu cầu tạm thời không triển khai)

---

## Tổng quan
Website hiện tại đã được redesign theo phong cách Apple hiện đại với thiết kế clean, minimal và tập trung vào sản phẩm. Tài liệu này đánh giá điểm mạnh hiện tại và đề xuất các cải tiến để nâng cao trải nghiệm người dùng và hiệu quả kinh doanh.

---

## 1. Điểm mạnh hiện tại

### Thiết kế & UX
- ✅ Thiết kế Apple-style: Clean, minimal, professional
- ✅ Responsive tốt trên mobile và desktop
- ✅ Typography chuẩn Apple (13px, 15px, 17px)
- ✅ Color scheme nhất quán (#175ead brand, #f5f5f7 background)
- ✅ Max-width hợp lý (980px main, 692px content)
- ✅ Navigation đơn giản, dễ sử dụng
- ✅ Touch targets 44x44px cho mobile

### Nội dung
- ✅ Trang chủ: Hero section, stats, features, products, CTA
- ✅ Giới thiệu: Company info, mission, values, timeline, certifications
- ✅ Sản phẩm: Listing với filter, search realtime, product detail
- ✅ Liên hệ: Form, contact methods, office info
- ✅ Chính sách: Privacy, Terms, Cookie policy

### Technical
- ✅ SEO-friendly với structured data
- ✅ Fast loading với Astro
- ✅ Clean code structure
- ✅ Git version control

---

## 2. Trang cần bổ sung

### ~~2.1 Trang Đại lý~~ (REMOVED)
**Status**: ❌ Đã loại bỏ theo yêu cầu
**Lý do**: Tạm thời không triển khai trang đại lý

~~**Nội dung đề xuất**:~~
- Hero: "Tìm đại lý APPE gần bạn" + search bar (tỉnh/thành phố)
- Map tương tác với pins đại lý (Google Maps hoặc Mapbox)
- Filter: Theo khu vực (Miền Bắc/Trung/Nam), tỉnh/thành phố
- Danh sách đại lý: Card với tên, địa chỉ, phone, email, website
- CTA: "Trở thành đại lý" button → form đăng ký
- Stats: 150+ đại lý, coverage map
- Benefits: Tại sao mua qua đại lý (tư vấn trực tiếp, hỗ trợ kỹ thuật, bảo hành địa phương)

**URL**: `/dai-ly`

### 2.2 Trang Câu hỏi thường gặp (Priority: HIGH) ✅
**Status**: ✅ HOÀN THÀNH
**URL**: `/cau-hoi-thuong-gap`
**Lý do**: Giảm support load, tăng conversion

**Nội dung đã triển khai**:
- ✅ Accordion design (Apple-style)
- ✅ Categories: Sản phẩm, Đặt hàng, Thanh toán, Vận chuyển, Bảo hành, Kỹ thuật (6 categories)
- ✅ 30 câu hỏi với nội dung đầy đủ
- ✅ Search functionality (realtime)
- ✅ Category filter pills
- ✅ CTA: "Không tìm thấy câu trả lời?" → Liên hệ + Hotline

### 2.3 Trang Tải xuống (Priority: MEDIUM) ✅
**Status**: ✅ HOÀN THÀNH
**URL**: `/tai-lieu`
**Lý do**: Hỗ trợ khách hàng và đại lý với tài liệu kỹ thuật

**Nội dung đã triển khai**:
- ✅ Categories: Catalog, Brochure, Technical, Manual, Certificate (5 categories)
- ✅ Grid layout 3 columns với gradient thumbnails
- ✅ File info: Name, size, format, category, downloads
- ✅ Download counter display
- ✅ Filter by category
- ✅ Search functionality (realtime)
- ✅ 10 tài liệu mẫu (cần thay bằng file thực)

### 2.4 Trang Tin tức/Blog (Priority: MEDIUM) ✅
**Status**: ✅ HOÀN THÀNH
**URL**: `/tin-tuc`, `/tin-tuc/[slug]`
**Lý do**: SEO, thought leadership, customer engagement

**Nội dung đã triển khai**:
- ✅ Grid layout 3 columns responsive
- ✅ Categories: Tin công ty, Sản phẩm mới, Hướng dẫn, Xu hướng ngành
- ✅ Featured post hero (large card)
- ✅ Pagination (placeholder)
- ✅ Related posts (3 bài cùng category)
- ✅ Social share buttons (Facebook, Twitter, LinkedIn, Copy)
- ✅ Author info với role
- ✅ Breadcrumb navigation
- ✅ Newsletter signup CTA
- ✅ 3 bài viết mẫu với nội dung đầy đủ
- ✅ Data structure: `src/data/blog-posts.ts`

### 2.5 Trang 404 (Priority: HIGH) ✅
**Status**: ✅ HOÀN THÀNH
**URL**: `/404`
**Lý do**: Cải thiện UX khi người dùng truy cập URL không tồn tại

**Nội dung đã triển khai**:
- ✅ Apple-style design: clean, minimal
- ✅ Số 404 lớn với opacity thấp
- ✅ Icon thân thiện
- ✅ Message: "Không tìm thấy trang"
- ✅ 2 CTA buttons: Về trang chủ + Liên hệ hỗ trợ
- ✅ Quick links grid (4 cards): Sản phẩm, Giới thiệu, Tin tức, FAQ
- ✅ Search bar tìm kiếm sản phẩm
- ✅ Responsive design

### 2.6 Trang Tuyển dụng (Priority: LOW) ⏳
**Status**: ⏳ CHƯA TRIỂN KHAI
**Lý do**: Employer branding, attract talent

**Nội dung đề xuất**:
- Company culture section
- Benefits & perks
- Open positions list
- Application form
- Office photos

**URL**: `/tuyen-dung` (chưa tạo)

---

## 3. Cải tiến trang hiện tại

### 3.1 Trang chủ
**Cải tiến**:
- [ ] Thêm section "Tại sao chọn APPE?" (3-4 USPs)
- [ ] Thêm testimonials/reviews từ đại lý
- [ ] Thêm section "Được tin dùng bởi" với logos đại lý lớn
- [ ] Thêm CTA "Tìm đại lý gần bạn"
- [ ] Video giới thiệu công ty (optional)

### 3.2 Trang Sản phẩm
**Cải tiến**:
- [ ] Thêm "So sánh sản phẩm" feature (select 2-3 products)
- [ ] Thêm "Sản phẩm bán chạy" badge
- [ ] Thêm "Sản phẩm mới" badge
- [ ] Load more pagination thay vì show all
- [ ] Thêm filter theo price range
- [ ] Thêm filter theo application (công nghiệp, thực phẩm, etc.)

### 3.3 Trang Chi tiết Sản phẩm
**Cải tiến**:
- [ ] Thêm image gallery với zoom
- [ ] Thêm video demo (nếu có)
- [ ] Thêm "Tải catalog PDF" button
- [ ] Thêm "Tìm đại lý bán sản phẩm này" CTA
- [ ] Thêm technical drawings/diagrams
- [ ] Thêm application examples
- [ ] Thêm "Sản phẩm tương tự" section

### 3.4 Trang Giới thiệu
**Cải tiến**:
- [ ] Thêm team photos (leadership)
- [ ] Thêm factory/office photos
- [ ] Thêm video tour nhà máy
- [ ] Thêm awards & recognition section
- [ ] Thêm export markets map

### 3.5 Trang Liên hệ ✅
**Cải tiến**:
- [x] Thêm embedded Google Map (tọa độ: 20.601988, 105.927488)
- [x] Map với directions button → Google Maps app
- [x] Contact methods cards (Phone, Zalo, Email)
- [x] Office info (Address, Working hours)
- [x] Contact form với validation
- [ ] Thêm form categories (Khách hàng, Đại lý, Đối tác, Tuyển dụng)
- [ ] Thêm expected response time

---

## 4. Tính năng mới

### 4.1 Tìm kiếm toàn site (Priority: HIGH)
- Global search bar trong header
- Search across: Products, News, Downloads, FAQs
- Instant results dropdown
- Advanced search page

### 4.2 Đa ngôn ngữ (Priority: MEDIUM)
- Tiếng Việt (default)
- English (cho export markets)
- Language switcher trong header
- URL structure: `/en/products`, `/vi/san-pham`

### 4.3 Chatbot/Live chat (Priority: MEDIUM)
- Tích hợp Zalo chat hoặc Facebook Messenger
- Hoặc custom chatbot với FAQs
- Working hours indicator
- Quick replies

### 4.4 Newsletter signup (Priority: LOW)
- Form trong footer
- Popup sau 30s (exit intent)
- Incentive: "Nhận tin sản phẩm mới & ưu đãi"

### 4.5 Product comparison tool (Priority: LOW)
- Select 2-3 products
- Side-by-side comparison table
- Specs, features, price
- "Tìm đại lý" CTA

---

## 5. Nội dung cần bổ sung

### 5.1 Nội dung marketing
- [ ] Case studies: Success stories từ đại lý
- [ ] Testimonials: Reviews từ khách hàng/đại lý
- [ ] Video content: Product demos, factory tour, how-to guides
- [ ] Infographics: Product benefits, industry insights
- [ ] Whitepapers: Technical guides, industry reports

### 5.2 Nội dung SEO
- [ ] Blog posts: 20-30 bài về ngành, sản phẩm, ứng dụng
- [ ] Landing pages: Theo từ khóa chính (van công nghiệp, van thực phẩm, etc.)
- [ ] FAQ content: 50+ câu hỏi
- [ ] Product descriptions: Mở rộng, thêm keywords
- [ ] Alt text: Tất cả images

### 5.3 Nội dung đại lý
- [ ] Dealer database: 150+ đại lý với đầy đủ info
- [ ] Dealer benefits: Tại sao trở thành đại lý APPE
- [ ] Dealer requirements: Điều kiện, quy trình đăng ký
- [ ] Dealer support: Training, marketing materials, technical support
- [ ] Dealer success stories: Case studies

---

## 6. Cải tiến SEO

### 6.1 On-page SEO
- [ ] Meta descriptions cho tất cả pages (155-160 chars)
- [ ] H1 tags unique cho mỗi page
- [ ] Internal linking strategy
- [ ] Image optimization: WebP format, lazy loading
- [ ] Schema markup: Organization, Product, FAQ, BreadcrumbList
- [ ] Canonical URLs
- [ ] Open Graph tags cho social sharing

### 6.2 Technical SEO
- [ ] XML sitemap (đã có, cần update khi thêm pages)
- [ ] Robots.txt optimization
- [ ] Page speed optimization: Target <3s load time
- [ ] Mobile-first indexing optimization
- [ ] HTTPS (đã có)
- [ ] Structured data testing
- [ ] Core Web Vitals optimization

### 6.3 Content SEO
- [ ] Keyword research: Top 50 keywords
- [ ] Content calendar: 2-4 blog posts/month
- [ ] Long-tail keyword targeting
- [ ] Local SEO: Tối ưu cho "van công nghiệp [tỉnh/thành phố]"
- [ ] Competitor analysis
- [ ] Backlink strategy

---

## 7. Cải tiến Technical

### 7.1 Performance
- [ ] Image optimization: WebP, responsive images
- [ ] Code splitting: Lazy load components
- [ ] CDN: CloudFlare hoặc similar
- [ ] Caching strategy
- [ ] Minify CSS/JS
- [ ] Remove unused code

### 7.2 Analytics & Tracking
- [ ] Google Analytics 4 setup
- [ ] Google Search Console
- [ ] Conversion tracking: Form submits, phone clicks, dealer searches
- [ ] Heatmaps: Hotjar hoặc Microsoft Clarity
- [ ] A/B testing setup
- [ ] Event tracking: Button clicks, video plays, downloads

### 7.3 Security
- [ ] SSL certificate (đã có)
- [ ] Security headers: CSP, X-Frame-Options, etc.
- [ ] Form validation & sanitization
- [ ] Rate limiting cho forms
- [ ] GDPR compliance (cookie consent)

### 7.4 Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast checking
- [ ] Focus indicators
- [ ] ARIA labels

---

## 8. Roadmap triển khai

### ~~Phase 1: Foundation (Tháng 1-2)~~ ✅ 80% HOÀN THÀNH
**Priority: HIGH - Essential pages**

**✅ Week 1-2: ~~Trang Đại lý~~** (Đã loại bỏ)
- ❌ Tạm thời không triển khai theo yêu cầu

**✅ Week 3-4: Trang FAQ** ✅ HOÀN THÀNH
- [x] Design accordion layout
- [x] Implement search functionality
- [x] Add categories (6 categories)
- [x] 30 FAQs với nội dung đầy đủ
- [x] Mobile optimization

**✅ Week 5-6: Trang Tải xuống** ✅ HOÀN THÀNH
- [x] Design download page
- [x] Implement file management system
- [x] Add categories & filters (5 categories)
- [x] Add download tracking (placeholder)
- [x] 10 tài liệu mẫu
- [ ] Upload file thực và setup download links (TODO)

**✅ Week 7-8: Trang Tin tức & Cải tiến** ✅ HOÀN THÀNH
- [x] Design blog layout (listing + detail)
- [x] Setup data structure (`src/data/blog-posts.ts`)
- [x] Write 3 initial blog posts với nội dung đầy đủ
- [x] Implement categories & filter
- [x] Add social sharing
- [x] Trang 404 Apple-style
- [x] Google Maps integration
- [x] Update navigation & sitemap
- [ ] Write 10 more blog posts (TODO)

### Phase 2: Content & Engagement (Tháng 3-4) 🚧 ĐANG CHUẨN BỊ
**Priority: MEDIUM - Content marketing**

**Week 1-2: Content creation**
- [ ] Write 20 more blog posts
- [ ] Create 5 case studies
- [ ] Collect 10 testimonials
- [ ] Create 3 product videos
- [ ] Design 5 infographics

**Week 3-4: SEO optimization**
- [ ] Keyword research
- [ ] Optimize all meta tags
- [ ] Add schema markup (FAQPage, Article, BreadcrumbList)
- [ ] Internal linking strategy
- [ ] Image optimization (WebP format)

**Week 5-6: Analytics & tracking**
- [x] Setup GA4 (đã có trong BaseLayout)
- [ ] Setup Search Console
- [ ] Implement conversion tracking
- [ ] Setup heatmaps (Hotjar/Clarity)
- [ ] Create dashboards

**Week 7-8: Cải tiến trang hiện tại**
- [ ] Homepage: Add USPs, testimonials
- [ ] Products: Add badges, comparison feature
- [ ] Product detail: Add gallery, video, PDF download
- [ ] Contact: Add form categories

### Phase 3: Advanced Features (Tháng 5-6)
**Priority: LOW - Nice to have**

**Week 1-2: Đa ngôn ngữ**
- [ ] Setup i18n framework
- [ ] Translate all content to English
- [ ] Implement language switcher
- [ ] Test all pages

**Week 3-4: Interactive features**
- [ ] Product comparison tool
- [ ] Chatbot/Live chat integration
- [ ] Newsletter signup
- [ ] Exit intent popup

**Week 5-6: Trang Tuyển dụng**
- [ ] Design careers page
- [ ] Create job posting system
- [ ] Add application form
- [ ] Add company culture content

**Week 7-8: Polish & optimization**
- [ ] A/B testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Final QA

---

## 9. Metrics & KPIs

### Traffic metrics
- Unique visitors: Target +50% trong 6 tháng
- Page views: Target +60%
- Bounce rate: Target <40%
- Avg session duration: Target >2 minutes
- Pages per session: Target >3

### Engagement metrics
- Dealer search usage: Track searches/month
- Form submissions: Track inquiries/month
- Download count: Track downloads/month
- Blog engagement: Time on page, scroll depth
- Video views: Track plays/completions

### Conversion metrics
- Inquiry form submissions: Target 50+/month
- Phone clicks: Track clicks
- Dealer applications: Target 5+/month
- Newsletter signups: Target 100+/month
- Product comparison usage: Track comparisons/month

### SEO metrics
- Organic traffic: Target +100% trong 6 tháng
- Keyword rankings: Top 10 cho 20+ keywords
- Backlinks: Target 50+ quality backlinks
- Domain authority: Target 30+
- Page speed: Target <3s load time

---

## 10. Budget estimate (Optional)

### Development costs
- Phase 1 (8 weeks): ~80-120 hours
- Phase 2 (8 weeks): ~60-80 hours
- Phase 3 (8 weeks): ~60-80 hours
- Total: ~200-280 hours

### Content costs
- Blog posts (50 posts): ~50 hours
- Case studies (5): ~20 hours
- Videos (3): External vendor
- Infographics (5): External designer
- Photography: External photographer

### Tools & services
- Google Workspace: $6/user/month
- Analytics tools: Free (GA4, Search Console)
- Heatmaps: $39/month (Hotjar)
- CDN: $20/month (CloudFlare Pro)
- Email marketing: $15/month (Mailchimp)

---

## 11. Kết luận

Website APPE JV đã hoàn thành Phase 1 với 80% tiến độ. Các trang thiết yếu đã được triển khai theo phong cách Apple hiện đại:

**✅ Đã hoàn thành**:
1. ✅ Trang FAQ - 30 câu hỏi, 6 categories, search & filter
2. ✅ Trang Tải liệu - 10 tài liệu mẫu, 5 categories
3. ✅ Trang Tin tức/Blog - Listing + detail, 3 bài viết đầy đủ
4. ✅ Trang 404 - Apple-style với quick links
5. ✅ Google Maps - Tích hợp vào trang Liên hệ
6. ✅ Navigation - Cập nhật header, footer, sitemap

**🎯 Ưu tiên tiếp theo (Phase 2)**:
1. Viết thêm 20-30 bài blog với nội dung chất lượng
2. Upload tài liệu thực và setup download links
3. Tối ưu SEO: schema markup, meta tags, internal linking
4. Setup analytics: conversion tracking, heatmaps
5. Cải tiến trang hiện tại: USPs, testimonials, product comparison

**📊 Metrics cần theo dõi**:
- Blog engagement: views, time on page, shares
- Download tracking: số lượt tải theo category
- FAQ usage: searches, most viewed questions
- 404 page: bounce rate, navigation clicks
- Contact form: submission rate, response time

**💡 Khuyến nghị**:
- Tập trung vào content quality cho blog (20-30 bài)
- Thu thập testimonials và case studies thực tế
- Tối ưu SEO để tăng organic traffic
- Setup analytics để đo lường hiệu quả

---

**Ngày cập nhật**: 25/02/2026  
**Phiên bản**: 2.0  
**Status**: Phase 1 - 80% Complete ✅  
**Next Phase**: Content & Engagement (Phase 2) 🚧
