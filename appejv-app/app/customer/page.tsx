'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Phone,
  Bell
} from 'lucide-react'
import Link from 'next/link'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (!profileData || profileData.role !== 'customer') {
        toast.error('Bạn không có quyền truy cập')
        router.push('/sales')
        return
      }

      setProfile(profileData)

      // Fetch customer record
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user!.id)
        .single()

      if (!customerData) {
        toast.error('Không tìm thấy thông tin khách hàng')
        return
      }

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerData.id)
        .order('created_at', { ascending: false })

      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter(o => ['draft', 'ordered'].includes(o.status)).length || 0
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0
      const totalSpent = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0

      setStats({ totalOrders, pendingOrders, completedOrders, totalSpent })
      setRecentOrders(orders?.slice(0, 5) || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: any = {
      draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-700' },
      ordered: { label: 'Đã đặt', color: 'bg-blue-100 text-blue-700' },
      shipping: { label: 'Đang giao', color: 'bg-amber-100 text-amber-700' },
      paid: { label: 'Đã thanh toán', color: 'bg-emerald-100 text-emerald-700' },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
    }
    const badge = badges[status] || badges.draft
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  if (loading) {
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
      {/* Header */}
      <div className="bg-gradient-to-r from-[#175ead] to-[#0891b2] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Xin chào,</p>
            <h1 className="text-2xl font-bold">{profile?.full_name || 'Khách hàng'}</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <Link href="/customer/notifications">
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm opacity-90">Tổng đơn</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm opacity-90">Tổng chi</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(stats.totalSpent)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/customer/products">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-[#175ead]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Xem sản phẩm</h3>
              <p className="text-xs text-gray-500">Danh mục sản phẩm</p>
            </div>
          </Link>

          <Link href="/sales/selling">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Đặt hàng</h3>
              <p className="text-xs text-gray-500">Tạo đơn hàng mới</p>
            </div>
          </Link>
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">Trạng thái đơn hàng</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Đang xử lý</p>
                <p className="text-lg font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hoàn thành</p>
                <p className="text-lg font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Đơn hàng gần đây</h2>
            <Link href="/customer/orders" className="text-sm text-[#175ead] font-semibold">
              Xem tất cả
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/customer/orders/${order.id}`}>
                  <div className="border border-gray-200 rounded-lg p-3 hover:border-[#175ead] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        Đơn #{order.id.slice(0, 8)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-sm font-bold text-[#175ead]">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
