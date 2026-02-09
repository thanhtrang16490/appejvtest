import { apiClient, ApiResponse } from './client'
import { getAccessToken } from '@/lib/auth/token'
import { Customer } from './customers'
import { Product } from './products'

export interface Order {
  id: number
  customer_id: number
  sale_id: string
  status: string
  total_amount: number
  deleted_at?: string
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_order: number
}

export interface OrderWithDetails {
  order: Order
  items: OrderItem[]
  customer?: Customer
  item_products?: Product[]
}

export interface OrdersQuery {
  status?: string
  customer_id?: number
  page?: number
  limit?: number
}

export interface CreateOrderData {
  customer_id: number
  items: {
    product_id: number
    quantity: number
  }[]
}

export interface UpdateOrderData {
  status?: string
}

export const ordersApi = {
  // Get all orders (authenticated)
  async getAll(query: OrdersQuery): Promise<ApiResponse<Order[]>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }

    const params = new URLSearchParams()
    if (query.status) params.append('status', query.status)
    if (query.customer_id) params.append('customer_id', query.customer_id.toString())
    if (query.page) params.append('page', query.page.toString())
    if (query.limit) params.append('limit', query.limit.toString())

    const queryString = params.toString()
    return apiClient.get<Order[]>(
      `/orders${queryString ? `?${queryString}` : ''}`,
      token
    )
  },

  // Get single order with details (authenticated)
  async getById(id: number): Promise<ApiResponse<OrderWithDetails>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.get<OrderWithDetails>(`/orders/${id}`, token)
  },

  // Create order (authenticated)
  async create(data: CreateOrderData): Promise<ApiResponse<Order>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.post<Order>('/orders', data, token)
  },

  // Update order (authenticated)
  async update(
    id: number,
    data: UpdateOrderData
  ): Promise<ApiResponse<Order>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.put<Order>(`/orders/${id}`, data, token)
  },

  // Delete order (admin, sale_admin)
  async delete(id: number): Promise<ApiResponse<Order>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.delete<Order>(`/orders/${id}`, token)
  },
}
