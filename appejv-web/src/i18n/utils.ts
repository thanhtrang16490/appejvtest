import { ui, defaultLang, type Language } from './languages'

export function useTranslations(lang: Language = defaultLang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang]?.[key] || ui[defaultLang][key]
  }
}

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/')
  if (lang === 'en' || lang === 'cn') return lang
  return defaultLang
}

export function getLocalizedPath(path: string, lang: Language): string {
  if (lang === defaultLang) return path
  return `/${lang}${path}`
}

export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/')
  if (segments[1] === 'en' || segments[1] === 'cn') {
    segments.splice(1, 1)
  }
  return segments.join('/') || '/'
}
