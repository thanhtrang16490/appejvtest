'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ShoppingBag, Plus } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { OrdersLoading } from '@/components/loading/OrdersLoading'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { useOrders, useUpdateOrder } from '@/lib/hooks/useOrders'
import { toast } from 'sonner'

export default function SalesOrdersPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('ordered')
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isHeaderVisible } = useScrollHeader()
    
    // Use Go API hooks
    const { data: ordersResponse, isLoading, refetch } = useOrders({})
    const updateOrder = useUpdateOrder()

    useEffect(() => {
        // Check if there's a tab query parameter
        const tabParam = searchParams.get('tab')
        if (tabParam) {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
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
                .select('role, full_name')
                .eq('id', user.id)
                .single()

            if (!profileData || !['sale', 'admin', 'sale_admin'].includes((profileData as any).role)) {
                router.push('/')
                return
            }

            setProfile(profileData)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const result = await updateOrder.mutateAsync({
                id: orderId,
                data: { status: newStatus }
            })
            
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Đã cập nhật trạng thái đơn hàng')
                refetch()
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            toast.error('Có lỗi xảy ra khi cập nhật đơn hàng')
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
        const orders = ordersResponse?.data || []
        return orders.filter(order => order.status === status)
    }

    const OrderList = ({ list }: { list: any[] }) => (
        <div className="grid gap-3 mt-4">
            {list.map(order => {
                const config = statusMap[order.status as keyof typeof statusMap] || statusMap.draft
                
                return (
                    <Card key={order.id} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            {/* Top Row: Info */}
                            <div className="flex items-center justify-between gap-3 mb-3">
                                {/* Left: Icon + Info */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex-shrink-0">
                                        <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <Badge className={cn("text-[10px] px-1.5 py-0.5 border-none flex-shrink-0", config.class)}>
                                                {config.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>#{order.id}</span>
                                            <span>•</span>
                                            <span>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right: Amount */}
                                <div className="text-right flex-shrink-0">
                                    <div className="text-base font-bold text-gray-900">
                                        {formatCurrency(order.total_amount)}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Actions */}
                            <div className="flex items-center gap-2">
                                <Link href={`/sales/orders/${order.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                                        Chi tiết
                                    </Button>
                                </Link>
                                {order.status === 'draft' && (
                                    <Button 
                                        size="sm" 
                                        className="flex-1 text-xs h-8 bg-[#175ead] hover:bg-blue-600"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateOrderStatus(order.id, 'ordered')
                                        }}
                                        disabled={updateOrder.isPending}
                                    >
                                        Đặt hàng
                                    </Button>
                                )}
                                {order.status === 'ordered' && (
                                    <Button 
                                        size="sm" 
                                        className="flex-1 text-xs h-8 bg-blue-500 hover:bg-blue-600"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateOrderStatus(order.id, 'shipping')
                                        }}
                                        disabled={updateOrder.isPending}
                                    >
                                        Giao hàng
                                    </Button>
                                )}
                                {order.status === 'shipping' && (
                                    <Button 
                                        size="sm" 
                                        className="flex-1 text-xs h-8 bg-purple-500 hover:bg-purple-600"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateOrderStatus(order.id, 'paid')
                                        }}
                                        disabled={updateOrder.isPending}
                                    >
                                        Thanh toán
                                    </Button>
                                )}
                                {order.status === 'paid' && (
                                    <Button 
                                        size="sm" 
                                        className="flex-1 text-xs h-8 bg-emerald-500 hover:bg-emerald-600"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateOrderStatus(order.id, 'completed')
                                        }}
                                        disabled={updateOrder.isPending}
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

    if (isLoading || !user || !profile) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="pt-24 pb-20 px-4">
                    <OrdersLoading />
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
                            <img 
                                src="/appejv-logo.png" 
                                alt="APPE JV Logo" 
                                className="w-10 h-10 object-contain"
                            />
                            <span className="text-xl font-bold text-gray-900">APPE JV</span>
                        </div>
                        <div className="flex items-center gap-2">
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
