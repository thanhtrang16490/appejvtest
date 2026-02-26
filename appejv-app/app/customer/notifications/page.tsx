'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Bell, Check, CheckCheck, Trash2, ArrowLeft, Package, ShoppingCart, UserPlus, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const notificationIcons: Record<string, any> = {
  order_status: ShoppingCart,
  low_stock: AlertCircle,
  customer_assigned: UserPlus,
  new_order: Package,
}

const notificationColors: Record<string, string> = {
  order_status: 'bg-blue-100 text-blue-600',
  low_stock: 'bg-amber-100 text-amber-600',
  customer_assigned: 'bg-emerald-100 text-emerald-600',
  new_order: 'bg-purple-100 text-purple-600',
}

export default function CustomerNotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user])

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || !n.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/customer">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Thông báo</h1>
          <div className="w-10"></div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-[#175ead] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-[#175ead] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex gap-2 px-4 pb-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
                  clearAll()
                }
              }}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3 pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
            </p>
            <p className="text-sm text-gray-400">
              Thông báo về đơn hàng và cập nhật sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell
            const colorClass = notificationColors[notification.type] || 'bg-gray-100 text-gray-600'

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                  !notification.read ? 'border-l-4 border-[#175ead]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#175ead] rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
                              deleteNotification(notification.id)
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
