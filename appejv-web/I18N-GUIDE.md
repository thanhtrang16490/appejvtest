# I18N Implementation Guide

## 📋 Overview

This guide explains how to use the i18n system for APPE JV website.

## 🚀 Quick Start

### 1. Generate English Pages

Run the generation script:

```bash
node scripts/generate-i18n-pages.js
```

This will create all English pages in `src/pages/en/` directory.

### 2. Update Translations

Edit `src/i18n/translations.json` to add/update translations.

### 3. Add Language Switcher

The language switcher will be added to the header automatically.

## 📁 File Structure

```
src/
├── i18n/
│   ├── languages.ts          # Language definitions
│   ├── utils.ts               # i18n utilities
│   └── translations.json      # All translations
├── pages/
│   ├── index.astro           # Vietnamese (default)
│   ├── gioi-thieu.astro
│   ├── ...
│   └── en/                    # English pages
│       ├── index.astro
│       ├── about.astro
│       └── ...
```

## 🔧 How It Works

### URL Structure

- Vietnamese (default): `/`, `/gioi-thieu`, `/san-pham`
- English: `/en`, `/en/about`, `/en/products`

### Page Mapping

| Vietnamese | English | Description |
|------------|---------|-------------|
| `/` | `/en` | Homepage |
| `/gioi-thieu` | `/en/about` | About |
| `/san-pham` | `/en/products` | Products |
| `/tin-tuc` | `/en/news` | News |
| `/lien-he` | `/en/contact` | Contact |
| `/cau-hoi-thuong-gap` | `/en/faq` | FAQ |
| `/tai-lieu` | `/en/downloads` | Downloads |

## 💻 Usage in Code

### Get Current Language

```typescript
import { getLangFromUrl } from '@/i18n/utils'

const lang = getLangFromUrl(Astro.url) // 'vi' or 'en'
```

### Use Translations

```typescript
import { useTranslations } from '@/i18n/utils'

const t = useTranslations(lang)

const title = t('home.hero.title')
```

### Generate Localized Paths

```typescript
import { getLocalizedPath } from '@/i18n/utils'

const aboutPath = getLocalizedPath('/about', lang)
// Returns: '/about' for 'vi', '/en/about' for 'en'
```

## ✏️ Adding New Translations

1. Open `src/i18n/translations.json`
2. Add new keys under both `vi` and `en`:

```json
{
  "vi": {
    "newSection": {
      "title": "Tiêu đề mới"
    }
  },
  "en": {
    "newSection": {
      "title": "New Title"
    }
  }
}
```

3. Use in your code:

```typescript
const title = t('newSection.title')
```

## 🔄 Updating Existing Pages

After generating English pages, you need to:

1. **Review content**: Check all generated English pages
2. **Update translations**: Replace Vietnamese text with English
3. **Test links**: Ensure all internal links work
4. **Update metadata**: SEO titles, descriptions, keywords

## 📝 Manual Translation Checklist

For each generated English page, update:

- [ ] Page title and meta description
- [ ] Hero section text
- [ ] Section headings
- [ ] Button labels
- [ ] Form labels and placeholders
- [ ] Error messages
- [ ] Footer content

## 🎨 Language Switcher

The language switcher will be added to the header with:

- Current language indicator
- Dropdown with available languages
- Automatic URL switching

## 🔍 SEO Considerations

1. **Hreflang tags**: Add to BaseLayout
2. **Sitemap**: Update to include English URLs
3. **Canonical URLs**: Set correctly for each language
4. **Meta tags**: Translate all meta descriptions

## 🐛 Troubleshooting

### Pages not generating?

- Check if source Vietnamese page exists
- Verify file permissions
- Run script with `node --trace-warnings`

### Links not working?

- Check URL mapping in script
- Verify internal link updates
- Test with browser dev tools

### Translations not showing?

- Verify translation key exists in JSON
- Check language detection logic
- Console log the `lang` variable

## 📚 Resources

- [Astro i18n Guide](https://docs.astro.build/en/recipes/i18n/)
- [Translation JSON Schema](./src/i18n/translations.json)
- [Language Utils](./src/i18n/utils.ts)

## 🎯 Next Steps

1. Run generation script
2. Review generated pages
3. Update content with proper English translations
4. Add language switcher to header
5. Update sitemap
6. Test thoroughly
7. Deploy

---

**Note**: This is a semi-automated process. The script generates the structure, but you need to manually translate the content for accuracy and quality.
