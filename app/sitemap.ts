import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

type ProductForSitemap = {
  id: number
  slug: string | null
  created_at: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://appejv.app'
  
  // Fetch all products with slugs
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, id, created_at')
    .order('id', { ascending: true })
  
  // Generate product URLs
  const productUrls: MetadataRoute.Sitemap = ((products || []) as ProductForSitemap[]).map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug || product.id}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/customer-login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
  
  return [...staticUrls, ...productUrls]
}
