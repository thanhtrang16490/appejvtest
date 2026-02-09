/**
 * API Client for Astro (Public Website)
 * Fetches data from Go Fiber API (appejv-api)
 */

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8081/api/v1'

export interface Product {
  id: number
  code: string
  name: string
  slug?: string
  unit?: string
  stock: number
  image_url?: string
  price: number
  category?: string
  category_id?: number
  description?: string
  specifications?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
}

interface ApiResponse<T> {
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// Get all products (public endpoint)
export async function getProducts(params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = `${API_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    console.log('Fetching products from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`API error: HTTP ${response.status}`)
      return []
    }
    
    const result: ApiResponse<Product[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Get single product by ID (public endpoint)
export async function getProduct(id: number): Promise<Product | null> {
  try {
    const url = `${API_URL}/products/${id}`
    console.log('Fetching product from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`API error: HTTP ${response.status}`)
      return null
    }
    
    const result: ApiResponse<Product> = await response.json()
    return result.data || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await getProducts()
    return products.find(p => p.slug === slug) || null
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

// Get categories (derived from products)
export async function getCategories(): Promise<Category[]> {
  try {
    const products = await getProducts()
    const categoryMap = new Map<string, Category>()
    
    products.forEach(product => {
      if (product.category && !categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          id: product.category,
          name: getCategoryName(product.category),
          slug: product.category,
          icon: getCategoryIcon(product.category)
        })
      }
    })
    
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Helper: Get category display name
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    'pig': 'Thức ăn cho heo',
    'poultry': 'Thức ăn cho gia cầm',
    'fish': 'Thức ăn cho thủy sản',
    'cattle': 'Thức ăn cho gia súc',
    'feed': 'Thức ăn chăn nuôi',
    'supplement': 'Phụ gia dinh dưỡng',
    'Lợn': 'Thức ăn cho lợn',
    'Gà': 'Thức ăn cho gà',
    'Thủy Sản': 'Thức ăn thủy sản',
    'Coffee': 'Cà phê',
    'Tea': 'Trà',
    'Supplies': 'Vật tư',
    'Syrup': 'Siro'
  }
  return names[category] || category
}

// Helper: Get category icon
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'pig': '🐷',
    'poultry': '🐔',
    'fish': '🐟',
    'cattle': '🐄',
    'feed': '🌾',
    'supplement': '💊',
    'Lợn': '🐷',
    'Gà': '🐔',
    'Thủy Sản': '🐟',
    'Coffee': '☕',
    'Tea': '🍵',
    'Supplies': '📦',
    'Syrup': '🍯'
  }
  return icons[category] || '📦'
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
