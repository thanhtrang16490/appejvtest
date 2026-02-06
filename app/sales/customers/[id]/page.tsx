import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    ChevronLeft,
    ShoppingBag,
    Calendar,
    Phone,
    MapPin,
    Clock,
    CheckCircle2,
    Package,
    ArrowUpRight,
    TrendingUp,
    Edit,
    Trash2
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { CustomerDetailActions } from '@/components/sales/CustomerDetailActions'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single()
    const isAdmin = (profile as any)?.role === 'admin'

    // 1. Fetch Customer Info
    const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()

    if (!customerData) notFound()
    const customer = customerData as any

    // 2. Fetch Order History
    const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false })

    const orders = (ordersData as any[]) || []
    const totalSpent = orders.reduce((acc, order) => acc + order.total_amount, 0)
    const totalDebt = orders
        .filter(order => order.payment_status === 'unpaid' && order.status !== 'cancelled')
        .reduce((acc, order) => acc + order.total_amount, 0)

    const statusConfig = {
        pending: { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200' },
        processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-700 border-blue-200' },
        shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-700 border-purple-200' },
        completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-700 border-rose-200' }
    }

    return (
        <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto flex flex-col gap-8">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Link href="/sales/customers" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="h-8 w-[1px] bg-muted mx-2 hidden sm:block" />
                <div className="flex-1">
                    <h1 className="text-xl font-black tracking-tight leading-none">Hồ sơ khách hàng</h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{customer.code}</p>
                </div>
                <CustomerDetailActions customer={customer} isAdmin={isAdmin} />
            </div>

            {/* Profile Card */}
            <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[2rem]">
                <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
                    <div className="absolute -bottom-12 left-8 border-8 border-white rounded-full shadow-lg">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
                            <AvatarFallback className="bg-primary text-white text-2xl font-black">
                                {customer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
                <CardContent className="pt-16 pb-8 px-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">{customer.name}</h2>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                                        <Phone className="w-3.5 h-3.5 text-primary opacity-60" />
                                        <span className="font-bold text-foreground">{customer.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-primary opacity-60" />
                                        <span className="truncate max-w-[200px]">{customer.address || 'Chưa cập nhật địa chỉ'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:w-full">
                            <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 text-center">
                                <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-1.5 opacity-60">Tổng đơn hàng</p>
                                <p className="text-2xl font-black tabular-nums">{orders.length}</p>
                            </div>
                            <div className="p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 text-center text-emerald-600">
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-60">Đã chi tiêu</p>
                                <p className="text-lg font-black tabular-nums">{formatCurrency(totalSpent).replace('VNĐ', '')}</p>
                            </div>
                            <div className={cn(
                                "p-4 rounded-3xl border text-center col-span-2 md:col-span-1",
                                totalDebt > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-600" : "bg-muted/30 border-muted opacity-40 text-muted-foreground"
                            )}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-60">Dư nợ hiện tại</p>
                                <p className="text-lg font-black tabular-nums">{formatCurrency(totalDebt).replace('VNĐ', '')}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded-xl">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-black">Lịch sử mua hàng</h3>
                    </div>
                    {orders.length > 0 && (
                        <div className="text-xs font-bold text-muted-foreground">
                            Sorted by newest first
                        </div>
                    )}
                </div>

                <div className="grid gap-3">
                    {orders.length > 0 ? (
                        orders.map((order) => {
                            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                            return (
                                <Link key={order.id} href={`/sales/orders/${order.id}`}>
                                    <Card className="hover:shadow-md transition-all active:scale-[0.98] border-none shadow-sm bg-white overflow-hidden group">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className={cn(
                                                "w-1 h-12 rounded-full",
                                                order.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'
                                            )} />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-muted-foreground">#{order.id}</span>
                                                    <Badge className={cn("text-[9px] px-1.5 py-0 border-none uppercase tracking-tighter", config.class)}>
                                                        {config.label}
                                                    </Badge>
                                                    {order.payment_status === 'unpaid' && order.status !== 'cancelled' && (
                                                        <Badge variant="outline" className="text-[8px] px-1 py-0 border-rose-200 text-rose-600 bg-rose-50 font-black uppercase tracking-tighter">Nợ</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                    <Calendar className="w-3 h-3 opacity-50" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="text-right flex flex-col items-end gap-1">
                                                <p className="font-black text-lg text-primary">{formatCurrency(order.total_amount)}</p>
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                    DETAILS <ArrowUpRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="py-16 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-[2rem] border-2 border-dashed">
                            <Clock className="w-10 h-10 mb-3 opacity-20" />
                            <p className="font-bold">Chưa có lịch sử giao dịch.</p>
                            <p className="text-xs max-w-[200px] text-center mt-1">Khách hàng này chưa có bất kỳ đơn hàng nào trong hệ thống.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
