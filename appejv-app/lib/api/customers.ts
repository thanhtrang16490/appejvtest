import { apiClient, ApiResponse } from './client'
import { getAccessToken } from '@/lib/auth/token'

export interface Customer {
  id: number
  code: string
  name: string
  address?: string
  phone?: string
  assigned_sale?: string
  deleted_at?: string
  created_at: string
}

export interface CustomersQuery {
  search?: string
  page?: number
  limit?: number
}

export interface CreateCustomerData {
  code: string
  name: string
  address?: string
  phone?: string
  assigned_sale?: string
}

export interface UpdateCustomerData {
  name?: string
  address?: string
  phone?: string
  assigned_sale?: string
}

export const customersApi = {
  // Get all customers (authenticated)
  async getAll(query: CustomersQuery): Promise<ApiResponse<Customer[]>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }

    const params = new URLSearchParams()
    if (query.search) params.append('search', query.search)
    if (query.page) params.append('page', query.page.toString())
    if (query.limit) params.append('limit', query.limit.toString())

    const queryString = params.toString()
    return apiClient.get<Customer[]>(
      `/customers${queryString ? `?${queryString}` : ''}`,
      token
    )
  },

  // Get single customer (authenticated)
  async getById(id: number): Promise<ApiResponse<Customer>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.get<Customer>(`/customers/${id}`, token)
  },

  // Create customer (admin, sale_admin, sale)
  async create(data: CreateCustomerData): Promise<ApiResponse<Customer>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.post<Customer>('/customers', data, token)
  },

  // Update customer (authenticated)
  async update(
    id: number,
    data: UpdateCustomerData
  ): Promise<ApiResponse<Customer>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.put<Customer>(`/customers/${id}`, data, token)
  },

  // Delete customer (admin, sale_admin)
  async delete(id: number): Promise<ApiResponse<Customer>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.delete<Customer>(`/customers/${id}`, token)
  },
}
