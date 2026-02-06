import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PeriodFilter } from './PeriodFilter'
import { TrendingUp, Package, Tag, Wallet } from 'lucide-react'
import { redirect } from 'next/navigation'

// Types for aggregation
type ReportData = {
    name: string
    revenue: number
    quantity: number
}

type TrendData = {
    label: string
    revenue: number
}

async function getAnalytics(period: string = 'this_month', userId?: string, isSale?: boolean, isSaleAdmin?: boolean) {
    const supabase = await createClient()

    let managedSaleIds: string[] = []
    if (isSaleAdmin && userId) {
        const { data: managedSales } = await supabase
            .from('profiles')
            .select('id')
            .eq('manager_id', userId)
        managedSaleIds = (managedSales as any[])?.map(s => s.id) || []
    }

    let query = supabase
        .from('orders')
        .select(`
            id,
            created_at,
            order_items (
                quantity,
                price_at_order,
                products ( name, category )
            )
        `)
        .eq('status', 'completed')

    if (isSale && userId) {
        query = query.eq('sale_id', userId)
    } else if (isSaleAdmin && userId) {
        query = query.in('sale_id', [userId, ...managedSaleIds])
    }

    const now = new Date()
    if (period === 'this_month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        query = query.gte('created_at', startOfMonth)
    } else if (period === 'last_3_months') {
        const date = new Date()
        date.setMonth(date.getMonth() - 2)
        const startOfPeriod = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
        query = query.gte('created_at', startOfPeriod)
    } else if (period === 'this_year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString()
        query = query.gte('created_at', startOfYear)
    }

    const { data: orders } = await query as { data: any[] | null }

    // Aggregate data using a single loop for efficiency
    const byProduct: Record<string, ReportData> = {}
    const byCategory: Record<string, ReportData> = {}
    const trendMap: Record<string, number> = {}
    let totalRevenue = 0

    if (orders) {
        for (const order of orders) {
            const date = new Date(order.created_at)
            const monthLabel = date.toLocaleString('default', { month: 'short' })

            let orderTotal = 0
            const items = order.order_items as any[]

            for (const item of items) {
                const productName = item.products?.name || 'Unknown'
                const category = item.products?.category || 'Uncategorized'
                const revenue = (item.price_at_order || 0) * (item.quantity || 0)

                orderTotal += revenue
                totalRevenue += revenue

                // Product Aggregation
                if (!byProduct[productName]) {
                    byProduct[productName] = { name: productName, revenue: 0, quantity: 0 }
                }
                byProduct[productName].revenue += revenue
                byProduct[productName].quantity += item.quantity

                // Category Aggregation
                if (!byCategory[category]) {
                    byCategory[category] = { name: category, revenue: 0, quantity: 0 }
                }
                byCategory[category].revenue += revenue
                byCategory[category].quantity += item.quantity
            }

            // Trend (Monthly)
            trendMap[monthLabel] = (trendMap[monthLabel] || 0) + orderTotal
        }
    }

    return {
        totalRevenue,
        byProduct: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue),
        byCategory: Object.values(byCategory).sort((a, b) => b.revenue - a.revenue),
        trend: Object.entries(trendMap).map(([label, revenue]) => ({ label, revenue }))
    }
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id!).single()
    const role = (profile as any)?.role
    if (role !== 'sale' && role !== 'admin' && role !== 'sale_admin') {
        redirect('/')
    }

    const isSale = role === 'sale'
    const isSaleAdmin = role === 'sale_admin'
    const { period = 'this_month' } = await searchParams
    const { totalRevenue, byProduct, byCategory, trend } = await getAnalytics(period, user.id, isSale, isSaleAdmin)

    const maxRevenue = Math.max(...trend.map(t => t.revenue), 1)

    const ReportTable = ({ data, title, icon: Icon }: { data: ReportData[], title: string, icon: any }) => (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {data.slice(0, 10).map((item, idx) => (
                        <div key={idx} className="group flex justify-between items-center text-sm">
                            <div className="space-y-1">
                                <p className="font-medium group-hover:text-primary transition-colors">{item.name}</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary/60"
                                            style={{ width: `${(item.revenue / (data[0]?.revenue || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.quantity} units</p>
                                </div>
                            </div>
                            <span className="font-bold tabular-nums">{formatCurrency(item.revenue)}</span>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="py-10 text-center space-y-2">
                            <Package className="w-8 h-8 mx-auto text-muted-foreground/30" />
                            <p className="text-muted-foreground text-sm">No sales data in this period.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="p-6 pb-32 flex flex-col gap-8 bg-gradient-to-b from-background to-muted/20 min-h-screen max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Báo cáo & Phân tích</h1>
                    <PeriodFilter />
                </div>
                <p className="text-muted-foreground font-medium italic">Theo dõi chi tiết hiệu suất bán hàng {isSaleAdmin ? 'của nhóm' : ''}.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground shadow-xl shadow-primary/20 rounded-3xl">
                    <div className="absolute top-0 right-0 p-6 opacity-20 text-white">
                        <Wallet className="w-12 h-12" />
                    </div>
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Tổng doanh thu</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="text-4xl font-black">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs mt-2 opacity-70 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Based on selected period
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-3xl font-bold truncate">
                            {byCategory[0]?.name || '---'}
                        </div>
                        <p className="text-xs mt-2 text-muted-foreground">
                            Highest performing category
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Trend Chart (CSS based) */}
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="p-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Revenue Trend
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                    <div className="h-48 flex items-end gap-1 md:gap-2 px-1">
                        {trend.length > 0 ? trend.map((t, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full relative flex flex-col justify-end h-32">
                                    <div
                                        className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg md:rounded-t-xl relative group-hover:ring-2 ring-primary/20"
                                        style={{ height: `${(t.revenue / maxRevenue) * 100}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-20 whitespace-nowrap">
                                            {formatCurrency(t.revenue)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60 truncate w-full text-center">{t.label}</span>
                            </div>
                        )) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold italic opacity-40">
                                Chưa có đủ dữ liệu để phân tích xu hướng
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 h-12 rounded-2xl">
                    <TabsTrigger value="product" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-xs uppercase tracking-wider">Sản phẩm</TabsTrigger>
                    <TabsTrigger value="category" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-xs uppercase tracking-wider">Danh mục</TabsTrigger>
                </TabsList>
                <TabsContent value="product" className="mt-0">
                    <ReportTable data={byProduct} title="Sản phẩm bán chạy" icon={Package} />
                </TabsContent>
                <TabsContent value="category" className="mt-0">
                    <ReportTable data={byCategory} title="Danh mục hiệu quả" icon={Tag} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
