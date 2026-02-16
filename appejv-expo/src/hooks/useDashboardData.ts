import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ErrorTracker } from '../lib/error-tracking'

interface DashboardStats {
  orderedCount: number
  lowStockCount: number
  customerCount: number
  totalRevenue: number
}

interface TeamStats {
  teamMembers: number
  teamCustomers: number
  teamOrders: number
  teamRevenue: number
}

/**
 * Custom hook để fetch dashboard data
 * @param activeFilter - Filter thời gian hiện tại
 * @param profile - User profile
 * @returns Dashboard data và loading states
 */
export function useDashboardData(activeFilter: string, profile: any) {
  const [stats, setStats] = useState<DashboardStats>({
    orderedCount: 0,
    lowStockCount: 0,
    customerCount: 0,
    totalRevenue: 0,
  })
  const [teamStats, setTeamStats] = useState<TeamStats>({
    teamMembers: 0,
    teamCustomers: 0,
    teamOrders: 0,
    teamRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const getDateRange = (filter: string) => {
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
        break
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        break
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
        break
      case 'thisQuarter':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999)
        break
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
        break
      case 'all':
        startDate = new Date(2000, 0, 1)
        break
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  }

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { startDate, endDate } = getDateRange(activeFilter)

      // Fetch orders
      let ordersQuery = supabase
        .from('orders')
        .select('id, total_amount, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      if (profile?.role === 'sale') {
        ordersQuery = ordersQuery.eq('created_by', user.id)
      }

      const { data: orders, error: ordersError } = await ordersQuery

      if (ordersError) throw ordersError

      const orderedCount = orders?.length || 0
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      // Fetch low stock products
      const { data: lowStockProducts, error: lowStockError } = await supabase
        .from('products')
        .select('id')
        .lt('stock_quantity', 10)

      if (lowStockError) throw lowStockError

      // Fetch customers
      let customersQuery = supabase.from('customers').select('id', { count: 'exact' })

      if (profile?.role === 'sale') {
        customersQuery = customersQuery.eq('assigned_to', user.id)
      }

      const { count: customerCount, error: customersError } = await customersQuery

      if (customersError) throw customersError

      setStats({
        orderedCount,
        lowStockCount: lowStockProducts?.length || 0,
        customerCount: customerCount || 0,
        totalRevenue,
      })
    } catch (error) {
      ErrorTracker.error(error as Error, 'useDashboardData.fetchStats')
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          customers (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (profile?.role === 'sale') {
        query = query.eq('created_by', user.id)
      }

      const { data, error } = await query

      if (error) throw error

      setRecentOrders(data || [])
    } catch (error) {
      ErrorTracker.error(error as Error, 'useDashboardData.fetchRecentOrders')
      console.error('Error fetching recent orders:', error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchStats(), fetchRecentOrders()])
    setLoading(false)
  }

  useEffect(() => {
    if (profile) {
      fetchData()
    }
  }, [activeFilter, profile])

  return {
    stats,
    teamStats,
    recentOrders,
    topPerformers,
    loading,
    refetch: fetchData,
  }
}
