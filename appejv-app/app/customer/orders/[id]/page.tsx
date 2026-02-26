'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { ArrowLeft, Package, User, ShoppingCart, CheckCircle, XCircle, MessageSquare, Clock, Send } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

const statusMap: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: 'Đơn nháp', color: 'text-gray-700', bg: 'bg-gray-100', icon: Package },
  ordered: { label: 'Đơn đặt hàng', color: 'text-amber-700', bg: 'bg-amber-100', icon: ShoppingCart },
  shipping: { label: 'Giao hàng', color: 'text-blue-700', bg: 'bg-blue-100', icon: Package },
  paid: { label: 'Thanh toán', color: 'text-purple-700', bg: 'bg-purple-100', icon: CheckCircle },
  completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
}

export default function CustomerOrderDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchOrderDetail()
  }, [user, orderId])

  const fetchOrderDetail = async () => {
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
        router.push('/customer/orders')
        return
      }

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(full_name, phone),
          sale:profiles!orders_sale_id_fkey(full_name, phone)
        `)
        .eq('id', orderId)
        .eq('customer_id', customerData.id)
        .single()

      if (orderError || !orderData) {
        toast.error('Không tìm thấy đơn hàng')
        router.push('/customer/orders')
        return
      }

      setOrder(orderData)

      // Fetch order items
      const { data: itemsData } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            code,
            image_url
          )
        `)
        .eq('order_id', orderId)

      setOrderItems(itemsData || [])
      
      // Fetch order history
      const { data: historyData } = await supabase
        .from('order_history')
        .select(`
          *,
          user:profiles!order_history_user_id_fkey(full_name)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })

      setHistory(historyData || [])
    } catch (error: any) {
      console.error('Error fetching order:', error)
      toast.error('Không thể tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmOrder = async () => {
    if (order.status !== 'draft') {
      toast.error('Chỉ có thể xác nhận đơn hàng ở trạng thái nháp')
      return
    }

    try {
      setUpdating(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('orders')
        .update({ status: 'ordered' })
        .eq('id', orderId)

      if (error) throw error

      toast.success('Đơn hàng đã được xác nhận và gửi đến nhân viên!')
      fetchOrderDetail()
    } catch (error: any) {
      console.error('Error confirming order:', error)
      toast.error('Không thể xác nhận đơn hàng')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (order.status !== 'draft') {
      toast.error('Chỉ có thể hủy đơn hàng ở trạng thái nháp')
      return
    }

    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return
    }

    try {
      setUpdating(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)

      if (error) throw error

      toast.success('Đơn hàng đã được hủy')
      router.push('/customer/orders')
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      toast.error('Không thể hủy đơn hàng')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung')
      return
    }

    try {
      setSubmitting(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('order_history')
        .insert({
          order_id: orderId,
          user_id: user!.id,
          action_type: 'comment',
          comment: newComment.trim()
        })

      if (error) throw error

      toast.success('Đã thêm ghi chú')
      setNewComment('')
      fetchOrderDetail() // Refresh to get new comment
    } catch (error: any) {
      console.error('Error adding comment:', error)
      toast.error('Không thể thêm ghi chú')
    } finally {
      setSubmitting(false)
    }
  }

  const getActionLabel = (actionType: string, oldValue?: string, newValue?: string) => {
    switch (actionType) {
      case 'created':
        return 'Tạo đơn hàng'
      case 'status_change':
        const oldStatus = statusMap[oldValue as keyof typeof statusMap]?.label || oldValue
        const newStatus = statusMap[newValue as keyof typeof statusMap]?.label || newValue
        return `Thay đổi trạng thái: ${oldStatus} → ${newStatus}`
      case 'comment':
        return 'Thêm ghi chú'
      default:
        return 'Cập nhật'
    }
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

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <p className="text-red-600">Không tìm thấy đơn hàng</p>
      </div>
    )
  }

  const statusConfig = statusMap[order.status] || statusMap.draft
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/customer/orders">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* Order Header Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className={`h-2 ${statusConfig.bg}`}></div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={`w-16 h-16 ${statusConfig.bg} rounded-xl flex items-center justify-center`}>
                  <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    Đơn #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Sale Info */}
        {order.sale && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Nhân viên phụ trách</h2>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.sale.full_name}</p>
                {order.sale.phone && (
                  <p className="text-xs text-gray-500">{order.sale.phone}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Sản phẩm ({orderItems.length})
          </h2>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-start justify-between py-3 ${
                  index > 0 ? 'border-t border-gray-100' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.products?.name || 'Sản phẩm'}
                    </p>
                    {item.products?.code && (
                      <p className="text-xs text-gray-400">Mã: {item.products.code}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatCurrency(item.price_at_order)}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.price_at_order * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">Tổng kết đơn hàng</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tạm tính</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
            
            {order.discount_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Giảm giá</span>
                <span className="text-sm font-medium text-red-600">
                  -{formatCurrency(order.discount_amount)}
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                <span className="text-lg font-bold text-[#175ead]">
                  {formatCurrency(order.total_amount - (order.discount_amount || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-2">Ghi chú</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons - Only for draft orders */}
        {order.status === 'draft' && (
          <div className="space-y-3">
            <button
              onClick={handleConfirmOrder}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#175ead] text-white rounded-xl font-semibold hover:bg-[#134a8a] transition-colors disabled:opacity-50"
            >
              {updating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Đặt hàng</span>
                </>
              )}
            </button>

            <button
              onClick={handleCancelOrder}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 border border-red-200"
            >
              <XCircle className="w-5 h-5" />
              <span>Hủy đơn</span>
            </button>
          </div>
        )}

        {/* Status Info for non-draft orders */}
        {order.status !== 'draft' && order.status !== 'cancelled' && (
          <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-4">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800 leading-relaxed">
              Đơn hàng đang được xử lý. Vui lòng liên hệ nhân viên nếu cần hỗ trợ.
            </p>
          </div>
        )}

        {/* Add Comment */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-[#175ead]" />
            <h2 className="text-base font-bold text-gray-900">Thêm ghi chú</h2>
          </div>
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập ghi chú về đơn hàng..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent text-sm"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#175ead] text-white rounded-xl font-semibold hover:bg-[#134a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{submitting ? 'Đang gửi...' : 'Gửi ghi chú'}</span>
            </button>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#175ead]" />
            <h2 className="text-base font-bold text-gray-900">Lịch sử đơn hàng</h2>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Chưa có lịch sử</p>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.action_type === 'comment' ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}>
                      {item.action_type === 'comment' ? (
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-2 min-h-[20px]"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {getActionLabel(item.action_type, item.old_value, item.new_value)}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                          locale: vi
                        })}
                      </span>
                    </div>
                    {item.user && (
                      <p className="text-xs text-gray-500 mb-1">
                        Bởi: {item.user.full_name}
                      </p>
                    )}
                    {item.comment && (
                      <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                        {item.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
