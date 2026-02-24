export const languages = {
  vi: 'Tiếng Việt',
  en: 'English',
  cn: '中文'
}

export const defaultLang = 'vi'

export type Language = keyof typeof languages

export const ui = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.products': 'Sản phẩm',
    'nav.news': 'Tin tức',
    'nav.contact': 'Liên hệ',
    'nav.login': 'Đăng nhập',
    'nav.faq': 'FAQ',
    'nav.downloads': 'Tải tài liệu',
    
    'footer.support': 'Hỗ trợ',
    'footer.company': 'Công ty',
    'footer.legal': 'Pháp lý',
    'footer.products': 'Sản phẩm',
    'footer.allRights': 'Tất cả quyền được bảo lưu',
    'footer.established': 'Thành lập năm',
    
    'common.readMore': 'Xem thêm',
    'common.learnMore': 'Tìm hiểu thêm',
    'common.contactUs': 'Liên hệ ngay',
    'common.viewProducts': 'Xem sản phẩm',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.all': 'Tất cả',
    'common.category': 'Danh mục',
    'common.showing': 'Hiển thị',
    'common.results': 'kết quả',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.faq': 'FAQ',
    'nav.downloads': 'Downloads',
    
    'footer.support': 'Support',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.products': 'Products',
    'footer.allRights': 'All rights reserved',
    'footer.established': 'Established',
    
    'common.readMore': 'Read more',
    'common.learnMore': 'Learn more',
    'common.contactUs': 'Contact us',
    'common.viewProducts': 'View products',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.category': 'Category',
    'common.showing': 'Showing',
    'common.results': 'results',
  },
  cn: {
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.products': '产品',
    'nav.news': '新闻',
    'nav.contact': '联系我们',
    'nav.login': '登录',
    'nav.faq': '常见问题',
    'nav.downloads': '下载资料',
    
    'footer.support': '支持',
    'footer.company': '公司',
    'footer.legal': '法律',
    'footer.products': '产品',
    'footer.allRights': '版权所有',
    'footer.established': '成立于',
    
    'common.readMore': '阅读更多',
    'common.learnMore': '了解更多',
    'common.contactUs': '联系我们',
    'common.viewProducts': '查看产品',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.all': '全部',
    'common.category': '类别',
    'common.showing': '显示',
    'common.results': '结果',
  }
} as const

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in languages) return lang as Language
  return defaultLang
}

export function useTranslations(lang: Language) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}

export function getLocalizedPath(path: string, lang: Language) {
  if (lang === defaultLang) return path
  return `/${lang}${path}`
}
