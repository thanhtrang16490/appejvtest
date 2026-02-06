'use client'

import React, { useState, useEffect } from 'react'
import { 
    Bell, 
    X, 
    CheckCircle, 
    AlertCircle, 
    Info, 
    Package, 
    ShoppingBag,
    Users,
    Clock,
    Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    type: 'success' | 'warning' | 'info' | 'error'
    title: string
    message: string
    time: string
    read: boolean
    category: 'order' | 'inventory' | 'customer' | 'system'
}

interface NotificationModalProps {
    user?: any
    role?: string
}

export function NotificationModal({ user, role }: NotificationModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

    // Mock notifications data - in real app, this would come from API
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: '1',
                type: 'warning',
                title: 'Sản phẩm sắp hết hàng',
                message: 'Áo thun trắng size M chỉ còn 5 sản phẩm trong kho',
                time: '5 phút trước',
                read: false,
                category: 'inventory'
            },
            {
                id: '2',
                type: 'success',
                title: 'Đơn hàng mới',
                message: 'Khách hàng Nguyễn Văn A vừa đặt đơn hàng #12345',
                time: '10 phút trước',
                read: false,
                category: 'order'
            },
            {
                id: '3',
                type: 'info',
                title: 'Khách hàng mới',
                message: 'Trần Thị B vừa đăng ký tài khoản',
                time: '15 phút trước',
                read: false,
                category: 'customer'
            },
            {
                id: '4',
                type: 'error',
                title: 'Lỗi thanh toán',
                message: 'Đơn hàng #12344 thanh toán thất bại',
                time: '30 phút trước',
                read: true,
                category: 'order'
            },
            {
                id: '5',
                type: 'info',
                title: 'Cập nhật hệ thống',
                message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai',
                time: '1 giờ trước',
                read: true,
                category: 'system'
            }
        ]
        setNotifications(mockNotifications)
    }, [])

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const markAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, read: true } : notif
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, read: true }))
        )
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    const getIcon = (type: string, category: string) => {
        if (category === 'order') return ShoppingBag
        if (category === 'inventory') return Package
        if (category === 'customer') return Users
        
        switch (type) {
            case 'success': return CheckCircle
            case 'warning': return AlertCircle
            case 'error': return AlertCircle
            default: return Info
        }
    }

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-500'
            case 'warning': return 'text-yellow-500'
            case 'error': return 'text-red-500'
            default: return 'text-blue-500'
        }
    }

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50'
            case 'warning': return 'bg-yellow-50'
            case 'error': return 'bg-red-50'
            default: return 'bg-blue-50'
        }
    }

    const filteredNotifications = activeTab === 'unread' 
        ? notifications.filter(n => !n.read)
        : notifications

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <>
            {/* Notification Bell Button */}
            <Button 
                size="sm" 
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full hover:bg-white/20 relative"
                onClick={toggleModal}
            >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
                    onClick={closeModal}
                />
            )}

            {/* Modal */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-gray-700" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
                            <p className="text-sm text-gray-500">
                                {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Không có thông báo mới'}
                            </p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                        onClick={closeModal}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn(
                            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === 'all'
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        Tất cả ({notifications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('unread')}
                        className={cn(
                            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === 'unread'
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        Chưa đọc ({unreadCount})
                    </button>
                </div>

                {/* Actions */}
                {unreadCount > 0 && (
                    <div className="p-4 border-b border-gray-100">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={markAllAsRead}
                            className="w-full text-sm"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Đánh dấu tất cả đã đọc
                        </Button>
                    </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <Bell className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 text-center">
                                {activeTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo nào'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredNotifications.map((notification) => {
                                const Icon = getIcon(notification.type, notification.category)
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors cursor-pointer group",
                                            !notification.read && "bg-blue-50/50"
                                        )}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "p-2 rounded-lg flex-shrink-0",
                                                getBgColor(notification.type)
                                            )}>
                                                <Icon className={cn("w-5 h-5", getIconColor(notification.type))} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <h3 className={cn(
                                                        "text-sm font-medium text-gray-900 mb-1",
                                                        !notification.read && "font-semibold"
                                                    )}>
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deleteNotification(notification.id)
                                                            }}
                                                        >
                                                            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}