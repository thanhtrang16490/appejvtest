import { apiClient, ApiResponse } from './client'

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
  async getSales(
    query: ReportsQuery,
    token: string
  ): Promise<ApiResponse<SalesReportData>> {
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
  async getRevenue(
    query: ReportsQuery,
    token: string
  ): Promise<ApiResponse<RevenueData[]>> {
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
  async getTopProducts(
    limit: number,
    token: string
  ): Promise<ApiResponse<Record<number, number>>> {
    return apiClient.get<Record<number, number>>(
      `/reports/top-products?limit=${limit}`,
      token
    )
  },

  // Get top customers (authenticated)
  async getTopCustomers(
    limit: number,
    token: string
  ): Promise<ApiResponse<Record<number, number>>> {
    return apiClient.get<Record<number, number>>(
      `/reports/top-customers?limit=${limit}`,
      token
    )
  },
}
