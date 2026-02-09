import { useQuery } from '@tanstack/react-query'
import { reportsApi, ReportsQuery } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

export function useSalesReport(query?: ReportsQuery) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'sales', query],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return reportsApi.getSales(query || {}, session.access_token)
    },
  })
}

export function useRevenueReport(query?: ReportsQuery) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'revenue', query],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return reportsApi.getRevenue(query || {}, session.access_token)
    },
  })
}

export function useTopProducts(limit: number = 10) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'top-products', limit],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return reportsApi.getTopProducts(limit, session.access_token)
    },
  })
}

export function useTopCustomers(limit: number = 10) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'top-customers', limit],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return reportsApi.getTopCustomers(limit, session.access_token)
    },
  })
}
