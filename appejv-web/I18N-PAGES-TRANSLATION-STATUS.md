# I18N Pages Translation Status

## Completed Pages ✅

### Vietnamese (Original)
- ✅ Homepage (`/`)
- ✅ About (`/gioi-thieu`)
- ✅ Contact (`/lien-he`)
- ✅ Products (`/san-pham`)
- ✅ News (`/tin-tuc`)
- ✅ FAQ (`/cau-hoi-thuong-gap`)
- ✅ Downloads (`/tai-lieu`)
- ✅ Legal pages (Privacy, Terms, Cookies)

### English (`/en/*`)
- ✅ Homepage (`/en`)
- ✅ About (`/en/about`)
- ✅ Contact (`/en/contact`)
- ✅ News (`/en/news`)
- ⏳ FAQ (`/en/faq`) - Need to create
- ⏳ Downloads (`/en/downloads`) - Need to create
- ⏳ Products - Skip (dynamic data, handle later)
- ⏳ Legal pages - Need to create

### Chinese (`/cn/*`)
- ✅ Homepage (`/cn`)
- ✅ About (`/cn/about`)
- ✅ Contact (`/cn/contact`)
- ⏳ News (`/cn/news`) - Need to create
- ⏳ FAQ (`/cn/faq`) - Need to create
- ⏳ Downloads (`/cn/downloads`) - Need to create
- ⏳ Products - Skip (dynamic data, handle later)
- ⏳ Legal pages - Need to create

## Next Steps

### Priority 1: Core Pages
1. Create `/en/faq` - FAQ page in English
2. Create `/en/downloads` - Downloads page in English
3. Create `/cn/news` - News page in Chinese
4. Create `/cn/faq` - FAQ page in Chinese
5. Create `/cn/downloads` - Downloads page in Chinese

### Priority 2: Legal Pages
6. Create `/en/privacy-policy`
7. Create `/en/terms-of-service`
8. Create `/en/cookie-policy`
9. Create `/cn/privacy-policy`
10. Create `/cn/terms-of-service`
11. Create `/cn/cookie-policy`

### Priority 3: Dynamic Content
12. Products pages - Implement i18n for dynamic Supabase data
13. News detail pages - Create `/en/news/[slug]` and `/cn/news/[slug]`

## Translation Guidelines

### English Translation
- Use professional, clear language
- Follow Apple-style minimal design
- Maintain consistent terminology
- Check grammar and spelling

### Chinese Translation
- Use simplified Chinese (简体中文)
- Professional business tone
- Culturally appropriate expressions
- Check grammar and character accuracy

## File Structure

```
appejv-web/src/pages/
├── index.astro (Vietnamese)
├── gioi-thieu.astro
├── lien-he.astro
├── san-pham/
├── tin-tuc/
├── cau-hoi-thuong-gap.astro
├── tai-lieu.astro
├── en/
│   ├── index.astro ✅
│   ├── about.astro ✅
│   ├── contact.astro ✅
│   ├── news.astro ✅
│   ├── faq.astro ⏳
│   ├── downloads.astro ⏳
│   └── ...
└── cn/
    ├── index.astro ✅
    ├── about.astro ✅
    ├── contact.astro ✅
    ├── news.astro ⏳
    ├── faq.astro ⏳
    ├── downloads.astro ⏳
    └── ...
```

## Data Files

### Blog Posts
- ✅ `src/data/blog-posts.ts` (Vietnamese)
- ✅ `src/data/blog-posts-en.ts` (English)
- ✅ `src/data/blog-posts-cn.ts` (Chinese)

### Translations
- ✅ `src/i18n/translations.json` (Common UI strings)
- ✅ `src/i18n/homepage-translations.ts` (Homepage content)
- ✅ `src/i18n/url-utils.ts` (URL slug mapping)

## Notes

- Products page skipped as requested (dynamic data from Supabase)
- All pages follow Apple-style minimal design
- Consistent typography: 13px, 15px, 17px
- Brand color: #175ead
- Max-width: 980px (main), 692px (content)
