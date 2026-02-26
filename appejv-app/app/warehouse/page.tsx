'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Package, AlertTriangle, ShoppingCart, CheckCircle, BarChart3, Boxes } from 'lucide-react'
import Link from 'next/link'

export default function WarehouseDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    pendingOrders: 0,
    lowStockCount: 0,
    totalProducts: 0,
    todayShipped: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (user.role !== 'warehouse') {
      router.push('/sales')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Pending orders (ordered status - waiting to ship)
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ordered')

      // Low stock products
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 20)

      // Total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Today shipped (shipping status created today)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: shippedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipping')
        .gte('updated_at', today.toISOString())

      setStats({
        pendingOrders: pendingCount || 0,
        lowStockCount: lowStockCount || 0,
        totalProducts: totalProducts || 0,
        todayShipped: shippedCount || 0
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbeb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      {/* Page Header */}
      <div className="bg-[#fffbeb] p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý kho</h1>
            <p className="text-sm text-gray-600">Tổng quan hoạt động kho hàng</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Đơn chờ xuất</span>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Hàng sắp hết</span>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.lowStockCount}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Tổng sản phẩm</span>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Boxes className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Xuất hôm nay</span>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.todayShipped}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/warehouse/orders">
              <div className="bg-amber-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm mx-auto">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-center text-gray-700">Đơn chờ xuất</p>
              </div>
            </Link>

            <Link href="/warehouse/products">
              <div className="bg-emerald-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm mx-auto">
                  <Boxes className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-center text-gray-700">Sản phẩm</p>
              </div>
            </Link>

            <Link href="/warehouse/products?filter=low">
              <div className="bg-red-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm mx-auto">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-sm font-medium text-center text-gray-700">Hàng sắp hết</p>
              </div>
            </Link>

            <Link href="/warehouse/reports">
              <div className="bg-indigo-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm mx-auto">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-center text-gray-700">Báo cáo</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
