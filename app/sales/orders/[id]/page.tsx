import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Clock, ShoppingBag, User, Phone, MapPin, CheckCircle2, AlertCircle, Printer, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function SalesOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Auth & Role check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = (profile as any)?.role
    const isAdmin = role === 'admin'
    const isSaleAdmin = role === 'sale_admin'

    if (role !== 'sale' && role !== 'admin' && role !== 'sale_admin') {
        redirect('/')
    }

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

    const order = orderData as any

    if (!order) return notFound()

    const statusConfig = {
        pending: { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
        processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Edit2 },
        shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShoppingBag },
        completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
        cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle }
    }

    const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = currentStatus.icon

    return (
        <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto flex flex-col gap-6">
            {/* Nav */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/sales/orders" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Chi tiết đơn hàng</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">#{order.id}</p>
                    </div>
                </div>
                <button className="p-3 bg-white border border-input rounded-2xl shadow-sm hover:bg-muted active:scale-95 transition-all">
                    <Printer className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[2rem]">
                        <CardHeader className="p-8 pb-4 flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-4 rounded-3xl", currentStatus.class.split(' ')[0])}>
                                    <Icon className={cn("w-6 h-6", currentStatus.class.split(' ')[1])} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Tình trạng đơn hàng</p>
                                    <p className={cn("text-xl font-black", currentStatus.class.split(' ')[1])}>
                                        {currentStatus.label}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Ngày tạo</p>
                                <p className="text-sm font-bold">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sản phẩm</h3>
                                    <span className="text-xs font-bold bg-muted px-2 py-1 rounded-lg">{order.order_items.length} món</span>
                                </div>
                                <div className="space-y-4">
                                    {order.order_items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-primary font-black shrink-0">
                                                {item.products?.name?.[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-sm truncate">{item.products?.name || 'Sản phẩm không rõ'}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                                    Mã: {item.products?.code} • {formatCurrency(item.price_at_order)} x {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-black text-sm tabular-nums">{formatCurrency(item.price_at_order * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-bold italic">Tạm tính</span>
                                        <span className="font-bold">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-primary/5 p-4 rounded-3xl mt-4">
                                        <span className="text-primary font-black uppercase tracking-widest text-[10px]">Tổng cộng</span>
                                        <span className="text-2xl font-black text-primary">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Thao tác nhanh</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {order.status === 'pending' && (
                                <StatusActionButton orderId={order.id} status="processing" label="Xử lý" color="bg-blue-600" />
                            )}
                            {order.status === 'processing' && (
                                <StatusActionButton orderId={order.id} status="shipping" label="Giao hàng" color="bg-purple-600" />
                            )}
                            {order.status === 'shipping' && (
                                <StatusActionButton orderId={order.id} status="completed" label="Hoàn thành" color="bg-emerald-600" />
                            )}
                            {order.status !== 'cancelled' && (
                                <StatusActionButton orderId={order.id} status="cancelled" label={order.status === 'completed' ? "Trả & Hủy đơn" : "Hủy đơn"} color="bg-rose-600" />
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 bg-muted/30">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-2xl">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-sm truncate">{order.customers?.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground">{order.customers?.code}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-3">
                                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-xs font-bold">{order.customers?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-start gap-3 px-3">
                                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-xs font-medium italic opacity-70 leading-relaxed truncate">{order.customers?.address || 'N/A'}</span>
                            </div>
                            <Link
                                href={`/sales/customers/${order.customer_id}`}
                                className="flex items-center justify-center w-full py-3 bg-muted text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                Xem hồ sơ khách
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Payment Control */}
                    <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 bg-muted/30">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className={cn(
                                "p-4 rounded-2xl border flex items-center justify-between",
                                order.payment_status === 'paid'
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                            )}>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-wide">
                                        {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>

                            <form action={async () => {
                                'use server'
                                const { updatePaymentStatus } = await import('../actions')
                                await updatePaymentStatus(order.id, order.payment_status === 'paid' ? 'unpaid' : 'paid')
                            }}>
                                <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl shadow-lg shadow-zinc-900/20 text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
                                    Dánh dấu {order.payment_status === 'paid' ? 'Chưa trả' : 'Đã trả tiền'}
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatusActionButton({ orderId, status, label, color }: any) {
    return (
        <form action={async () => {
            'use server'
            const { updateOrderStatus } = await import('../actions')
            await updateOrderStatus(orderId, status)
        }}>
            <button className={cn("w-full py-3 text-white rounded-xl shadow-md text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all", color)}>
                {label}
            </button>
        </form>
    )
}
