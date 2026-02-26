'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { ShoppingBag, Search, Plus, X } from 'lucide-react'

const STATUS_MAP = {
  draft: { label: 'Đơn nháp', color: 'text-gray-700', bg: 'bg-gray-100' },
  ordered: { label: 'Đơn đặt hàng', color: 'text-amber-700', bg: 'bg-amber-100' },
  shipping: { label: 'Giao hàng', color: 'text-blue-700', bg: 'bg-blue-100' },
  paid: { label: 'Thanh toán', color: 'text-purple-700', bg: 'bg-purple-100' },
  completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
} as const

const TABS = [
  { id: 'draft', label: 'Nháp' },
  { id: 'ordered', label: 'Đặt hàng' },
  { id: 'shipping', label: 'Giao hàng' },
  { id: 'paid', label: 'Thanh toán' },
  { id: 'completed', label: 'Hoàn thành' },
]

const SCOPE_TABS = [
  { id: 'my', label: 'Của tôi' },
  { id: 'team', label: 'Team' },
]

const STATUS_FLOW: Record<string, { status: string; label: string; color: string }> = {
  draft: { status: 'ordered', label: 'Đặt hàng', color: 'bg-amber-600' },
  ordered: { status: 'shipping', label: 'Giao hàng', color: 'bg-blue-600' },
  shipping: { status: 'paid', label: 'Thanh toán', color: 'bg-purple-600' },
  paid: { status: 'completed', label: 'Hoàn thành', color: 'bg-emerald-600' },
}

interface Order {
  id: number
  status: string
  total_amount: number
  created_at: string
  customer_id: string | null
  sale_id: string
  customer?: { full_name?: string; phone?: string }
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('draft')
  const [scopeTab, setScopeTab] = useState<'my' | 'team'>('my')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user, authLoading, scopeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user!.id)
        .single()

      if (!profileData || !['sale', 'sale_admin', 'admin'].includes(profileData.role)) {
        router.push('/')
        return
      }

      setProfile(profileData)

      // Fetch orders
      let query = supabase
        .from('orders')
        .select('id, status, total_amount, created_at, customer_id, sale_id')
        .order('created_at', { ascending: false })

      const isSale = profileData.role === 'sale'
      const isSaleAdmin = profileData.role === 'sale_admin'

      if (isSale) {
        query = query.eq('sale_id', user!.id)
      } else if (isSaleAdmin && scopeTab === 'my') {
        query = query.eq('sale_id', user!.id)
      } else if (isSaleAdmin && scopeTab === 'team') {
        // Fetch team member IDs
        const { data: managedSales } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', user!.id)
        
        const teamIds = managedSales?.map(s => s.id) || []
        if (teamIds.length > 0) {
          query = query.in('sale_id', [user!.id, ...teamIds])
        }
      }

      const { data: ordersData } = await query

      // Fetch customers separately
      if (ordersData && ordersData.length > 0) {
        const customerIds = [...new Set(ordersData.map(o => o.customer_id).filter(Boolean))]
        
        if (customerIds.length > 0) {
          const { data: customersData } = await supabase
            .from('customers')
            .select('id, full_name, phone')
            .in('id', customerIds)

          const customersMap = new Map(customersData?.map(c => [c.id, c]))

          const ordersWithCustomers = ordersData.map(order => ({
            ...order,
            customer: order.customer_id ? customersMap.get(order.customer_id) : undefined
          }))

          setOrders(ordersWithCustomers)
        } else {
          setOrders(ordersData)
        }
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      const supabase = createClient()

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      const statusLabel = STATUS_MAP[newStatus as keyof typeof STATUS_MAP]?.label || newStatus
      toast.success(`Đã cập nhật trạng thái: ${statusLabel}`)
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error(error.message || 'Không thể cập nhật trạng thái')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getFilteredOrders = useCallback(() => {
    const byStatus = orders.filter(order => order.status === activeTab)
    if (!searchQuery.trim()) return byStatus

    const q = searchQuery.toLowerCase().trim()
    return byStatus.filter(order => {
      const idMatch = String(order.id).includes(q)
      const customerName = (order.customer?.full_name || '').toLowerCase()
      const customerPhone = (order.customer?.phone || '').toLowerCase()
      return idMatch || customerName.includes(q) || customerPhone.includes(q)
    })
  }, [orders, activeTab, searchQuery])

  const getOrderCount = (status: string) => {
    return orders.filter(o => o.status === status).length
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

  const isSaleAdmin = profile?.role === 'sale_admin'
  const filteredOrders = getFilteredOrders()

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isSaleAdmin ? 'Đơn hàng nhóm' : 'Đơn hàng của tôi'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi tiến độ đơn hàng</p>
          </div>
          <Link href="/sales/selling">
            <button className="w-10 h-10 bg-[#175ead] rounded-full flex items-center justify-center hover:bg-[#134a8a] transition-colors">
              <Plus className="w-6 h-6 text-white" />
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên, SĐT khách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scope Tabs (My/Team) */}
        {isSaleAdmin && (
          <div className="flex gap-2">
            {SCOPE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setScopeTab(tab.id as 'my' | 'team')}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors',
                  scopeTab === tab.id
                    ? 'bg-[#175ead] text-white border-[#175ead]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const count = getOrderCount(tab.id)
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'bg-[#175ead] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                {tab.label}
                {count > 0 && ` (${count})`}
              </button>
            )
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-400">
              {searchQuery ? `Không tìm thấy "${searchQuery}"` : 'Không có đơn hàng nào'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP] || STATUS_MAP.draft
              const nextStatus = STATUS_FLOW[order.status]
              
              return (
                <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  {/* Order Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">Đơn hàng #{order.id}</h3>
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-lg font-medium', status.bg, status.color)}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <span>#{order.id}</span>
                          <span>•</span>
                          <span>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {order.customer && (
                          <p className="text-xs text-gray-600">{order.customer.full_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/sales/orders/${order.id}`} className="flex-1">
                      <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Chi tiết
                      </button>
                    </Link>
                    
                    {nextStatus && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, nextStatus.status)}
                        disabled={updatingOrderId === order.id}
                        className={cn(
                          'flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-colors',
                          nextStatus.color,
                          'hover:opacity-90',
                          updatingOrderId === order.id && 'opacity-60 cursor-not-allowed'
                        )}
                      >
                        {updatingOrderId === order.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          nextStatus.label
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
