import { apiClient, ApiResponse } from './client'
import { Product } from './products'

export interface AdjustInventoryData {
  product_id: number
  quantity: number
  reason?: string
}

export const inventoryApi = {
  // Get all inventory (authenticated)
  async getAll(token: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/inventory', token)
  },

  // Get low stock products (authenticated)
  async getLowStock(
    threshold: number,
    token: string
  ): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(
      `/inventory/low-stock?threshold=${threshold}`,
      token
    )
  },

  // Adjust inventory (admin, sale_admin)
  async adjust(
    data: AdjustInventoryData,
    token: string
  ): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/inventory/adjust', data, token)
  },
}
