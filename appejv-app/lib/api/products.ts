import { apiClient, ApiResponse } from './client'
import { getAccessToken } from '@/lib/auth/token'

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
  deleted_at?: string
  created_at: string
}

export interface ProductsQuery {
  category?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateProductData {
  code: string
  name: string
  unit?: string
  stock?: number
  price?: number
  category?: string
  category_id?: number
  description?: string
  image_url?: string
  specifications?: string
}

export interface UpdateProductData {
  name?: string
  unit?: string
  stock?: number
  price?: number
  category?: string
  category_id?: number
  description?: string
  image_url?: string
  specifications?: string
}

export const productsApi = {
  // Get all products (public, but send token if available)
  async getAll(query?: ProductsQuery): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams()
    if (query?.category) params.append('category', query.category)
    if (query?.search) params.append('search', query.search)
    if (query?.page) params.append('page', query.page.toString())
    if (query?.limit) params.append('limit', query.limit.toString())

    const queryString = params.toString()
    const token = await getAccessToken()
    
    return apiClient.get<Product[]>(
      `/products${queryString ? `?${queryString}` : ''}`,
      token || undefined
    )
  },

  // Get single product (public, but send token if available)
  async getById(id: number): Promise<ApiResponse<Product>> {
    const token = await getAccessToken()
    return apiClient.get<Product>(`/products/${id}`, token || undefined)
  },

  // Create product (admin, sale_admin)
  async create(data: CreateProductData): Promise<ApiResponse<Product>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.post<Product>('/products', data, token)
  },

  // Update product (admin, sale_admin)
  async update(
    id: number,
    data: UpdateProductData
  ): Promise<ApiResponse<Product>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.put<Product>(`/products/${id}`, data, token)
  },

  // Delete product (admin, sale_admin)
  async delete(id: number): Promise<ApiResponse<Product>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.delete<Product>(`/products/${id}`, token)
  },
}
