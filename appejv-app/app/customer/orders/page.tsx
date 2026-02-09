'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { useState, useEffect } from 'react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'

type Order = Database['public']['Tables']['orders']['Row']

const statusTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xử lý' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
]

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [activeStatus, setActiveStatus] = useState('all')
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState('customer')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
        fetchOrders()
        fetchUserRole()
    }, [activeStatus])

    const fetchUserRole = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            if (profile && (profile as any).role) {
                setRole((profile as any).role)
            }
        }
    }

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            setUser(user)
            const phone = user.phone

            if (!phone) {
                setLoading(false)
                return
            }

            const { data: customerData } = await supabase
                .from('customers')
                .select('id')
                .eq('phone', phone)
                .single()

            if (customerData) {
                let query = supabase
                    .from('orders')
                    .select('*')
                    .eq('customer_id', (customerData as any).id)
                    .order('created_at', { ascending: false })

                if (activeStatus !== 'all') {
                    query = query.eq('status', activeStatus)
                }

                const { data } = await query
                setOrders(data || [])
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default'
            case 'cancelled':
                return 'destructive'
            case 'processing':
                return 'secondary'
            default:
                return 'outline'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý'
            case 'processing':
                return 'Đang xử lý'
            case 'shipping':
                return 'Đang giao'
            case 'completed':
                return 'Hoàn thành'
            case 'cancelled':
                return 'Đã hủy'
            default:
                return status
        }
    }

    if (!user) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
                    <Link href="/auth/login">
                        <Button>Đăng nhập</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
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
                    {mounted && (
                        <div className="flex items-center gap-2">
                            <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white rounded-full px-4 py-2 text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4 mr-1" />
                                Trợ lý AI
                            </Button>
                            <HeaderMenu user={user} role={role} />
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Status Filter */}
            <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2">
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
                    
                    {/* Status Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {statusTabs.map((tab) => (
                            <Button
                                key={tab.id}
                                variant={activeStatus === tab.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveStatus(tab.id)}
                                className={cn(
                                    "rounded-full whitespace-nowrap text-sm font-medium",
                                    activeStatus === tab.id 
                                        ? "bg-[#175ead] text-white" 
                                        : "bg-white text-gray-600 border-gray-200"
                                )}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-36 pb-20">
                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Đang tải...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Không có đơn hàng nào.</p>
                            <Link href="/catalog">
                                <Button>Mua sắm ngay</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="bg-white rounded-2xl shadow-sm border-0">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-base text-gray-900">
                                                    Đơn hàng #{order.id}
                                                </CardTitle>
                                                <CardDescription className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                </CardDescription>
                                                <Link 
                                                    href={`/customer/orders/${order.id}`} 
                                                    className="text-xs text-[#175ead] underline mt-1 block"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex justify-between items-center text-sm font-medium mt-2">
                                            <span className="text-gray-600">Tổng tiền</span>
                                            <span className="text-gray-900 font-semibold">
                                                {formatCurrency(order.total_amount)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
