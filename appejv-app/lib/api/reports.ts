import { apiClient, ApiResponse } from './client'
import { getAccessToken } from '@/lib/auth/token'

export interface SalesReportData {
  total_orders: number
  total_revenue: number
  status_count: Record<string, number>
  orders: unknown[]
}

export interface RevenueData {
  created_at: string
  total_amount: number
  status: string
}

export interface ReportsQuery {
  start_date?: string
  end_date?: string
  limit?: number
}

export const reportsApi = {
  // Get sales report (authenticated)
  async getSales(query: ReportsQuery): Promise<ApiResponse<SalesReportData>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }

    const params = new URLSearchParams()
    if (query.start_date) params.append('start_date', query.start_date)
    if (query.end_date) params.append('end_date', query.end_date)

    const queryString = params.toString()
    return apiClient.get<SalesReportData>(
      `/reports/sales${queryString ? `?${queryString}` : ''}`,
      token
    )
  },

  // Get revenue report (authenticated)
  async getRevenue(query: ReportsQuery): Promise<ApiResponse<RevenueData[]>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }

    const params = new URLSearchParams()
    if (query.start_date) params.append('start_date', query.start_date)
    if (query.end_date) params.append('end_date', query.end_date)

    const queryString = params.toString()
    return apiClient.get<RevenueData[]>(
      `/reports/revenue${queryString ? `?${queryString}` : ''}`,
      token
    )
  },

  // Get top products (authenticated)
  async getTopProducts(limit: number): Promise<ApiResponse<Record<number, number>>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.get<Record<number, number>>(
      `/reports/top-products?limit=${limit}`,
      token
    )
  },

  // Get top customers (authenticated)
  async getTopCustomers(limit: number): Promise<ApiResponse<Record<number, number>>> {
    const token = await getAccessToken()
    if (!token) {
      return { error: 'Authentication required' }
    }
    return apiClient.get<Record<number, number>>(
      `/reports/top-customers?limit=${limit}`,
      token
    )
  },
}
