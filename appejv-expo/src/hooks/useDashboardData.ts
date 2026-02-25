import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { errorTracker } from '../lib/error-tracking'
import type { DashboardStats, TeamStats } from '../types'

// ─── Query Key Factory ────────────────────────────────────────────────────────

/**
 * Centralized query key factory cho dashboard queries.
 * Dùng để invalidate cache chính xác.
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (filter: string, profileId: string) =>
    ['dashboard', 'stats', filter, profileId] as const,
  recentOrders: (profileId: string) =>
    ['dashboard', 'recentOrders', profileId] as const,
}

// ─── Utility: Date Range ──────────────────────────────────────────────────────

/**
 * Tính toán date range dựa trên filter string.
 * Pure function, không có side effects.
 */
export function getDateRange(filter: string): { startDate: string; endDate: string } {
  const now = new Date()
  let startDate = new Date()
  let endDate = new Date()

  switch (filter) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      break
    case 'yesterday':
      startDate.setDate(now.getDate() - 1)
      startDate.setHours(0, 0, 0, 0)
      endDate.setDate(now.getDate() - 1)
      endDate.setHours(23, 59, 59, 999)
      break
    case 'last7days':
      startDate.setDate(now.getDate() - 7)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      break
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      break
    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      break
    case 'thisQuarter': {
      const quarter = Math.floor(now.getMonth() / 3)
      startDate = new Date(now.getFullYear(), quarter * 3, 1)
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999)
      break
    }
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      break
    case 'all':
      startDate = new Date(2000, 0, 1)
      endDate = new Date(now.getFullYear() + 1, 0, 1)
      break
    default:
      startDate.setHours(0, 0, 0, 0)
  }

  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
}

// ─── Query Functions ──────────────────────────────────────────────────────────

/**
 * Fetch dashboard stats từ Supabase.
 * Được dùng làm queryFn cho useQuery.
 */
async function fetchDashboardStats(
  filter: string,
  profile: any
): Promise<DashboardStats> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { startDate, endDate } = getDateRange(filter)

  const isSale = profile?.role === 'sale'
  const isSaleAdmin = profile?.role === 'sale_admin'

  // For Sale Admin, fetch managed sales IDs
  let managedSaleIds: string[] = []
  if (isSaleAdmin) {
    const { data: managedSales } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', user.id)
    managedSaleIds = managedSales?.map((s: any) => s.id) || []
  }

  // 1. Ordered count
  let orderedQuery = supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ordered')
    .gte('created_at', startDate)
    .lt('created_at', endDate)

  if (isSale) {
    orderedQuery = orderedQuery.eq('sale_id', user.id)
  } else if (isSaleAdmin) {
    orderedQuery = orderedQuery.in('sale_id', [user.id, ...managedSaleIds])
  }
  const { count: orderedCount } = await orderedQuery

  // 2. Low stock products
  const { count: lowStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lt('stock', 20)

  // 3. Customer count
  let customerQuery = supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (isSale) {
    customerQuery = customerQuery.eq('assigned_to', user.id)
  } else if (isSaleAdmin) {
    customerQuery = customerQuery.in('assigned_to', [user.id, ...managedSaleIds])
  }
  const { count: customerCount } = await customerQuery

  // 4. Total revenue from completed orders
  let revenueQuery = supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate)

  if (isSale) {
    revenueQuery = revenueQuery.eq('sale_id', user.id)
  } else if (isSaleAdmin) {
    revenueQuery = revenueQuery.in('sale_id', [user.id, ...managedSaleIds])
  }
  const { data: completedOrders } = await revenueQuery
  const totalRevenue =
    completedOrders?.reduce((sum, o: any) => sum + (o.total_amount || 0), 0) || 0

  return {
    orderedCount: orderedCount || 0,
    lowStockCount: lowStockCount || 0,
    customerCount: customerCount || 0,
    totalRevenue,
  }
}

/**
 * Fetch recent orders từ Supabase.
 * Được dùng làm queryFn cho useQuery.
 */
async function fetchRecentOrdersData(profile: any): Promise<any[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const isSale = profile?.role === 'sale'
  const isSaleAdmin = profile?.role === 'sale_admin'

  let managedSaleIds: string[] = []
  if (isSaleAdmin) {
    const { data: managedSales } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', user.id)
    managedSaleIds = managedSales?.map((s: any) => s.id) || []
  }

  let query = supabase
    .from('orders')
    .select('id, status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (isSale) {
    query = query.eq('sale_id', user.id)
  } else if (isSaleAdmin) {
    query = query.in('sale_id', [user.id, ...managedSaleIds])
  }

  const { data, error } = await query
  if (error) throw error

  return data || []
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Custom hook để fetch dashboard data sử dụng React Query.
 *
 * Lợi ích so với useState/useEffect:
 * - Tự động cache theo queryKey (filter + profileId)
 * - Background refetch khi stale
 * - Deduplication: nhiều component dùng cùng key → 1 request
 * - `refetch` function để manual refresh
 *
 * @param activeFilter - Filter thời gian hiện tại
 * @param profile - User profile (cần có id và role)
 * @returns Dashboard data và loading states
 */
export function useDashboardData(activeFilter: string, profile: any) {
  const queryClient = useQueryClient()
  const profileId = profile?.id ?? ''

  // ── Stats query ──────────────────────────────────────────────────────────
  const {
    data: stats = {
      orderedCount: 0,
      lowStockCount: 0,
      customerCount: 0,
      totalRevenue: 0,
    },
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<DashboardStats>({
    queryKey: dashboardKeys.stats(activeFilter, profileId),
    queryFn: () => fetchDashboardStats(activeFilter, profile),
    enabled: !!profile,
    staleTime: 2 * 60 * 1_000, // 2 phút
    onError: (error: Error) => {
      errorTracker.logError(error, { action: 'useDashboardData.fetchStats' })
    },
  } as any)

  // ── Recent orders query ──────────────────────────────────────────────────
  const {
    data: recentOrders = [],
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery<any[]>({
    queryKey: dashboardKeys.recentOrders(profileId),
    queryFn: () => fetchRecentOrdersData(profile),
    enabled: !!profile,
    staleTime: 1 * 60 * 1_000, // 1 phút (orders thay đổi thường xuyên hơn)
    onError: (error: Error) => {
      errorTracker.logError(error, { action: 'useDashboardData.fetchRecentOrders' })
    },
  } as any)

  // ── Combined refetch ─────────────────────────────────────────────────────
  const refetch = async () => {
    await Promise.all([refetchStats(), refetchOrders()])
  }

  // ── Placeholder team stats (for backward compat) ─────────────────────────
  const teamStats: TeamStats = {
    teamMembers: 0,
    teamCustomers: 0,
    teamOrders: 0,
    teamRevenue: 0,
  }

  return {
    stats,
    teamStats,
    recentOrders,
    topPerformers: [] as any[],
    loading: statsLoading || ordersLoading,
    error: statsError || ordersError,
    refetch,
  }
}
