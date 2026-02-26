'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Package, Eye, CheckCircle, User, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function WarehouseOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (user.role !== 'warehouse') {
      router.push('/sales')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const supabase = createClient()
      
      // Fetch orders with status 'ordered' (waiting to ship)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(full_name, phone, email, company),
          sale:profiles!orders_sale_id_fkey(full_name)
        `)
        .eq('status', 'ordered')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleShipOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xác nhận xuất kho đơn hàng này?')) {
      return
    }

    try {
      setProcessing(orderId)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'shipping',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      toast.success('Xuất kho thành công! Đơn hàng đã chuyển sang trạng thái giao hàng')
      fetchOrders()
    } catch (error: any) {
      console.error('Error shipping order:', error)
      toast.error('Không thể cập nhật trạng thái đơn hàng')
    } finally {
      setProcessing(null)
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
      {/* Header */}
      <div className="bg-[#fffbeb] p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Đơn hàng chờ xuất</h1>
            <p className="text-sm text-gray-600">{orders.length} đơn hàng cần xử lý</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không có đơn hàng chờ xuất</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">
                      Đơn #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </p>
                    {order.customer && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {order.customer.full_name}
                      </p>
                    )}
                    {order.sale && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {order.sale.full_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg mt-1">
                    Chờ xuất
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/sales/orders/${order.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Chi tiết</span>
                  </button>
                </Link>
                
                <button
                  onClick={() => handleShipOrder(order.id)}
                  disabled={processing === order.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {processing === order.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Xuất kho</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
