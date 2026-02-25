# Khắc phục lỗi slug khi chuyển ngôn ngữ trang Đối tác

## Vấn đề
Khi chuyển ngôn ngữ ở trang Đối tác, URL không được chuyển đổi đúng giữa các ngôn ngữ:
- Tiếng Việt: `/doi-tac`
- Tiếng Anh: `/en/partners`
- Tiếng Trung: `/cn/partners`

## Nguyên nhân
Slug "doi-tac" và "partners" chưa được thêm vào `slugMapping` trong file `src/i18n/url-utils.ts`, dẫn đến LanguageSwitcher không thể chuyển đổi URL đúng cách.

## Giải pháp

### 1. Thêm slug mapping cho trang Đối tác
Đã thêm mapping vào `src/i18n/url-utils.ts`:

```typescript
'partners': { vi: 'doi-tac', en: 'partners', cn: 'partners' },
'doi-tac': { vi: 'doi-tac', en: 'partners', cn: 'partners' },
```

### 2. Xác nhận canonical URLs
Tất cả 3 trang đối tác đã có canonical URL đúng:
- `/doi-tac` → `canonical="/doi-tac"`
- `/en/partners` → `canonical="/en/partners"` + `lang="en"`
- `/cn/partners` → `canonical="/cn/partners"` + `lang="cn"`

## Cách hoạt động

Khi người dùng click vào LanguageSwitcher:
1. Component `LanguageSwitcher.astro` gọi `getLocalizedPath(currentPath, targetLang)`
2. Function `getLocalizedPath` trong `url-utils.ts`:
   - Tách path thành các segments
   - Loại bỏ language prefix hiện tại (en/cn)
   - Dịch từng segment dựa trên `slugMapping`
   - Thêm language prefix mới (nếu không phải tiếng Việt)

### Ví dụ:
- Từ `/doi-tac` → English: `/en/partners`
- Từ `/en/partners` → Vietnamese: `/doi-tac`
- Từ `/cn/partners` → English: `/en/partners`

## Kết quả
✅ Chuyển ngôn ngữ hoạt động chính xác cho trang Đối tác
✅ URL được dịch đúng giữa 3 ngôn ngữ
✅ SEO được tối ưu với canonical URLs và alternate links
✅ Build thành công với 167 trang

## Files đã sửa đổi
1. `src/i18n/url-utils.ts` - Thêm slug mapping cho partners/doi-tac

## Lưu ý
Khi thêm trang mới với slug khác nhau giữa các ngôn ngữ, cần:
1. Thêm mapping vào `slugMapping` trong `url-utils.ts`
2. Đảm bảo tất cả trang có canonical URL đúng
3. Test chuyển ngôn ngữ trên tất cả các trang

## Ngày hoàn thành
25/02/2026
