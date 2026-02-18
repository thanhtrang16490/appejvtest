import type { APIRoute } from 'astro'
import { getProducts } from '../lib/supabase'

export const GET: APIRoute = async () => {
  const SITE_URL = 'https://appejv.app'
  const products = await getProducts()
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/gioi-thieu', priority: '0.8', changefreq: 'monthly' },
    { url: '/san-pham', priority: '0.9', changefreq: 'weekly' },
    { url: '/lien-he', priority: '0.7', changefreq: 'monthly' },
  ]
  
  const productPages = products.map(product => ({
    url: `/san-pham/${product.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    image: product.image_url
  }))
  
  const allPages = [...staticPages, ...productPages]
  const lastmod = new Date().toISOString().split('T')[0]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.image ? `
    <image:image>
      <image:loc>${page.image}</image:loc>
      <image:title>${page.url.split('/').pop()}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
