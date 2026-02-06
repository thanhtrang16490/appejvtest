import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/customer/',
          '/sales/',
          '/auth/',
          '/api/',
          '/checkout/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/customer/',
          '/sales/',
          '/auth/',
          '/api/',
          '/checkout/',
        ],
      },
    ],
    sitemap: 'https://appejv.app/sitemap.xml',
  }
}
