'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ShoppingBag, Plus, Sparkles } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus } from './actions'
import { useScrollHeader } from '@/hooks/useScrollHeader'

export default function SalesOrdersPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('ordered')
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

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

            const userRole = (profileData as any).role
            const isSale = userRole === 'sale'
            const isSaleAdmin = userRole === 'sale_admin'
            const isAdmin = userRole === 'admin'

            // For Sale Admin, fetch managed sales IDs
            let managedSaleIds: string[] = []
            if (isSaleAdmin) {
                const { data: managedSales } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('manager_id', user.id)
                managedSaleIds = managedSales?.map(s => (s as any).id) || []
            }

            // Fetch orders based on role
            let query = supabase.from('orders').select('*, customers(name), profiles!orders_sale_id_fkey(full_name)')

            if (isAdmin) {
                // Admin sees ALL orders - no filter
            } else if (isSale) {
                // Sale sees only their orders
                query = query.eq('sale_id', user.id)
            } else if (isSaleAdmin) {
                // Sale Admin sees their orders + managed team orders
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
        draft: { label: 'Đơn nháp', class: 'bg-gray-100 text-gray-700 border-gray-200' },
        ordered: { label: 'Đơn đặt hàng', class: 'bg-amber-100 text-amber-700 border-amber-200' },
        shipping: { label: 'Giao hàng', class: 'bg-blue-100 text-blue-700 border-blue-200' },
        paid: { label: 'Thanh toán', class: 'bg-purple-100 text-purple-700 border-purple-200' },
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
                const saleName = order.profiles?.full_name || 'Không xác định'
                
                return (
                    <Card key={order.id} className="bg-white rounded-2xl shadow-sm border-0">
                        <CardHeader className="p-4 flex-row items-center justify-between gap-4 space-y-0">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-1.5 h-6 rounded-full", order.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500')} title={order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'} />
                                <div className="p-3 bg-gray-100 rounded-xl">
                                    <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">{order.customers?.name || 'Khách lẻ'}</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-gray-500">#{order.id} • {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                        {userRole === 'admin' && (
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-200 text-blue-600 bg-blue-50">
                                                {saleName}
                                            </Badge>
                                        )}
                                    </div>
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
                                {order.status === 'draft' && (
                                    <Button 
                                        size="sm" 
                                        className="text-xs bg-[#175ead] hover:bg-blue-600"
                                        onClick={() => handleUpdateOrderStatus(order.id, 'ordered')}
                                    >
                                        Đặt hàng
                                    </Button>
                                )}
                                {order.status === 'ordered' && (
                                    <Button 
                                        size="sm" 
                                        className="text-xs bg-blue-500 hover:bg-blue-600"
                                        onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                                    >
                                        Giao hàng
                                    </Button>
                                )}
                                {order.status === 'shipping' && (
                                    <Button 
                                        size="sm" 
                                        className="text-xs bg-purple-500 hover:bg-purple-600"
                                        onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                                    >
                                        Thanh toán
                                    </Button>
                                )}
                                {order.status === 'paid' && (
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
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user || !profile) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
                    <Button onClick={() => router.push('/auth/login')}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        )
    }

    const userRole = (profile as any).role
    const isSaleAdmin = userRole === 'sale_admin'

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Fixed Header */}
                <div className={cn(
                    "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-blue-50 to-cyan-50 transition-transform duration-300",
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
                                className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white rounded-full px-4 py-2 text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4 mr-1" />
                                Trợ lý AI
                            </Button>
                            <NotificationModal user={user} role={(profile as any).role} />
                            <HeaderMenu user={user} role={(profile as any).role} />
                        </div>
                    </div>
                </div>

                {/* Sticky Page Title and Tabs */}
                <div className={cn(
                    "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-3 pt-2 transition-all duration-300",
                    !isHeaderVisible ? "top-0" : "top-20"
                )}>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isSaleAdmin ? 'Đơn hàng nhóm' : 'Đơn hàng của tôi'}
                            </h1>
                            <p className="text-sm text-gray-600">Quản lý và theo dõi tiến độ đơn hàng</p>
                        </div>
                        <Link href="/sales/selling">
                            <Button size="sm" className="bg-[#175ead] hover:bg-blue-600 rounded-full w-10 h-10 p-0">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                    
                    {/* Tabs - Scrollable */}
                    <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                        <TabsList className="inline-flex w-auto min-w-full h-12 bg-white/80 p-1 rounded-2xl shadow-sm gap-1">
                            <TabsTrigger 
                                value="draft" 
                                className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs px-4 whitespace-nowrap"
                            >
                                Nháp
                            </TabsTrigger>
                            <TabsTrigger 
                                value="ordered" 
                                className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs px-4 whitespace-nowrap"
                            >
                                Đặt hàng
                            </TabsTrigger>
                            <TabsTrigger 
                                value="shipping" 
                                className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs px-4 whitespace-nowrap"
                            >
                                Giao hàng
                            </TabsTrigger>
                            <TabsTrigger 
                                value="paid" 
                                className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs px-4 whitespace-nowrap"
                            >
                                Thanh toán
                            </TabsTrigger>
                            <TabsTrigger 
                                value="completed" 
                                className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs px-4 whitespace-nowrap"
                            >
                                Hoàn thành
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                {/* Main Content */}
                <div className="pt-44 pb-20">
                    <div className="p-4">
                        <TabsContent value="draft">
                            <OrderList list={getFilteredOrders('draft')} />
                        </TabsContent>
                        <TabsContent value="ordered">
                            <OrderList list={getFilteredOrders('ordered')} />
                        </TabsContent>
                        <TabsContent value="shipping">
                            <OrderList list={getFilteredOrders('shipping')} />
                        </TabsContent>
                        <TabsContent value="paid">
                            <OrderList list={getFilteredOrders('paid')} />
                        </TabsContent>
                        <TabsContent value="completed">
                            <OrderList list={getFilteredOrders('completed')} />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
