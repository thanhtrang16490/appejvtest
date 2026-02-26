'use client'

import { useRouter } from 'next/navigation'
import { useNotifications } from '@/contexts/NotificationContext'
import { 
  ChevronLeft, 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  ShoppingCart, 
  Package, 
  Users, 
  AlertTriangle 
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order_status':
      return <ShoppingCart className="w-5 h-5" />
    case 'low_stock':
      return <AlertTriangle className="w-5 h-5" />
    case 'customer_assigned':
      return <Users className="w-5 h-5" />
    case 'new_order':
      return <Package className="w-5 h-5" />
    default:
      return <Bell className="w-5 h-5" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'order_status':
      return 'bg-blue-100 text-blue-600'
    case 'low_stock':
      return 'bg-amber-100 text-amber-600'
    case 'customer_assigned':
      return 'bg-emerald-100 text-emerald-600'
    case 'new_order':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function NotificationsPage() {
  const router = useRouter()
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotifications()

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
    <div className="min-h-screen bg-[#f0f9ff] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#f0f9ff] border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-900">Thông báo</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500">{unreadCount} chưa đọc</p>
            )}
          </div>
          <div className="w-10"></div>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex gap-2 px-4 pb-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex-1 flex items-center justify-center gap-2 bg-[#175ead] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#134a8a] transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto p-4">
        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Không có thông báo</h2>
            <p className="text-sm text-gray-600">Bạn sẽ nhận được thông báo về đơn hàng, tồn kho và nhiều hơn nữa</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                  !notification.read ? 'border-l-4 border-[#175ead]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    getNotificationColor(notification.type)
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#175ead] rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.created_at), { 
                        addSuffix: true,
                        locale: vi 
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Đánh dấu đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
