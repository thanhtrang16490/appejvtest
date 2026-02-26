'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ChevronLeft, MessageSquare, Clock, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

const STATUS_MAP = {
  draft: { label: 'Đơn nháp', color: 'text-gray-700', bg: 'bg-gray-100' },
  ordered: { label: 'Đơn đặt hàng', color: 'text-amber-700', bg: 'bg-amber-100' },
  shipping: { label: 'Giao hàng', color: 'text-blue-700', bg: 'bg-blue-100' },
  paid: { label: 'Thanh toán', color: 'text-purple-700', bg: 'bg-purple-100' },
  completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
} as const

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchOrder()
  }, [user, authLoading, orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      // Fetch customer
      let customer = null
      if (orderData.customer_id) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('id, full_name, phone, address')
          .eq('id', orderData.customer_id)
          .single()
        customer = customerData
      }

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, product:products(id, name, code)')
        .eq('order_id', orderId)

      if (itemsError) throw itemsError

      setOrder({
        ...orderData,
        customer,
        items: itemsData || []
      })

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
      toast.error(error.message || 'Không thể tải đơn hàng')
    } finally {
      setLoading(false)
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
      fetchOrder() // Refresh to get new comment
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
        const oldStatus = STATUS_MAP[oldValue as keyof typeof STATUS_MAP]?.label || oldValue
        const newStatus = STATUS_MAP[newValue as keyof typeof STATUS_MAP]?.label || newValue
        return `Thay đổi trạng thái: ${oldStatus} → ${newStatus}`
      case 'comment':
        return 'Thêm ghi chú'
      default:
        return 'Cập nhật'
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

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-[#175ead] font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP] || STATUS_MAP.draft

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Page Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Đơn hàng #{order.id}</h1>
              <p className="text-sm text-gray-600">Chi tiết đơn hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-4">
          {/* Order Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Thông tin đơn hàng</h2>
              <span className={cn('text-sm px-3 py-1 rounded-lg font-medium', status.bg, status.color)}>
                {status.label}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mã đơn:</span>
                <span className="text-sm font-semibold text-gray-900">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ngày tạo:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
              {order.notes && (
                <div>
                  <span className="text-sm text-gray-600">Ghi chú:</span>
                  <p className="text-sm text-gray-900 mt-1">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          {order.customer && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tên:</span>
                  <span className="text-sm font-semibold text-gray-900">{order.customer.full_name}</span>
                </div>
                {order.customer.phone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">SĐT:</span>
                    <span className="text-sm font-semibold text-gray-900">{order.customer.phone}</span>
                  </div>
                )}
                {order.customer.address && (
                  <div>
                    <span className="text-sm text-gray-600">Địa chỉ:</span>
                    <p className="text-sm text-gray-900 mt-1">{order.customer.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm</h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.product?.name || 'Sản phẩm'}</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price_at_order)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.price_at_order * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-[#175ead]">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Add Comment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#175ead]" />
              <h2 className="text-lg font-bold text-gray-900">Thêm ghi chú</h2>
            </div>
            <div className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nhập ghi chú về đơn hàng..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[#175ead] text-white rounded-xl font-semibold hover:bg-[#134a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#175ead]" />
              <h2 className="text-lg font-bold text-gray-900">Lịch sử đơn hàng</h2>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Chưa có lịch sử</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        item.action_type === 'comment' ? 'bg-blue-100' : 'bg-emerald-100'
                      )}>
                        {item.action_type === 'comment' ? (
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      {index < history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {getActionLabel(item.action_type, item.old_value, item.new_value)}
                        </p>
                        <span className="text-xs text-gray-500">
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
    </div>
  )
}
