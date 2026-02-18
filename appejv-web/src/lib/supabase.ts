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
  code?: string
  name: string
  slug: string
  category_id?: string
  price: number
  unit: string
  stock?: number
  image_url?: string
  description?: string
  specifications?: string
  created_at: string
  updated_at?: string
  deleted_at?: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  display_order?: number
}

// Helper functions
export async function getProducts(category?: string) {
  let query = supabase
    .from('products')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (category && category !== 'all') {
    query = query.eq('category_id', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  console.log('Supabase query returned', data?.length || 0, 'products')
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
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    if (!data || data.length === 0) {
      console.warn('No categories found in database')
      return []
    }

    console.log('Supabase query returned', data.length, 'categories:', data)
    
    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.id,
      icon: getCategoryIcon(cat.name),
      display_order: cat.display_order
    }))
  } catch (err) {
    console.error('Exception in getCategories:', err)
    return []
  }
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

function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase()
  const icons: Record<string, string> = {
    'pig': '🐷',
    'lợn': '🐷',
    'heo': '🐷',
    'poultry': '🐔',
    'gà': '🐔',
    'gia cầm': '🐔',
    'fish': '🐟',
    'cá': '🐟',
    'thủy sản': '🐟',
    'cattle': '🐄',
    'bò': '🐄',
    'gia súc': '🐄',
    'coffee': '☕',
    'cà phê': '☕',
    'tea': '🍵',
    'trà': '🍵',
    'supplies': '📦',
    'vật tư': '📦',
    'syrup': '🍯',
    'siro': '🍯'
  }
  
  // Try to find matching icon
  for (const [key, icon] of Object.entries(icons)) {
    if (name.includes(key)) {
      return icon
    }
  }
  
  return '🏭'
}
