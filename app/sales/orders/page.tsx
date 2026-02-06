'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ShoppingBag, Plus, Sparkles, Menu, Bell } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus } from './actions'

export default function SalesOrdersPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('pending')
    const router = useRouter()

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 50) {
                    setIsHeaderVisible(false)
                } else {
                    setIsHeaderVisible(true)
                }
                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader)
            return () => {
                window.removeEventListener('scroll', controlHeader)
            }
        }
    }, [lastScrollY])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth/login')
                return
            }

            setUser(user)

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (!profileData || !['sale', 'admin', 'sale_admin'].includes((profileData as any).role)) {
                router.push('/')
                return
            }

            setProfile(profileData)

            const isSale = (profileData as any).role === 'sale'
            const isSaleAdmin = (profileData as any).role === 'sale_admin'

            // For Sale Admin, fetch managed sales IDs
            let managedSaleIds: string[] = []
            if (isSaleAdmin) {
                const { data: managedSales } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('manager_id', user.id)
                managedSaleIds = managedSales?.map(s => (s as any).id) || []
            }

            // Fetch orders
            let query = supabase.from('orders').select('*, customers(name)')

            if (isSale) {
                query = query.eq('sale_id', user.id)
            } else if (isSaleAdmin) {
                query = query.in('sale_id', [user.id, ...managedSaleIds])
            }

            const { data: ordersData } = await query.order('created_at', { ascending: false })
            setOrders(ordersData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus)
            // Refresh orders
            fetchData()
        } catch (error) {
            console.error('Error updating order status:', error)
        }
    }

    const statusMap: Record<string, { label: string, class: string }> = {
        pending: { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200' },
        processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-700 border-blue-200' },
        shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-700 border-purple-200' },
        completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-700 border-rose-200' }
    }

    const getFilteredOrders = (status: string) => {
        return orders.filter(order => order.status === status)
    }

    const OrderList = ({ list }: { list: any[] }) => (
        <div className="grid gap-3 mt-4">
            {list.map(order => {
                const config = statusMap[order.status as keyof typeof statusMap] || statusMap.pending
                return (
                    <Card key={order.id} className="bg-white rounded-2xl shadow-sm border-0">
                        <CardHeader className="p-4 flex-row items-center justify-between gap-4 space-y-0">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-1.5 h-6 rounded-full", order.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500')} title={order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'} />
                                <div className="p-3 bg-gray-100 rounded-xl">
                                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">{order.customers?.name || 'Không xác định'}</h3>
                                    <p className="text-xs text-gray-500">#{order.id} • {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge className={cn("text-xs px-2 py-1 border-none", config.class)}>
                                    {config.label}
                                </Badge>
                                {order.payment_status === 'unpaid' && (
                                    <Badge variant="outline" className="text-xs px-2 py-1 border-rose-200 text-rose-600 bg-rose-50">
                                        Chưa thu
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
                            <div className="flex gap-2">
                                <Link href={`/sales/orders/${order.id}`}>
                                    <Button variant="outline" size="sm" className="text-xs">
                                        Chi tiết
                                    </Button>
                                </Link>
                                {order.status === 'pending' && (
                                    <Button 
                                        size="sm" 
                                        className="text-xs bg-blue-500 hover:bg-blue-600"
                                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                    >
                                        Xử lý
                                    </Button>
                                )}
                                {order.status === 'processing' && (
                                    <Button 
                                        size="sm" 
                                        className="text-xs bg-emerald-500 hover:bg-emerald-600"
                                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                    >
                                        Hoàn thành
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
            {list.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <ShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                    <p className="font-medium text-sm">Không có đơn hàng nào.</p>
                </div>
            )}
        </div>
    )

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user || !profile) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
                    <Button onClick={() => router.push('/auth/login')}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        )
    }

    const isSale = (profile as any).role === 'sale'
    const isSaleAdmin = (profile as any).role === 'sale_admin'

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-50 to-blue-50 transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                {/* Logo and AI Assistant Row */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-4 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Trợ lý AI
                        </Button>
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>

                {/* Page Title */}
                <div className="flex items-center justify-between px-4 pb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isSaleAdmin ? 'Đơn hàng nhóm' : 'Đơn hàng của tôi'}
                        </h1>
                        <p className="text-sm text-gray-600">Quản lý và theo dõi tiến độ đơn hàng</p>
                    </div>
                    <Link href="/sales/orders/new">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-full">
                            <Plus className="w-4 h-4 mr-1" />
                            Tạo mới
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-32 pb-20">
                <div className="p-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-12 bg-white/80 p-1 rounded-2xl shadow-sm">
                            <TabsTrigger 
                                value="pending" 
                                className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-sm"
                            >
                                Chờ xử lý
                            </TabsTrigger>
                            <TabsTrigger 
                                value="processing" 
                                className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-sm"
                            >
                                Đang xử lý
                            </TabsTrigger>
                            <TabsTrigger 
                                value="completed" 
                                className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-sm"
                            >
                                Hoàn thành
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending">
                            <OrderList list={getFilteredOrders('pending')} />
                        </TabsContent>
                        <TabsContent value="processing">
                            <OrderList list={getFilteredOrders('processing')} />
                        </TabsContent>
                        <TabsContent value="completed">
                            <OrderList list={getFilteredOrders('completed')} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
