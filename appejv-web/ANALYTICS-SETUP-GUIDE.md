# Hướng dẫn Setup Analytics & Tracking

**Mục đích**: Hướng dẫn chi tiết cách lấy và cấu hình tracking IDs cho Microsoft Clarity và Facebook Pixel

---

## 📊 Google Analytics 4 (Đã có)

✅ **Status**: ACTIVE  
✅ **Tracking ID**: `G-RGN1EGREY6`  
✅ **Dashboard**: https://analytics.google.com/

**Không cần làm gì thêm** - GA4 đã hoạt động!

---

## 🔥 Microsoft Clarity Setup (MIỄN PHÍ)

### Bước 1: Đăng ký tài khoản

1. Truy cập: https://clarity.microsoft.com/
2. Click "Sign up" hoặc "Get started"
3. Đăng nhập bằng:
   - Microsoft account (khuyến nghị)
   - Google account
   - Facebook account

### Bước 2: Tạo Project mới

1. Sau khi đăng nhập, click "Add new project"
2. Điền thông tin:
   ```
   Project name: APPE JV Website
   Website URL: https://appejv.app
   Category: Business
   ```
3. Click "Add project"

### Bước 3: Lấy Project ID

1. Trong dashboard, click vào project vừa tạo
2. Click "Settings" (biểu tượng bánh răng)
3. Trong tab "Setup", tìm phần "Install tracking code"
4. Bạn sẽ thấy code như này:
   ```html
   <script type="text/javascript">
     (function(c,l,a,r,i,t,y){
       ...
     })(window, document, "clarity", "script", "abc123xyz");
   </script>
   ```
5. **Copy Project ID** (phần `"abc123xyz"` trong ví dụ trên)

### Bước 4: Cập nhật code

1. Mở file: `appejv-web/src/layouts/BaseLayout.astro`
2. Tìm dòng 305 (hoặc search "o8iqxqxqxq")
3. Replace:
   ```javascript
   // BEFORE
   })(window, document, "clarity", "script", "o8iqxqxqxq");
   
   // AFTER (thay bằng Project ID thật của bạn)
   })(window, document, "clarity", "script", "abc123xyz");
   ```

### Bước 5: Deploy và Verify

1. Build và deploy website:
   ```bash
   cd appejv-web
   npm run build
   # Deploy to production
   ```

2. Verify tracking:
   - Truy cập website của bạn
   - Quay lại Clarity dashboard
   - Sau 2-5 phút, bạn sẽ thấy data bắt đầu xuất hiện
   - Check "Recordings" để xem session recordings

### Bước 6: Cấu hình Dashboard (Optional)

1. **Heatmaps**: Click "Heatmaps" → Chọn pages để xem
2. **Recordings**: Click "Recordings" → Xem user sessions
3. **Insights**: Click "Insights" → Xem AI-powered insights
4. **Filters**: Tạo filters để phân tích specific segments

---

## 📘 Facebook Pixel Setup (Optional)

**Lưu ý**: Chỉ cần nếu bạn chạy Facebook Ads

### Bước 1: Truy cập Facebook Business Manager

1. Truy cập: https://business.facebook.com/
2. Đăng nhập với Facebook account
3. Nếu chưa có Business Manager:
   - Click "Create Account"
   - Điền thông tin công ty
   - Verify email

### Bước 2: Tạo Pixel

1. Trong Business Manager, click menu (☰)
2. Chọn "Events Manager"
3. Click "Connect Data Sources" → "Web"
4. Chọn "Facebook Pixel" → Click "Connect"
5. Điền thông tin:
   ```
   Pixel name: APPE JV Website
   Website URL: https://appejv.app
   ```
6. Click "Continue"

### Bước 3: Lấy Pixel ID

1. Trong Events Manager, click vào Pixel vừa tạo
2. Click "Settings" tab
3. Bạn sẽ thấy "Pixel ID" (dạng: `1234567890123456`)
4. **Copy Pixel ID**

### Bước 4: Cập nhật code

1. Mở file: `appejv-web/src/layouts/BaseLayout.astro`
2. Tìm "YOUR_FACEBOOK_PIXEL_ID" (có 2 chỗ)
3. Replace cả 2 chỗ:
   ```javascript
   // BEFORE (line 311)
   fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
   
   // AFTER
   fbq('init', '1234567890123456');
   
   // BEFORE (line 323)
   src="https://www.facebook.com/tr?id=YOUR_FACEBOOK_PIXEL_ID&ev=PageView&noscript=1"
   
   // AFTER
   src="https://www.facebook.com/tr?id=1234567890123456&ev=PageView&noscript=1"
   ```

### Bước 5: Deploy và Verify

1. Build và deploy:
   ```bash
   cd appejv-web
   npm run build
   # Deploy to production
   ```

2. Verify tracking:
   - Install "Facebook Pixel Helper" Chrome extension
   - Truy cập website của bạn
   - Click extension icon → Sẽ thấy Pixel đang active
   - Quay lại Events Manager → Check "Test Events"

### Bước 6: Cấu hình Events (Optional)

**Standard Events** để track:

```javascript
// Contact form submission
fbq('track', 'Contact');

// Lead generation
fbq('track', 'Lead', {
  content_name: 'Contact Form',
  content_category: 'Lead Generation'
});

// Product view
fbq('track', 'ViewContent', {
  content_name: 'Pig Feed Premium',
  content_category: 'Products',
  content_ids: ['FEED001'],
  content_type: 'product'
});

// Download brochure
fbq('track', 'CompleteRegistration', {
  content_name: 'Product Brochure',
  status: 'completed'
});
```

**Thêm events vào forms**:

```html
<!-- Contact form -->
<form onsubmit="fbq('track', 'Contact'); return true;">
  <!-- form fields -->
</form>

<!-- Download button -->
<button onclick="fbq('track', 'Lead', {content_name: 'Brochure'});">
  Download
</button>
```

---

## 🧪 Testing & Verification

### Test Google Analytics

1. Truy cập: https://analytics.google.com/
2. Chọn property "APPE JV Website"
3. Click "Reports" → "Realtime"
4. Mở website trong tab mới
5. Sẽ thấy 1 active user trong Realtime report

### Test Microsoft Clarity

1. Truy cập: https://clarity.microsoft.com/
2. Chọn project "APPE JV Website"
3. Mở website trong tab mới
4. Navigate qua vài pages
5. Sau 2-5 phút, check "Recordings" tab
6. Sẽ thấy session recording của bạn

### Test Facebook Pixel

1. Install "Facebook Pixel Helper" extension
2. Truy cập website
3. Click extension icon
4. Sẽ thấy:
   ```
   ✓ Facebook Pixel (ID: 1234567890123456)
   ✓ PageView event fired
   ```

---

## 📊 Monitoring & Reports

### Google Analytics 4

**Daily Checks**:
- Realtime users
- Traffic sources
- Popular pages
- Bounce rate

**Weekly Reports**:
- User demographics
- Behavior flow
- Conversion rate
- Goal completions

**Monthly Analysis**:
- Traffic trends
- Campaign performance
- User retention
- Revenue (if e-commerce)

### Microsoft Clarity

**Daily Checks**:
- New recordings
- Rage clicks
- Dead clicks

**Weekly Analysis**:
- Heatmaps for key pages
- User behavior patterns
- UX issues

**Monthly Review**:
- Insights summary
- Optimization opportunities
- A/B test ideas

### Facebook Pixel

**Campaign Monitoring**:
- Pixel events
- Conversion rate
- Cost per conversion
- ROAS (Return on Ad Spend)

**Audience Building**:
- Custom audiences
- Lookalike audiences
- Retargeting lists

---

## 🔧 Troubleshooting

### Google Analytics không track

**Kiểm tra**:
1. Tracking ID đúng chưa? (`G-RGN1EGREY6`)
2. Website đã deploy chưa?
3. Ad blocker có block không?
4. Check Console errors

**Fix**:
```bash
# Rebuild và deploy lại
cd appejv-web
npm run build
```

### Microsoft Clarity không có data

**Kiểm tra**:
1. Project ID đã replace chưa?
2. Đã đợi 2-5 phút chưa?
3. Website có traffic chưa?

**Fix**:
- Verify Project ID trong code
- Clear browser cache
- Test trong incognito mode

### Facebook Pixel không fire

**Kiểm tra**:
1. Pixel ID đúng chưa?
2. Đã replace cả 2 chỗ chưa?
3. Pixel Helper có báo lỗi không?

**Fix**:
- Check Console errors
- Verify Pixel ID
- Test Events trong Events Manager

---

## 📱 Mobile App Tracking (Future)

Khi có mobile app, cần thêm:

### Firebase Analytics (iOS & Android)
```bash
# Install Firebase
npm install firebase

# Configure in app
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

### Facebook SDK (iOS & Android)
```bash
# iOS
pod 'FBSDKCoreKit'

# Android
implementation 'com.facebook.android:facebook-android-sdk:latest'
```

---

## 🎯 Best Practices

### Data Privacy

1. **Cookie Consent**:
   - Add cookie consent banner
   - Use CookieYes or similar
   - Update Privacy Policy

2. **GDPR Compliance**:
   - Anonymize IP addresses
   - Provide opt-out options
   - Data retention policies

3. **User Rights**:
   - Right to access data
   - Right to deletion
   - Right to portability

### Performance

1. **Partytown** (đã có):
   - Scripts run in Web Worker
   - Don't block main thread
   - Better performance

2. **Lazy Loading**:
   - Load tracking scripts after page load
   - Use `defer` or `async`

3. **Minimize Tracking**:
   - Only track necessary events
   - Avoid excessive custom events
   - Batch events when possible

### Security

1. **Environment Variables**:
   ```bash
   # .env (don't commit)
   PUBLIC_GA_ID=G-RGN1EGREY6
   PUBLIC_CLARITY_ID=abc123xyz
   PUBLIC_FB_PIXEL_ID=1234567890123456
   ```

2. **Content Security Policy**:
   ```nginx
   # Allow tracking domains
   script-src 'self' 
     https://www.googletagmanager.com 
     https://www.clarity.ms 
     https://connect.facebook.net;
   ```

---

## 📞 Support

### Google Analytics
- Help Center: https://support.google.com/analytics
- Community: https://support.google.com/analytics/community
- Email: analytics-support@google.com

### Microsoft Clarity
- Docs: https://docs.microsoft.com/en-us/clarity/
- Support: https://clarity.microsoft.com/support
- Community: https://techcommunity.microsoft.com/

### Facebook Pixel
- Help Center: https://www.facebook.com/business/help
- Developer Docs: https://developers.facebook.com/docs/meta-pixel
- Support: https://www.facebook.com/business/help/support

---

## ✅ Checklist

### Initial Setup
- [ ] Get Microsoft Clarity Project ID
- [ ] Replace Project ID in BaseLayout.astro
- [ ] Get Facebook Pixel ID (if needed)
- [ ] Replace Pixel ID in BaseLayout.astro (2 places)
- [ ] Build website (`npm run build`)
- [ ] Deploy to production
- [ ] Verify GA4 tracking
- [ ] Verify Clarity tracking
- [ ] Verify Facebook Pixel (if configured)

### Weekly Tasks
- [ ] Check GA4 reports
- [ ] Review Clarity recordings
- [ ] Analyze heatmaps
- [ ] Check conversion rates
- [ ] Identify UX issues

### Monthly Tasks
- [ ] Generate analytics reports
- [ ] Review traffic trends
- [ ] Optimize underperforming pages
- [ ] Update tracking events
- [ ] Review privacy compliance

---

**Cần hỗ trợ?** Liên hệ team hoặc check documentation links ở trên!
