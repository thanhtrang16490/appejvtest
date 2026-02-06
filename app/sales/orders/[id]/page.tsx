'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import { ArrowLeft, Clock, ShoppingBag, User, Phone, MapPin, CheckCircle2, AlertCircle, Printer, Edit2, Sparkles, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { updateOrderStatus, updatePaymentStatus } from '../actions'

export default function SalesOrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const { isHeaderVisible } = useScrollHeader()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [id])

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

            const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
            
            if (!profileData || !['sale', 'admin', 'sale_admin'].includes((profileData as any).role)) {
                router.push('/')
                return
            }

            setProfile(profileData)

            // Fetch order with items, products AND customer details
            const { data: orderData } = await supabase
                .from('orders')
                .select(`
                    *,
                    customers (*),
                    order_items (
                        *,
                        products ( name, code )
                    )
                `)
                .eq('id', id)
                .single()

            setOrder(orderData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (newStatus: string) => {
        await updateOrderStatus(parseInt(id), newStatus)
        fetchData()
    }

    const handleUpdatePayment = async () => {
        await updatePaymentStatus(parseInt(id), order.payment_status === 'paid' ? 'unpaid' : 'paid')
        fetchData()
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!order || !user || !profile) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Không tìm thấy đơn hàng</div>
            </div>
        )
    }

    const statusConfig = {
        draft: { label: 'Nháp', class: 'bg-gray-100 text-gray-700 border-gray-200', icon: Edit2 },
        ordered: { label: 'Đã đặt', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: ShoppingBag },
        shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShoppingBag },
        paid: { label: 'Đã thanh toán', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
        completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
        cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle }
    }

    const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = currentStatus.icon

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-blue-50 to-cyan-50 transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                {/* Logo and Menu Row */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV Logo" 
                            className="w-8 h-8 object-contain"
                        />
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
                        <NotificationModal user={user} role={profile.role} />
                        <HeaderMenu user={user} role={profile.role} />
                    </div>
                </div>
            </div>

            {/* Sticky Title Section */}
            <div className={cn(
                "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2 pt-2 transition-all duration-300",
                !isHeaderVisible ? "top-0" : "top-20"
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/sales/orders" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="h-6 w-[1px] bg-gray-300" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                            <p className="text-[10px] font-bold text-gray-600 uppercase mt-0.5 tracking-widest">#{order.id}</p>
                        </div>
                    </div>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                        <Printer className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-44 pb-20">
                <div className="p-4 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
                                <CardHeader className="p-4 pb-3 flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2.5 rounded-xl", currentStatus.class.split(' ')[0])}>
                                            <Icon className={cn("w-5 h-5", currentStatus.class.split(' ')[1])} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">Tình trạng</p>
                                            <p className={cn("text-base font-bold", currentStatus.class.split(' ')[1])}>
                                                {currentStatus.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">Ngày tạo</p>
                                        <p className="text-sm font-bold">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Sản phẩm</h3>
                                            <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{order.order_items.length} món</span>
                                        </div>
                                        <div className="space-y-2">
                                            {order.order_items.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-3 py-2">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#175ead] font-bold text-sm shrink-0">
                                                        {item.products?.name?.[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{item.products?.name || 'Sản phẩm không rõ'}</p>
                                                        <p className="text-[10px] font-medium text-gray-500">
                                                            {formatCurrency(item.price_at_order)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-bold text-sm tabular-nums">{formatCurrency(item.price_at_order * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-3 border-t space-y-2">
                                            <div className="flex justify-between items-center bg-[#175ead]/5 p-3 rounded-xl">
                                                <span className="text-[#175ead] font-bold uppercase tracking-wider text-xs">Tổng cộng</span>
                                                <span className="text-xl font-black text-[#175ead]">{formatCurrency(order.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="border-none shadow-sm bg-white rounded-2xl p-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Thao tác nhanh</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {order.status === 'draft' && (
                                        <Button onClick={() => handleUpdateStatus('ordered')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                                            Xác nhận đặt
                                        </Button>
                                    )}
                                    {order.status === 'ordered' && (
                                        <Button onClick={() => handleUpdateStatus('shipping')} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold">
                                            Giao hàng
                                        </Button>
                                    )}
                                    {order.status === 'shipping' && (
                                        <Button onClick={() => handleUpdateStatus('paid')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                                            Đã thanh toán
                                        </Button>
                                    )}
                                    {order.status === 'paid' && (
                                        <Button onClick={() => handleUpdateStatus('completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                                            Hoàn thành
                                        </Button>
                                    )}
                                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                                        <Button onClick={() => handleUpdateStatus('cancelled')} variant="destructive" className="rounded-xl text-xs font-bold">
                                            Hủy đơn
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-4">
                            {/* Customer Info */}
                            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                                <CardHeader className="p-3 bg-gray-50">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Khách hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 space-y-3">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <User className="w-4 h-4 text-[#175ead]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">{order.customers?.name}</p>
                                            <p className="text-[9px] font-medium text-gray-500">{order.customers?.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="text-xs font-medium">{order.customers?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 px-2">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-xs font-medium text-gray-600 leading-relaxed line-clamp-2">{order.customers?.address || 'N/A'}</span>
                                    </div>
                                    <Link
                                        href={`/sales/customers/${order.customer_id}`}
                                        className="flex items-center justify-center w-full py-2 bg-gray-100 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#175ead]/10 hover:text-[#175ead] transition-all"
                                    >
                                        Xem hồ sơ
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Payment Control */}
                            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                                <CardHeader className="p-3 bg-gray-50">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Thanh toán</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 space-y-3">
                                    <div className={cn(
                                        "p-3 rounded-xl border flex items-center justify-between",
                                        order.payment_status === 'paid'
                                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                            : "bg-amber-50 border-amber-100 text-amber-700"
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wide">
                                                {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleUpdatePayment}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold"
                                    >
                                        Đánh dấu {order.payment_status === 'paid' ? 'Chưa trả' : 'Đã trả'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
