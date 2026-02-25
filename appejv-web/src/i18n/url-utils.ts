import type { Language } from './languages'

// URL slug mapping between languages
export const slugMapping: Record<string, { vi: string; en: string; cn: string }> = {
  'about': { vi: 'gioi-thieu', en: 'about', cn: 'about' },
  'gioi-thieu': { vi: 'gioi-thieu', en: 'about', cn: 'about' },
  'products': { vi: 'san-pham', en: 'products', cn: 'products' },
  'san-pham': { vi: 'san-pham', en: 'products', cn: 'products' },
  'news': { vi: 'tin-tuc', en: 'news', cn: 'news' },
  'tin-tuc': { vi: 'tin-tuc', en: 'news', cn: 'news' },
  'contact': { vi: 'lien-he', en: 'contact', cn: 'contact' },
  'lien-he': { vi: 'lien-he', en: 'contact', cn: 'contact' },
  'faq': { vi: 'cau-hoi-thuong-gap', en: 'faq', cn: 'faq' },
  'cau-hoi-thuong-gap': { vi: 'cau-hoi-thuong-gap', en: 'faq', cn: 'faq' },
  'downloads': { vi: 'tai-lieu', en: 'downloads', cn: 'downloads' },
  'tai-lieu': { vi: 'tai-lieu', en: 'downloads', cn: 'downloads' },
  'privacy-policy': { vi: 'chinh-sach-bao-mat', en: 'privacy-policy', cn: 'privacy-policy' },
  'chinh-sach-bao-mat': { vi: 'chinh-sach-bao-mat', en: 'privacy-policy', cn: 'privacy-policy' },
  'terms-of-service': { vi: 'dieu-khoan-su-dung', en: 'terms-of-service', cn: 'terms-of-service' },
  'dieu-khoan-su-dung': { vi: 'dieu-khoan-su-dung', en: 'terms-of-service', cn: 'terms-of-service' },
  'cookie-policy': { vi: 'chinh-sach-cookie', en: 'cookie-policy', cn: 'cookie-policy' },
  'chinh-sach-cookie': { vi: 'chinh-sach-cookie', en: 'cookie-policy', cn: 'cookie-policy' },
  'app': { vi: 'ung-dung', en: 'app', cn: 'app' },
  'ung-dung': { vi: 'ung-dung', en: 'app', cn: 'app' },
  'partners': { vi: 'doi-tac', en: 'partners', cn: 'partners' },
  'doi-tac': { vi: 'doi-tac', en: 'partners', cn: 'partners' },
}

// Remove language prefix from path
export function getBasePath(path: string): string {
  const segments = path.split('/').filter(Boolean)
  
  // Remove language prefix
  if (segments[0] === 'en' || segments[0] === 'cn') {
    segments.shift()
  }
  
  return '/' + segments.join('/')
}

// Get localized path with proper slug translation
export function getLocalizedPath(path: string, targetLang: Language): string {
  const segments = path.split('/').filter(Boolean)
  
  // Remove current language prefix if exists
  if (segments[0] === 'en' || segments[0] === 'cn') {
    segments.shift()
  }
  
  // Translate each segment if it has a mapping
  const translatedSegments = segments.map(segment => {
    if (slugMapping[segment]) {
      return slugMapping[segment][targetLang]
    }
    return segment // Keep as-is for product slugs, blog slugs, etc.
  })
  
  const translatedPath = '/' + translatedSegments.join('/')
  
  // Add language prefix for non-Vietnamese
  if (targetLang === 'vi') {
    return translatedPath === '/' ? '/' : translatedPath
  }
  return `/${targetLang}${translatedPath}`
}
