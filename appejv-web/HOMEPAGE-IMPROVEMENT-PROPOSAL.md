# Đề xuất cải tiến trang chủ APPE JV

## Tổng quan
Trang chủ hiện tại đã có foundation tốt với 3D visualization và layout rõ ràng. Dưới đây là các đề xuất để nâng cao trải nghiệm người dùng và tính chuyên nghiệp.

---

## 1. Hero Section - Nâng cấp ấn tượng đầu tiên

### Hiện tại
- Text-based hero với gradient
- 2 CTA buttons
- Static background

### Đề xuất cải tiến

#### A. Thêm Hero Animation
```astro
<!-- Animated background particles -->
<div class="absolute inset-0 overflow-hidden">
  <div class="particles"></div>
</div>

<!-- Animated statistics counter -->
<div class="stats-counter" data-count-up>
  <span data-target="15">0</span>+ năm kinh nghiệm
</div>
```

#### B. Hero với Video Background
```astro
<section class="relative h-screen">
  <video autoplay muted loop class="absolute inset-0 w-full h-full object-cover opacity-20">
    <source src="/videos/farm-background.mp4" type="video/mp4">
  </video>
  <div class="relative z-10">
    <!-- Hero content -->
  </div>
</section>
```

#### C. Interactive Hero
- Thêm scroll indicator animation
- Parallax effect khi scroll
- Typing animation cho headline

---

## 2. Trust Indicators - Xây dựng lòng tin

### Thêm section mới: Certifications & Partners

```astro
<section class="py-16 bg-white">
  <div class="container mx-auto">
    <h3 class="text-center text-gray-600 mb-8">Được tin tưởng bởi</h3>
    
    <!-- Logos slider -->
    <div class="logos-slider">
      <img src="/partners/partner-1.png" alt="Partner 1">
      <img src="/partners/partner-2.png" alt="Partner 2">
      <!-- Auto-scroll animation -->
    </div>

    <!-- Certifications -->
    <div class="grid grid-cols-4 gap-6 mt-12">
      <div class="certification-badge">
        <img src="/certs/iso-9001.png" alt="ISO 9001">
        <p>ISO 9001:2015</p>
      </div>
      <div class="certification-badge">
        <img src="/certs/haccp.png" alt="HACCP">
        <p>HACCP Certified</p>
      </div>
      <!-- More certifications -->
    </div>
  </div>
</section>
```

---

## 3. Social Proof - Testimonials

### Thêm section: Customer Reviews

```astro
<section class="py-20 bg-gradient-to-br from-blue-50 to-green-50">
  <div class="container mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">
      Khách hàng nói gì về chúng tôi
    </h2>

    <!-- Testimonials Carousel -->
    <div class="testimonials-slider">
      <div class="testimonial-card">
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <p class="quote">"Chất lượng sản phẩm tuyệt vời, đàn heo phát triển rất tốt..."</p>
        <div class="author">
          <img src="/avatars/customer-1.jpg" alt="Customer">
          <div>
            <p class="name">Anh Nguyễn Văn A</p>
            <p class="role">Chủ trang trại, Hà Nam</p>
          </div>
        </div>
      </div>
      <!-- More testimonials -->
    </div>
  </div>
</section>
```

---

## 4. Interactive Product Showcase

### Nâng cấp Products Section

```astro
<section class="py-20">
  <div class="container mx-auto">
    <!-- Tab Navigation -->
    <div class="tabs">
      <button class="tab active" data-tab="pig">🐷 Thức ăn heo</button>
      <button class="tab" data-tab="poultry">🐔 Thức ăn gia cầm</button>
      <button class="tab" data-tab="fish">🐟 Thức ăn thủy sản</button>
    </div>

    <!-- Tab Content with Animation -->
    <div class="tab-content active" data-content="pig">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="product-image">
          <img src="/products/pig-feed.jpg" alt="Pig Feed" class="rounded-2xl shadow-2xl">
          <!-- Image gallery thumbnails -->
        </div>
        <div class="product-info">
          <h3 class="text-3xl font-bold mb-4">Thức ăn cho heo</h3>
          <ul class="benefits-list">
            <li>✓ Tăng trọng nhanh 15-20%</li>
            <li>✓ Tỷ lệ FCR tối ưu</li>
            <li>✓ Tăng cường miễn dịch</li>
          </ul>
          <a href="/san-pham?category=pig" class="btn-primary">
            Xem sản phẩm →
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 5. Live Data & Real-time Updates

### Thêm Live Statistics

```astro
<section class="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
  <div class="container mx-auto">
    <div class="grid md:grid-cols-4 gap-8 text-center">
      <div class="stat-item">
        <div class="text-5xl font-bold mb-2" data-countup="1500">0</div>
        <div class="text-blue-100">Khách hàng tin dùng</div>
      </div>
      <div class="stat-item">
        <div class="text-5xl font-bold mb-2" data-countup="50000">0</div>
        <div class="text-blue-100">Tấn sản phẩm/năm</div>
      </div>
      <div class="stat-item">
        <div class="text-5xl font-bold mb-2" data-countup="98">0</div>
        <div class="text-blue-100">% Khách hàng hài lòng</div>
      </div>
      <div class="stat-item">
        <div class="text-5xl font-bold mb-2" data-countup="24">0</div>
        <div class="text-blue-100">Giờ hỗ trợ/ngày</div>
      </div>
    </div>
  </div>
</section>
```

---

## 6. Blog/News Section

### Thêm Latest News

```astro
<section class="py-20 bg-gray-50">
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-12">
      <h2 class="text-4xl font-bold">Tin tức & Kiến thức</h2>
      <a href="/blog" class="text-blue-600 hover:text-blue-700">
        Xem tất cả →
      </a>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <article class="blog-card">
        <img src="/blog/post-1.jpg" alt="Post" class="rounded-t-xl">
        <div class="p-6">
          <span class="badge">Kiến thức</span>
          <h3 class="text-xl font-bold mt-3 mb-2">
            5 bí quyết chọn thức ăn heo chất lượng
          </h3>
          <p class="text-gray-600 mb-4">
            Hướng dẫn chi tiết giúp bạn lựa chọn thức ăn phù hợp...
          </p>
          <a href="/blog/post-1" class="text-blue-600">Đọc thêm →</a>
        </div>
      </article>
      <!-- More posts -->
    </div>
  </div>
</section>
```

---

## 7. Interactive Map - Phạm vi hoạt động

```astro
<section class="py-20">
  <div class="container mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">
      Phạm vi hoạt động
    </h2>

    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 class="text-2xl font-bold mb-4">Phủ sóng toàn quốc</h3>
        <ul class="space-y-3">
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Miền Bắc: 15 tỉnh thành</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>Miền Trung: 8 tỉnh thành</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span>Miền Nam: 12 tỉnh thành</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Xuất khẩu: Lào, Campuchia</span>
          </li>
        </ul>
      </div>
      <div class="relative">
        <!-- Interactive Vietnam Map -->
        <img src="/vietnam-map.svg" alt="Vietnam Map" class="w-full">
        <!-- Animated pins -->
      </div>
    </div>
  </div>
</section>
```

---

## 8. FAQ Section - Giải đáp thắc mắc

```astro
<section class="py-20 bg-white">
  <div class="container mx-auto max-w-4xl">
    <h2 class="text-4xl font-bold text-center mb-12">
      Câu hỏi thường gặp
    </h2>

    <div class="space-y-4">
      <details class="faq-item">
        <summary class="cursor-pointer font-semibold p-4 bg-gray-50 rounded-lg">
          Sản phẩm của APPE có chứng nhận gì?
        </summary>
        <div class="p-4 text-gray-600">
          Tất cả sản phẩm của chúng tôi đều được chứng nhận ISO 9001:2015, HACCP...
        </div>
      </details>
      <!-- More FAQs -->
    </div>
  </div>
</section>
```

---

## 9. CTA Section - Kêu gọi hành động mạnh mẽ

```astro
<section class="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
  <div class="container mx-auto text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      Sẵn sàng nâng cao hiệu quả chăn nuôi?
    </h2>
    <p class="text-xl mb-8 text-blue-100">
      Liên hệ ngay để được tư vấn miễn phí từ chuyên gia
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="tel:+84351359520" class="btn-white">
        📞 Gọi ngay: 035 135 9520
      </a>
      <a href="/lien-he" class="btn-outline-white">
        ✉️ Gửi yêu cầu tư vấn
      </a>
    </div>

    <!-- Trust badges -->
    <div class="mt-12 flex justify-center gap-8 text-sm text-blue-100">
      <div>✓ Tư vấn miễn phí</div>
      <div>✓ Giao hàng toàn quốc</div>
      <div>✓ Hỗ trợ 24/7</div>
    </div>
  </div>
</section>
```

---

## 10. Micro-interactions & Animations

### JavaScript Enhancements

```javascript
// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up')
    }
  })
}, observerOptions)

// Count-up animation
function animateValue(element, start, end, duration) {
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    element.textContent = Math.floor(progress * (end - start) + start)
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    })
  })
})
```

---

## 11. Performance Optimizations

### Image Optimization
```astro
---
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'
---

<Image 
  src={heroImage} 
  alt="APPE JV" 
  width={1920} 
  height={1080}
  loading="eager"
  format="webp"
/>
```

### Lazy Loading
```html
<img 
  src="placeholder.jpg" 
  data-src="actual-image.jpg" 
  loading="lazy"
  class="lazyload"
>
```

---

## 12. Mobile-First Improvements

### Touch-friendly interactions
- Larger tap targets (min 44x44px)
- Swipeable carousels
- Bottom navigation for mobile
- Sticky CTA button on mobile

```astro
<!-- Mobile sticky CTA -->
<div class="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg md:hidden z-50">
  <a href="/lien-he" class="btn-primary w-full text-center">
    Liên hệ tư vấn
  </a>
</div>
```

---

## 13. Accessibility (A11y)

### WCAG 2.1 AA Compliance
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text for all images
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast ratios

```astro
<button 
  aria-label="Mở menu điều hướng"
  aria-expanded="false"
  aria-controls="mobile-menu"
>
  <span class="sr-only">Menu</span>
  <svg>...</svg>
</button>
```

---

## 14. SEO Enhancements

### Structured Data
```astro
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "APPE JV Việt Nam",
  "url": "https://appejv.app",
  "logo": "https://appejv.app/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-351-359-520",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/appejv",
    "https://linkedin.com/company/appejv"
  ]
}
</script>
```

---

## 15. Analytics & Tracking

### User Behavior Tracking
```javascript
// Track CTA clicks
document.querySelectorAll('.cta-button').forEach(button => {
  button.addEventListener('click', () => {
    gtag('event', 'cta_click', {
      'button_location': button.dataset.location,
      'button_text': button.textContent
    })
  })
})

// Track scroll depth
let maxScroll = 0
window.addEventListener('scroll', () => {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  if (scrollPercent > maxScroll) {
    maxScroll = Math.floor(scrollPercent / 25) * 25
    gtag('event', 'scroll_depth', { 'percent': maxScroll })
  }
})
```

---

## Tổng kết ưu tiên

### Phase 1 - Quick Wins (1-2 tuần)
1. ✅ Thêm testimonials section
2. ✅ Thêm FAQ section
3. ✅ Cải thiện CTA sections
4. ✅ Thêm count-up animations
5. ✅ Mobile sticky CTA

### Phase 2 - Medium Impact (2-4 tuần)
1. ✅ Blog/News section
2. ✅ Interactive product tabs
3. ✅ Trust indicators (certifications)
4. ✅ Live statistics
5. ✅ Scroll animations

### Phase 3 - Long-term (1-2 tháng)
1. ✅ Video background hero
2. ✅ Interactive map
3. ✅ Advanced 3D interactions
4. ✅ Personalization
5. ✅ A/B testing framework

---

## Metrics để đo lường thành công

1. **Engagement**
   - Time on page: Target > 2 minutes
   - Scroll depth: Target > 75%
   - Bounce rate: Target < 40%

2. **Conversion**
   - CTA click rate: Target > 5%
   - Contact form submissions: Target +30%
   - Phone calls: Track via call tracking

3. **Performance**
   - Page load time: Target < 2s
   - Lighthouse score: Target > 90
   - Core Web Vitals: All green

4. **SEO**
   - Organic traffic: Target +50%
   - Keyword rankings: Top 3 for main keywords
   - Backlinks: Target +20/month
