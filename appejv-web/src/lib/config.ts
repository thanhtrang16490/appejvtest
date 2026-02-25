/**
 * Configuration constants for appejv-web
 * Centralized place for all hardcoded values
 */

// Site Configuration
export const SITE_CONFIG = {
  name: 'APPE JV Việt Nam',
  nameEn: 'APPE JV Vietnam',
  nameCn: 'APPE JV越南',
  companyName: 'Công ty Cổ phần APPE JV Việt Nam',
  companyNameEn: 'APPE JV Vietnam Joint Stock Company',
  companyNameCn: 'APPE JV越南股份公司',
  description: 'APPE JV chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao cho heo, gia cầm và thủy sản. Thành lập từ 2008, ứng dụng công nghệ tiên tiến, xuất khẩu sang Đông Nam Á và Châu Âu.',
  descriptionEn: 'APPE JV specializes in manufacturing and supplying high-quality animal feed for pigs, poultry, and aquaculture. Established in 2008, applying advanced technology, exporting to Southeast Asia and Europe.',
  descriptionCn: 'APPE JV专业生产和供应高质量的猪、家禽和水产饲料。成立于2008年，应用先进技术，出口到东南亚和欧洲。',
  url: 'https://appejv.app',
  appUrl: 'https://app.appejv.app',
  foundedYear: '2008',
  establishedYear: 2008,
} as const

// Contact Information
export const CONTACT_CONFIG = {
  phone: '+84-3513-595-202',
  phoneDisplay: '+84 351 359 520',
  phoneShort: '0351359520',
  email: 'info@appe.com.vn',
  address: {
    street: 'Km 50 Quốc lộ 1A, Xã Tiên Tân',
    city: 'Phủ Lý',
    region: 'Hà Nam',
    country: 'VN',
    coordinates: {
      lat: 20.5385,
      lng: 105.9189,
    },
  },
  geo: {
    region: 'VN-63',
    placename: 'Hà Nam',
  },
} as const

// Social Media Links
export const SOCIAL_CONFIG = {
  facebook: 'https://www.facebook.com/appevn',
  youtube: '#',
  linkedin: '#',
  zalo: 'https://zalo.me/yourzalo',
  website: 'https://appe.com.vn',
} as const

// SEO Configuration
export const SEO_CONFIG = {
  googleVerification: '', // Add your Google verification code
  googleAnalyticsId: 'G-RGN1EGREY6',
  facebookPixelId: '', // Add your Facebook Pixel ID
  facebookDomainVerification: '', // Add your Facebook domain verification
  bingVerification: '', // Add Bing verification code
  yandexVerification: '', // Add Yandex verification code
  zaloAppId: '', // Add your Zalo App ID
} as const

// Business Registration
export const BUSINESS_CONFIG = {
  ministryOfIndustryAndTrade: 'http://online.gov.vn/Home/WebDetails/110913',
  taxId: '',
} as const

// Product Categories
export const PRODUCT_CATEGORIES = [
  {
    id: 'pig',
    name: 'Thức ăn cho heo',
    nameEn: 'Pig Feed',
    nameCn: '猪饲料',
    slug: 'thuc-an-heo',
    slugEn: 'pig-feed',
    slugCn: 'pig-feed-cn',
    icon: '🐷',
    color: '#e11d48',
  },
  {
    id: 'poultry',
    name: 'Thức ăn cho gia cầm',
    nameEn: 'Poultry Feed',
    nameCn: '家禽饲料',
    slug: 'thuc-an-gia-cam',
    slugEn: 'poultry-feed',
    slugCn: 'poultry-feed-cn',
    icon: '🐔',
    color: '#f59e0b',
  },
  {
    id: 'fish',
    name: 'Thức ăn cho thủy sản',
    nameEn: 'Fish Feed',
    nameCn: '水产饲料',
    slug: 'thuy-san',
    slugEn: 'fish-feed',
    slugCn: 'fish-feed-cn',
    icon: '🐟',
    color: '#175ead',
  },
] as const

// Statistics
export const STATS_CONFIG = {
  yearsExperience: 16,
  customers: 1500,
  productsPerYear: 50000,
  satisfactionRate: 98,
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  enable3DAnimations: true,
  enableExitIntentPopup: true,
  enableStickyCTA: true,
  enableParallax: true,
  enableCountUpAnimations: true,
} as const

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  threeJsLazyLoad: true,
  imageLazyLoad: true,
  prefetchStrategy: 'viewport' as const,
  cacheVersion: '1.0.0',
} as const

