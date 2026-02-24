import type { APIRoute } from 'astro'
import { getProducts } from '../lib/supabase'

interface SitemapPage {
  url: string
  priority: string
  changefreq: string
  image?: string
}

export const GET: APIRoute = async () => {
  const SITE_URL = 'https://appejv.app'
  const products = await getProducts()
  
  const staticPages: SitemapPage[] = [
    // Vietnamese pages
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/san-pham', priority: '0.9', changefreq: 'daily' },
    { url: '/gioi-thieu', priority: '0.8', changefreq: 'monthly' },
    { url: '/tin-tuc', priority: '0.8', changefreq: 'daily' },
    { url: '/cau-hoi-thuong-gap', priority: '0.7', changefreq: 'weekly' },
    { url: '/tai-lieu', priority: '0.7', changefreq: 'weekly' },
    { url: '/lien-he', priority: '0.7', changefreq: 'monthly' },
    { url: '/chinh-sach-bao-mat', priority: '0.3', changefreq: 'yearly' },
    { url: '/dieu-khoan-su-dung', priority: '0.3', changefreq: 'yearly' },
    { url: '/chinh-sach-cookie', priority: '0.3', changefreq: 'yearly' },
    
    // English pages
    { url: '/en', priority: '1.0', changefreq: 'daily' },
    { url: '/en/products', priority: '0.9', changefreq: 'daily' },
    { url: '/en/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/en/news', priority: '0.8', changefreq: 'daily' },
    { url: '/en/faq', priority: '0.7', changefreq: 'weekly' },
    { url: '/en/downloads', priority: '0.7', changefreq: 'weekly' },
    { url: '/en/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/en/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/en/terms-of-service', priority: '0.3', changefreq: 'yearly' },
    { url: '/en/cookie-policy', priority: '0.3', changefreq: 'yearly' },
    
    // Chinese pages
    { url: '/cn', priority: '1.0', changefreq: 'daily' },
    { url: '/cn/products', priority: '0.9', changefreq: 'daily' },
    { url: '/cn/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/cn/news', priority: '0.8', changefreq: 'daily' },
    { url: '/cn/faq', priority: '0.7', changefreq: 'weekly' },
    { url: '/cn/downloads', priority: '0.7', changefreq: 'weekly' },
    { url: '/cn/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/cn/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/cn/terms-of-service', priority: '0.3', changefreq: 'yearly' },
    { url: '/cn/cookie-policy', priority: '0.3', changefreq: 'yearly' },
  ]
  
  const productPages: SitemapPage[] = products.flatMap(product => [
    // Vietnamese product pages
    {
      url: `/san-pham/${product.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      image: product.image_url
    },
    // English product pages
    {
      url: `/en/products/${product.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      image: product.image_url
    },
    // Chinese product pages
    {
      url: `/cn/products/${product.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      image: product.image_url
    }
  ])
  
  const allPages: SitemapPage[] = [...staticPages, ...productPages]
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
