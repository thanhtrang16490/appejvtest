'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import Link from 'next/link'
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Receipt,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react'

interface Stats {
  orderedCount: number
  customerCount: number
  lowStockCount: number
  totalRevenue: number
}

interface RecentOrder {
  id: number
  status: string
  total_amount: number
  created_at: string
  customer?: { name?: string }
}

const QUICK_ACTIONS = [
  {
    href: '/sales/selling',
    label: 'Bán hàng',
    icon: ShoppingCart,
    color: 'bg-blue-500',
    description: 'Tạo đơn hàng mới',
  },
  {
    href: '/sales/orders',
    label: 'Đơn hàng',
    icon: Receipt,
    color: 'bg-amber-500',
    description: 'Quản lý đơn hàng',
  },
  {
    href: '/sales/customers',
    label: 'Khách hàng',
    icon: Users,
    color: 'bg-emerald-500',
    description: 'Danh sách khách hàng',
  },
  {
    href: '/sales/reports',
    label: 'Báo cáo',
    icon: BarChart3,
    color: 'bg-purple-500',
    description: 'Xem báo cáo',
  },
]

export default function SalesDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    orderedCount: 0,
    customerCount: 0,
    lowStockCount: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user, authLoading, router])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (!profileData || !['sale', 'sale_admin', 'admin'].includes(profileData.role)) {
        router.push('/')
        return
      }

      setProfile(profileData)

      // Fetch stats
      const isSale = profileData.role === 'sale'

      // Count ordered orders
      let ordersQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ordered')

      if (isSale) {
        ordersQuery = ordersQuery.eq('sale_id', user.id)
      }

      const { count: orderedCount } = await ordersQuery

      // Count customers
      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

      // Count low stock products
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 10)

      // Calculate total revenue (completed orders)
      let revenueQuery = supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')

      if (isSale) {
        revenueQuery = revenueQuery.eq('sale_id', user.id)
      }

      const { data: revenueData } = await revenueQuery
      const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

      setStats({
        orderedCount: orderedCount || 0,
        customerCount: customerCount || 0,
        lowStockCount: lowStockCount || 0,
        totalRevenue,
      })

      // Fetch recent orders
      let recentQuery = supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (isSale) {
        recentQuery = recentQuery.eq('sale_id', user.id)
      }

      const { data: ordersData } = await recentQuery
      setRecentOrders(ordersData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Chào mừng bạn quay trở lại
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Receipt className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">Đơn đặt hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orderedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">Khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.customerCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-xl">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">Doanh thu</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', action.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{action.label}</h3>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
              <Link href="/sales/orders" className="text-sm text-[#175ead] font-medium">
                Xem tất cả
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/sales/orders/${order.id}`}>
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Đơn hàng #{order.id}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
