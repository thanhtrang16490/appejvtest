'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Search, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'

export default function CustomerOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const supabase = createClient()

      // Get customer ID
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
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(full_name, phone),
          sale:profiles!orders_sale_id_fkey(full_name)
        `)
        .eq('customer_id', customerData.id)
        .order('created_at', { ascending: false })

      setOrders(ordersData || [])
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải đơn hàng')
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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeStatus === 'all' || order.status === activeStatus
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusTabs = [
    { value: 'all', label: 'Tất cả', count: orders.length },
    { value: 'draft', label: 'Nháp', count: orders.filter(o => o.status === 'draft').length },
    { value: 'ordered', label: 'Đã đặt', count: orders.filter(o => o.status === 'ordered').length },
    { value: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
    { value: 'completed', label: 'Hoàn thành', count: orders.filter(o => o.status === 'completed').length },
  ]

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
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Đơn hàng của tôi</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeStatus === tab.value
                  ? 'bg-[#175ead] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
            <Link href="/sales/selling">
              <button className="px-6 py-3 bg-[#175ead] text-white rounded-xl font-semibold hover:bg-[#134a8a] transition-colors">
                Đặt hàng ngay
              </button>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link key={order.id} href={`/customer/orders/${order.id}`}>
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Đơn #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Tổng tiền</span>
                  <span className="text-lg font-bold text-[#175ead]">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
