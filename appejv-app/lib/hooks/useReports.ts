import { useQuery } from '@tanstack/react-query'
import { reportsApi, ReportsQuery } from '@/lib/api'

export function useSalesReport(query?: ReportsQuery) {
  return useQuery({
    queryKey: ['reports', 'sales', query],
    queryFn: async () => {
      return reportsApi.getSales(query || {})
    },
  })
}

export function useRevenueReport(query?: ReportsQuery) {
  return useQuery({
    queryKey: ['reports', 'revenue', query],
    queryFn: async () => {
      return reportsApi.getRevenue(query || {})
    },
  })
}

export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: ['reports', 'top-products', limit],
    queryFn: async () => {
      return reportsApi.getTopProducts(limit)
    },
  })
}

export function useTopCustomers(limit: number = 10) {
  return useQuery({
    queryKey: ['reports', 'top-customers', limit],
    queryFn: async () => {
      return reportsApi.getTopCustomers(limit)
    },
  })
}
