# SEO Blocking Configuration - APPE JV App

## Tổng quan
APPE JV App là ứng dụng nội bộ (internal application) dành cho nhân viên và khách hàng. Tất cả các công cụ tìm kiếm đã được chặn không cho index.

## Các biện pháp chặn đã triển khai

### 1. robots.txt
**File:** `public/robots.txt`

```txt
User-agent: *
Disallow: /
```

Chặn tất cả các bot:
- ✅ Googlebot
- ✅ Googlebot-Image
- ✅ Googlebot-Mobile
- ✅ Bingbot
- ✅ Slurp (Yahoo)
- ✅ DuckDuckBot
- ✅ Baiduspider
- ✅ YandexBot
- ✅ Sogou
- ✅ Exabot
- ✅ facebot (Facebook)
- ✅ ia_archiver (Internet Archive)

### 2. Meta Tags (layout.tsx)
**File:** `app/layout.tsx`

```tsx
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
<meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
```

**Ý nghĩa:**
- `noindex`: Không index trang
- `nofollow`: Không theo dõi links
- `noarchive`: Không lưu cache
- `nosnippet`: Không hiển thị snippet trong kết quả tìm kiếm
- `noimageindex`: Không index hình ảnh
- `nocache`: Không cache trang

### 3. Next.js Metadata (layout.tsx)
```tsx
robots: {
  index: false,
  follow: false,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    'max-video-preview': 0,
    'max-image-preview': 'none',
    'max-snippet': 0,
  },
}
```

### 4. HTTP Headers (next.config.ts)
**File:** `next.config.ts`

```tsx
{
  key: 'X-Robots-Tag',
  value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache'
}
```

HTTP header `X-Robots-Tag` được áp dụng cho tất cả các routes.

## Kiểm tra

### 1. Kiểm tra robots.txt
```bash
curl https://app.appejv.app/robots.txt
```

Kết quả mong đợi:
```
User-agent: *
Disallow: /
```

### 2. Kiểm tra Meta Tags
```bash
curl -s https://app.appejv.app | grep -i robots
```

Kết quả mong đợi:
```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
```

### 3. Kiểm tra HTTP Headers
```bash
curl -I https://app.appejv.app | grep -i x-robots
```

Kết quả mong đợi:
```
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex, nocache
```

### 4. Google Search Console
- Kiểm tra URL: https://search.google.com/search-console
- Công cụ kiểm tra URL: Nhập URL và xem "Coverage" status
- Kết quả mong đợi: "Excluded by 'noindex' tag"

### 5. Bing Webmaster Tools
- URL: https://www.bing.com/webmasters
- Kiểm tra URL inspection
- Kết quả mong đợi: "Blocked by robots.txt" hoặc "Blocked by noindex"

## Lưu ý quan trọng

### ⚠️ Không có Sitemap
Ứng dụng này KHÔNG có sitemap.xml vì không muốn được index.

### ⚠️ Không có Open Graph cho SEO
Open Graph tags chỉ dùng cho social sharing, không để SEO.

### ⚠️ Không có Structured Data
Không có schema.org markup vì không cần SEO.

### ✅ Vẫn có Meta Tags cơ bản
- Title, description vẫn có cho UX
- Open Graph cho social sharing
- Nhưng tất cả đều có noindex

## Tại sao chặn SEO?

### 1. Bảo mật
- Ứng dụng nội bộ, chỉ dành cho nhân viên và khách hàng
- Không muốn thông tin nội bộ xuất hiện trên Google

### 2. Privacy
- Thông tin đơn hàng, khách hàng là riêng tư
- Không muốn bị crawl và lưu cache

### 3. Phân biệt với Website công khai
- **appejv.app** (app): Nội bộ, có login, không index
- **appe.com.vn** (web): Công khai, marketing, có SEO

## Monitoring

### Công cụ theo dõi
1. **Google Search Console**
   - Theo dõi crawl errors
   - Xác nhận noindex hoạt động
   - Kiểm tra coverage reports

2. **Bing Webmaster Tools**
   - Tương tự Google Search Console
   - Theo dõi Bing crawling

3. **Server Logs**
   - Theo dõi bot traffic
   - Xác nhận robots.txt được respect

### Cảnh báo
Nếu phát hiện trang bị index:
1. Kiểm tra robots.txt accessible
2. Kiểm tra meta tags trong HTML
3. Kiểm tra HTTP headers
4. Submit removal request trong Search Console
5. Kiểm tra lại sau 1-2 tuần

## Cập nhật

### Khi deploy
- ✅ Đảm bảo robots.txt được deploy
- ✅ Kiểm tra meta tags trong production
- ✅ Test HTTP headers
- ✅ Verify trong Search Console

### Khi thay đổi domain
- ✅ Cập nhật robots.txt
- ✅ Cập nhật meta tags
- ✅ Submit removal cho domain cũ
- ✅ Verify domain mới

## Liên hệ

Nếu có vấn đề về SEO blocking:
- Email: info@appe.com.vn
- Phone: +84 3513 595 202/203

---
Last updated: 2026-02-09
Status: ✅ Active - All search engines blocked
