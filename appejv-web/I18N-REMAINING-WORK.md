# I18N Remaining Translation Work

## Status Check

Các trang đã được tạo bởi script `generate-i18n-pages.js` nhưng vẫn còn nội dung tiếng Việt, cần dịch lại.

## Pages Need Translation

### English (`/en/*`)
- ✅ Homepage - Already translated
- ✅ About - Already translated  
- ✅ Contact - Already translated
- ✅ News listing - Already translated
- ✅ News detail - Already translated
- ✅ Products listing - Already translated
- ❌ FAQ (`/en/faq.astro`) - **NEEDS TRANSLATION**
- ❌ Downloads (`/en/downloads.astro`) - **NEEDS TRANSLATION**
- ❌ Privacy Policy (`/en/privacy-policy.astro`) - **NEEDS TRANSLATION**
- ❌ Terms of Service (`/en/terms-of-service.astro`) - **NEEDS TRANSLATION**
- ❌ Cookie Policy (`/en/cookie-policy.astro`) - **NEEDS TRANSLATION**
- ❌ 404 Page (`/en/404.astro`) - **NEEDS TRANSLATION**

### Chinese (`/cn/*`)
- ✅ Homepage - Already translated
- ✅ About - Already translated
- ✅ Contact - Already translated
- ✅ News listing - Already translated
- ✅ News detail - Already translated
- ✅ Products listing - Already translated
- ❌ FAQ (`/cn/faq.astro`) - **NEEDS TRANSLATION**
- ❌ Downloads (`/cn/downloads.astro`) - **NEEDS TRANSLATION**
- ❌ Privacy Policy (`/cn/privacy-policy.astro`) - **NEEDS TRANSLATION**
- ❌ Terms of Service (`/cn/terms-of-service.astro`) - **NEEDS TRANSLATION**
- ❌ Cookie Policy (`/cn/cookie-policy.astro`) - **NEEDS TRANSLATION**
- ❌ 404 Page (`/cn/404.astro`) - **NEEDS TRANSLATION**

## Total Remaining

- **12 pages** need proper translation (6 English + 6 Chinese)

## Priority Order

1. FAQ pages (high traffic)
2. Downloads pages (high traffic)
3. Legal pages (Privacy, Terms, Cookie)
4. 404 pages

## Vietnamese Source Files

- `src/pages/cau-hoi-thuong-gap.astro` → FAQ
- `src/pages/tai-lieu.astro` → Downloads
- `src/pages/chinh-sach-bao-mat.astro` → Privacy Policy
- `src/pages/dieu-khoan-su-dung.astro` → Terms of Service
- `src/pages/chinh-sach-cookie.astro` → Cookie Policy
- `src/pages/404.astro` → 404 Page

## Action Plan

The script-generated pages have Vietnamese content that needs to be replaced with proper translations. Each page needs:

1. Translate SEO meta (title, description, keywords)
2. Translate all UI text (headings, buttons, labels)
3. Translate content sections
4. Update canonical URLs
5. Set correct lang attribute

## Notes

- All pages follow Apple-style minimal design
- Typography: 13px, 15px, 17px
- Brand color: #175ead
- Max-width: 980px (main), 692px (content)
- Maintain consistent tone and terminology across languages
