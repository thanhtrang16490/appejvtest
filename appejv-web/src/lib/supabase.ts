import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`)
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  unit: string
  image_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

// Helper functions
export async function getProducts(category?: string) {
  let query = supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .order('category', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Get unique categories
  const uniqueCategories = [...new Set(data.map(item => item.category))]
  
  return uniqueCategories.map(cat => ({
    id: cat,
    name: getCategoryName(cat),
    slug: cat,
    icon: getCategoryIcon(cat)
  }))
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    'pig': 'Thức ăn cho heo',
    'poultry': 'Thức ăn cho gia cầm',
    'fish': 'Thức ăn cho thủy sản',
    'cattle': 'Thức ăn cho gia súc'
  }
  return names[category] || category
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'pig': '🐷',
    'poultry': '🐔',
    'fish': '🐟',
    'cattle': '🐄'
  }
  return icons[category] || '🏭'
}
