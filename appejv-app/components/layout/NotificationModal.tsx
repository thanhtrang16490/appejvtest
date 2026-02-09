'use client'

import { useState, useEffect } from 'react'
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
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

type Notification = Database['public']['Tables']['notifications']['Row']

interface NotificationModalProps {
    user?: any
    role?: string
}

export function NotificationModal({ user }: NotificationModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
    const [loading, setLoading] = useState(false)

    // Fetch notifications from database
    useEffect(() => {
        if (user?.id) {
            fetchNotifications()
            
            // Set up real-time subscription
            const supabase = createClient()
            const channel = supabase
                .channel('notifications')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    () => {
                        fetchNotifications()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [user?.id])

    const fetchNotifications = async () => {
        if (!user?.id) return
        
        try {
            setLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) throw error
            setNotifications(data || [])
        } catch (error) {
            console.error('Error fetching notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const markAsRead = async (id: string) => {
        try {
            const supabase = createClient()
            await (supabase as any)
                .from('notifications')
                .update({ read: true })
                .eq('id', id)
            
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, read: true } : notif
                )
            )
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            const supabase = createClient()
            await (supabase as any)
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user?.id)
                .eq('read', false)
            
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, read: true }))
            )
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    const deleteNotification = async (id: string) => {
        try {
            const supabase = createClient()
            await (supabase as any)
                .from('notifications')
                .delete()
                .eq('id', id)
            
            setNotifications(prev => prev.filter(notif => notif.id !== id))
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
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
            default: return 'text-[#175ead]'
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

    const formatTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { 
                addSuffix: true,
                locale: vi 
            })
        } catch {
            return 'vừa xong'
        }
    }

    const filteredNotifications = activeTab === 'unread' 
        ? notifications.filter(n => !n.read)
        : notifications

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <>
            <Button 
                size="sm" 
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full hover:bg-white/20 relative"
                onClick={toggleModal}
            >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[60]"
                    onClick={closeModal}
                />
            )}

            <div className={cn(
                "fixed inset-0 bg-white z-[70] transform transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="bg-gradient-to-r from-[#175ead] to-[#2575be] p-4 pb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-bold text-white">Thông báo</h2>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="w-9 h-9 p-0 rounded-full hover:bg-white/20 text-white"
                            onClick={closeModal}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="text-xs text-white/90">
                        {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Không có thông báo mới'}
                    </p>
                </div>

                <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn(
                            "flex-1 px-4 py-3 text-xs font-bold transition-colors",
                            activeTab === 'all'
                                ? "text-[#175ead] border-b-2 border-[#175ead] bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        Tất cả ({notifications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('unread')}
                        className={cn(
                            "flex-1 px-4 py-3 text-xs font-bold transition-colors",
                            activeTab === 'unread'
                                ? "text-[#175ead] border-b-2 border-[#175ead] bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        Chưa đọc ({unreadCount})
                    </button>
                </div>

                {unreadCount > 0 && (
                    <div className="p-3 border-b border-gray-100 bg-white">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={markAllAsRead}
                            className="w-full text-xs font-medium rounded-full h-8"
                        >
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Đánh dấu tất cả đã đọc
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto bg-white">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#175ead] border-t-transparent"></div>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <Bell className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-center text-sm font-medium">
                                {activeTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo nào'}
                            </p>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
                                {filteredNotifications.map((notification) => {
                                    const Icon = getIcon(notification.type, notification.category)
                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "p-2.5 hover:bg-white transition-colors cursor-pointer group",
                                                !notification.read && "bg-blue-50"
                                            )}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex gap-2.5">
                                                <div className={cn(
                                                    "p-1.5 rounded-lg flex-shrink-0",
                                                    getBgColor(notification.type)
                                                )}>
                                                    <Icon className={cn("w-4 h-4", getIconColor(notification.type))} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className={cn(
                                                            "text-xs text-gray-900 leading-tight",
                                                            !notification.read && "font-bold"
                                                        )}>
                                                            {notification.title}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                                            {!notification.read && (
                                                                <div className="w-1.5 h-1.5 bg-[#175ead] rounded-full" />
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    deleteNotification(notification.id)
                                                                }}
                                                            >
                                                                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Clock className="w-2.5 h-2.5 text-gray-400" />
                                                        <span className="text-[10px] text-gray-500 font-medium">
                                                            {formatTime(notification.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
