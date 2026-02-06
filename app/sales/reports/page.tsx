'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TrendingUp, Package, Tag, Wallet, Sparkles, BarChart3 } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'

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

async function getAnalytics(period: string = 'this_month', userId?: string, isSale?: boolean, isSaleAdmin?: boolean, supabase?: any) {
    if (!supabase) {
        throw new Error('Supabase client is required')
    }

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

export default function ReportsPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('this_month')
    const [analytics, setAnalytics] = useState<{
        totalRevenue: number
        byProduct: ReportData[]
        byCategory: ReportData[]
        trend: TrendData[]
    }>({
        totalRevenue: 0,
        byProduct: [],
        byCategory: [],
        trend: []
    })
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

    useEffect(() => {
        fetchData()
    }, [period])

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

            const data = await getAnalytics(period, user.id, isSale, isSaleAdmin, supabase)
            setAnalytics(data)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

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

    const isSaleAdmin = (profile as any).role === 'sale_admin'
    const { totalRevenue, byProduct, byCategory, trend } = analytics
    const maxRevenue = Math.max(...trend.map(t => t.revenue), 1)

    const ReportTable = ({ data, title, icon: Icon }: { data: ReportData[], title: string, icon: any }) => (
        <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#175ead]">
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
                                <p className="font-medium group-hover:text-[#175ead] transition-colors">{item.name}</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#175ead]/60"
                                            style={{ width: `${(item.revenue / (data[0]?.revenue || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">{item.quantity} units</p>
                                </div>
                            </div>
                            <span className="font-bold tabular-nums text-gray-900">{formatCurrency(item.revenue)}</span>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="py-10 text-center space-y-2">
                            <Package className="w-8 h-8 mx-auto text-gray-300" />
                            <p className="text-gray-500 text-sm">Không có dữ liệu bán hàng trong khoảng thời gian này.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )

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
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>
            </div>

            {/* Sticky Title Section */}
            <div className={cn(
                "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2 pt-2 transition-all duration-300",
                !isHeaderVisible ? "top-0" : "top-20"
            )}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
                        <p className="text-sm text-gray-600">
                            Theo dõi chi tiết hiệu suất bán hàng {isSaleAdmin ? 'của nhóm' : ''}.
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-[#175ead]" />
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-44 pb-20">
                <div className="p-4 flex flex-col gap-6">
                    {/* Period Filter */}
                    <div className="flex justify-end">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="flex h-9 w-[180px] items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
                        >
                            <option value="this_month">Tháng này</option>
                            <option value="last_3_months">3 tháng gần đây</option>
                            <option value="this_year">Năm nay</option>
                            <option value="all">Tất cả</option>
                        </select>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="relative overflow-hidden border-none bg-gradient-to-r from-[#175ead] to-[#2575be] text-white shadow-lg rounded-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                <Wallet className="w-12 h-12" />
                            </div>
                            <CardHeader className="p-6 pb-0">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider opacity-90">Tổng doanh thu</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                                <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Dựa trên khoảng thời gian đã chọn
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white rounded-2xl shadow-sm border-0">
                            <CardHeader className="p-6 pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase tracking-wider">Danh mục hàng đầu</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="text-2xl font-bold text-gray-900 truncate">
                                    {byCategory[0]?.name || '---'}
                                </div>
                                <p className="text-xs mt-2 text-gray-500">
                                    Danh mục có hiệu suất cao nhất
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trend Chart (CSS based) */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                        <CardHeader className="p-6">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                Xu hướng doanh thu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0">
                            <div className="h-48 flex items-end gap-1 md:gap-2 px-1">
                                {trend.length > 0 ? trend.map((t, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full relative flex flex-col justify-end h-32">
                                            <div
                                                className="w-full bg-[#175ead]/20 hover:bg-[#175ead]/40 transition-all rounded-t-lg md:rounded-t-xl relative group-hover:ring-2 ring-[#175ead]/20"
                                                style={{ height: `${(t.revenue / maxRevenue) * 100}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-20 whitespace-nowrap">
                                                    {formatCurrency(t.revenue)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-tighter text-gray-500 truncate w-full text-center">{t.label}</span>
                                    </div>
                                )) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium italic">
                                        Chưa có đủ dữ liệu để phân tích xu hướng
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="product" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 p-1 h-12 rounded-2xl shadow-sm">
                            <TabsTrigger value="product" className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Sản phẩm</TabsTrigger>
                            <TabsTrigger value="category" className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Danh mục</TabsTrigger>
                        </TabsList>
                        <TabsContent value="product" className="mt-0">
                            <ReportTable data={byProduct} title="Sản phẩm bán chạy" icon={Package} />
                        </TabsContent>
                        <TabsContent value="category" className="mt-0">
                            <ReportTable data={byCategory} title="Danh mục hiệu quả" icon={Tag} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
