import { apiClient, ApiResponse } from './client'
import { Product } from './products'
import { getAccessToken } from '@/lib/auth/token'

export interface AdjustInventoryData {
  product_id: number
  quantity: number
  reason?: string
}

export const inventoryApi = {
  // Get all inventory (authenticated)
  async getAll(): Promise<ApiResponse<Product[]>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.get<Product[]>('/inventory', token)
  },

  // Get low stock products (authenticated)
  async getLowStock(threshold: number): Promise<ApiResponse<Product[]>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.get<Product[]>(
      `/inventory/low-stock?threshold=${threshold}`,
      token
    )
  },

  // Adjust inventory (admin, sale_admin)
  async adjust(data: AdjustInventoryData): Promise<ApiResponse<Product>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.post<Product>('/inventory/adjust', data, token)
  },
}
