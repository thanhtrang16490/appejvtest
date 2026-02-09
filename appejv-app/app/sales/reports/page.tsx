'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TrendingUp, Package, Tag, Wallet, BarChart3, ChevronDown } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { ReportsLoading } from '@/components/loading/ReportsLoading'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'

const filterTabs = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'this_month', label: 'Tháng này' },
    { id: 'other', label: 'Khác' },
]

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

type CustomerData = {
    id: number
    name: string
    revenue: number
    orderCount: number
}

type SaleData = {
    id: string
    name: string
    revenue: number
    orderCount: number
}

type SaleAdminData = {
    id: string
    name: string
    revenue: number
    orderCount: number
    managedSalesCount: number
}

async function getAnalytics(period: string = 'this_month', userId?: string, role?: string, supabase?: any) {
    if (!supabase) {
        throw new Error('Supabase client is required')
    }

    const isAdmin = role === 'admin'
    const isSale = role === 'sale'
    const isSaleAdmin = role === 'sale_admin'

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
            customer_id,
            sale_id,
            customers ( name ),
            profiles!orders_sale_id_fkey ( full_name, role ),
            order_items (
                quantity,
                price_at_order,
                products ( name, category )
            )
        `)
        .eq('status', 'completed')

    // Admin sees ALL data - no filter
    if (isAdmin) {
        // No filter for admin
    } else if (isSale && userId) {
        query = query.eq('sale_id', userId)
    } else if (isSaleAdmin && userId) {
        query = query.in('sale_id', [userId, ...managedSaleIds])
    }

    const now = new Date()
    if (period === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
        query = query.gte('created_at', startOfDay).lt('created_at', endOfDay)
    } else if (period === 'yesterday') {
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
        const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        query = query.gte('created_at', startOfYesterday).lt('created_at', endOfYesterday)
    } else if (period === 'this_month') {
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
    const byCustomer: Record<number, CustomerData> = {}
    const bySale: Record<string, SaleData> = {}
    const bySaleAdmin: Record<string, SaleAdminData> = {}
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

            // Customer Aggregation (for admin only)
            if (isAdmin && order.customer_id) {
                if (!byCustomer[order.customer_id]) {
                    byCustomer[order.customer_id] = {
                        id: order.customer_id,
                        name: order.customers?.name || 'Unknown',
                        revenue: 0,
                        orderCount: 0
                    }
                }
                byCustomer[order.customer_id].revenue += orderTotal
                byCustomer[order.customer_id].orderCount += 1
            }

            // Sale Aggregation (for admin only)
            if (isAdmin && order.sale_id) {
                const saleRole = order.profiles?.role
                
                // Aggregate by Sale (only role='sale')
                if (saleRole === 'sale') {
                    if (!bySale[order.sale_id]) {
                        bySale[order.sale_id] = {
                            id: order.sale_id,
                            name: order.profiles?.full_name || 'Unknown',
                            revenue: 0,
                            orderCount: 0
                        }
                    }
                    bySale[order.sale_id].revenue += orderTotal
                    bySale[order.sale_id].orderCount += 1
                }
                
                // Aggregate by Sale Admin (only role='sale_admin')
                if (saleRole === 'sale_admin') {
                    if (!bySaleAdmin[order.sale_id]) {
                        bySaleAdmin[order.sale_id] = {
                            id: order.sale_id,
                            name: order.profiles?.full_name || 'Unknown',
                            revenue: 0,
                            orderCount: 0,
                            managedSalesCount: 0
                        }
                    }
                    bySaleAdmin[order.sale_id].revenue += orderTotal
                    bySaleAdmin[order.sale_id].orderCount += 1
                }
            }

            // Trend (Monthly)
            trendMap[monthLabel] = (trendMap[monthLabel] || 0) + orderTotal
        }
    }

    return {
        totalRevenue,
        byProduct: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue),
        byCategory: Object.values(byCategory).sort((a, b) => b.revenue - a.revenue),
        byCustomer: Object.values(byCustomer).sort((a, b) => b.revenue - a.revenue),
        bySale: Object.values(bySale).sort((a, b) => b.revenue - a.revenue),
        bySaleAdmin: Object.values(bySaleAdmin).sort((a, b) => b.revenue - a.revenue),
        trend: Object.entries(trendMap).map(([label, revenue]) => ({ label, revenue }))
    }
}

export default function ReportsPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('this_month')
    const [showOtherFilters, setShowOtherFilters] = useState(false)
    const [showAllProducts, setShowAllProducts] = useState(false)
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [showAllCustomers, setShowAllCustomers] = useState(false)
    const [showAllSales, setShowAllSales] = useState(false)
    const [showAllSaleAdmins, setShowAllSaleAdmins] = useState(false)
    const [analytics, setAnalytics] = useState<{
        totalRevenue: number
        byProduct: ReportData[]
        byCategory: ReportData[]
        byCustomer: CustomerData[]
        bySale: SaleData[]
        bySaleAdmin: SaleAdminData[]
        trend: TrendData[]
    }>({
        totalRevenue: 0,
        byProduct: [],
        byCategory: [],
        byCustomer: [],
        bySale: [],
        bySaleAdmin: [],
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

            const userRole = (profileData as any).role

            const data = await getAnalytics(period, user.id, userRole, supabase)
            setAnalytics(data)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="pt-24 pb-20 px-4">
                    <ReportsLoading />
                </div>
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
    const isAdmin = (profile as any).role === 'admin'
    const { totalRevenue, byProduct, byCategory, byCustomer, bySale, bySaleAdmin, trend } = analytics
    const maxRevenue = Math.max(...trend.map(t => t.revenue), 1)

    const ReportTable = ({ data, title, icon: Icon, showAll, onToggle }: { data: ReportData[], title: string, icon: any, showAll: boolean, onToggle: () => void }) => {
        const displayData = showAll ? data.slice(0, 10) : data.slice(0, 5)
        
        return (
            <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-50 text-[#175ead]">
                                <Icon className="w-4 h-4" />
                            </div>
                            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        </div>
                        {data.length > 10 && (
                            <button className="text-xs text-[#175ead] hover:underline font-medium">
                                Xem đầy đủ →
                            </button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {displayData.map((item, idx) => (
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
                    {data.length > 5 && data.length <= 10 && !showAll && (
                        <div className="mt-4 pt-4 border-t">
                            <Button
                                variant="ghost"
                                onClick={onToggle}
                                className="w-full text-[#175ead] hover:text-[#175ead] hover:bg-blue-50"
                            >
                                Xem thêm ({data.length - 5})
                            </Button>
                        </div>
                    )}
                    {data.length > 10 && !showAll && (
                        <div className="mt-4 pt-4 border-t">
                            <Button
                                variant="ghost"
                                onClick={onToggle}
                                className="w-full text-[#175ead] hover:text-[#175ead] hover:bg-blue-50"
                            >
                                Xem thêm 5
                            </Button>
                        </div>
                    )}
                    {showAll && data.length > 5 && (
                        <div className="mt-4 pt-4 border-t">
                            <Button
                                variant="ghost"
                                onClick={onToggle}
                                className="w-full text-[#175ead] hover:text-[#175ead] hover:bg-blue-50"
                            >
                                Thu gọn
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
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
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV Logo" 
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
                            <p className="text-sm text-gray-600">
                                Theo dõi chi tiết hiệu suất bán hàng {isAdmin ? '(Toàn hệ thống)' : isSaleAdmin ? '(Nhóm của bạn)' : ''}.
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-[#175ead]" />
                        </div>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {filterTabs.map((tab) => (
                            <Button
                                key={tab.id}
                                variant={period === tab.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (tab.id === 'other') {
                                        setShowOtherFilters(!showOtherFilters)
                                    } else {
                                        setPeriod(tab.id)
                                        setShowOtherFilters(false)
                                    }
                                }}
                                className={cn(
                                    "rounded-full whitespace-nowrap text-sm font-medium",
                                    period === tab.id 
                                        ? "bg-[#175ead] text-white" 
                                        : "bg-white text-gray-600 border-gray-200"
                                )}
                            >
                                {tab.label}
                                {tab.id === 'other' && <ChevronDown className="w-4 h-4 ml-1" />}
                            </Button>
                        ))}
                    </div>
                    
                    {/* Other Filters Dropdown */}
                    {showOtherFilters && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 space-y-2">
                            <button
                                onClick={() => {
                                    setPeriod('last_3_months')
                                    setShowOtherFilters(false)
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    period === 'last_3_months' 
                                        ? "bg-blue-50 text-[#175ead]" 
                                        : "hover:bg-gray-50 text-gray-700"
                                )}
                            >
                                3 tháng gần đây
                            </button>
                            <button
                                onClick={() => {
                                    setPeriod('this_year')
                                    setShowOtherFilters(false)
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    period === 'this_year' 
                                        ? "bg-blue-50 text-[#175ead]" 
                                        : "hover:bg-gray-50 text-gray-700"
                                )}
                            >
                                Năm nay
                            </button>
                            <button
                                onClick={() => {
                                    setPeriod('all')
                                    setShowOtherFilters(false)
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    period === 'all' 
                                        ? "bg-blue-50 text-[#175ead]" 
                                        : "hover:bg-gray-50 text-gray-700"
                                )}
                            >
                                Tất cả
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-44 pb-20">
                <div className="p-4 flex flex-col gap-6">
                    {/* Overview Cards */}
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

                    {/* Products & Categories with Tabs */}
                    <Tabs defaultValue="product" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 p-1 h-12 rounded-2xl shadow-sm">
                            <TabsTrigger value="product" className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Sản phẩm</TabsTrigger>
                            <TabsTrigger value="category" className="rounded-xl data-[state=active]:bg-[#175ead] data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Danh mục</TabsTrigger>
                        </TabsList>
                        <TabsContent value="product" className="mt-0">
                            <ReportTable 
                                data={byProduct} 
                                title="Sản phẩm bán chạy" 
                                icon={Package}
                                showAll={showAllProducts}
                                onToggle={() => setShowAllProducts(!showAllProducts)}
                            />
                        </TabsContent>
                        <TabsContent value="category" className="mt-0">
                            <ReportTable 
                                data={byCategory} 
                                title="Danh mục hiệu quả" 
                                icon={Tag}
                                showAll={showAllCategories}
                                onToggle={() => setShowAllCategories(!showAllCategories)}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Admin Only: Customers & Sales with Tabs */}
                    {isAdmin && (
                        <Tabs defaultValue="customer" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 p-1 h-12 rounded-2xl shadow-sm">
                                <TabsTrigger value="customer" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Khách hàng</TabsTrigger>
                                <TabsTrigger value="sale" className="rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Sale</TabsTrigger>
                                <TabsTrigger value="saleadmin" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">Sale Admin</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="customer" className="mt-0">
                                <Card className="bg-white rounded-2xl shadow-sm border-0">
                                    <CardHeader className="p-6 pb-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                <CardTitle className="text-lg font-semibold">Top khách hàng</CardTitle>
                                            </div>
                                            {byCustomer.length > 10 && (
                                                <button className="text-xs text-emerald-600 hover:underline font-medium">
                                                    Xem đầy đủ →
                                                </button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {(showAllCustomers ? byCustomer.slice(0, 10) : byCustomer.slice(0, 5)).map((customer, idx) => (
                                                <div key={customer.id} className="group flex justify-between items-center text-sm">
                                                    <div className="space-y-1">
                                                        <p className="font-medium group-hover:text-emerald-600 transition-colors">{customer.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-emerald-500/60"
                                                                    style={{ width: `${(customer.revenue / (byCustomer[0]?.revenue || 1)) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500">{customer.orderCount} đơn</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold tabular-nums text-gray-900">{formatCurrency(customer.revenue)}</span>
                                                </div>
                                            ))}
                                            {byCustomer.length === 0 && (
                                                <div className="py-10 text-center space-y-2">
                                                    <Package className="w-8 h-8 mx-auto text-gray-300" />
                                                    <p className="text-gray-500 text-sm">Không có dữ liệu khách hàng.</p>
                                                </div>
                                            )}
                                        </div>
                                        {byCustomer.length > 5 && byCustomer.length <= 10 && !showAllCustomers && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllCustomers(!showAllCustomers)}
                                                    className="w-full text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50"
                                                >
                                                    Xem thêm ({byCustomer.length - 5})
                                                </Button>
                                            </div>
                                        )}
                                        {byCustomer.length > 10 && !showAllCustomers && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllCustomers(!showAllCustomers)}
                                                    className="w-full text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50"
                                                >
                                                    Xem thêm 5
                                                </Button>
                                            </div>
                                        )}
                                        {showAllCustomers && byCustomer.length > 5 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllCustomers(!showAllCustomers)}
                                                    className="w-full text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50"
                                                >
                                                    Thu gọn
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="sale" className="mt-0">
                                <Card className="bg-white rounded-2xl shadow-sm border-0">
                                    <CardHeader className="p-6 pb-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                <CardTitle className="text-lg font-semibold">Top Sale</CardTitle>
                                            </div>
                                            {bySale.length > 10 && (
                                                <button className="text-xs text-purple-600 hover:underline font-medium">
                                                    Xem đầy đủ →
                                                </button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {(showAllSales ? bySale.slice(0, 10) : bySale.slice(0, 5)).map((sale, idx) => (
                                                <div key={sale.id} className="group flex justify-between items-center text-sm">
                                                    <div className="space-y-1">
                                                        <p className="font-medium group-hover:text-purple-600 transition-colors">{sale.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-purple-500/60"
                                                                    style={{ width: `${(sale.revenue / (bySale[0]?.revenue || 1)) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500">{sale.orderCount} đơn</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold tabular-nums text-gray-900">{formatCurrency(sale.revenue)}</span>
                                                </div>
                                            ))}
                                            {bySale.length === 0 && (
                                                <div className="py-10 text-center space-y-2">
                                                    <Package className="w-8 h-8 mx-auto text-gray-300" />
                                                    <p className="text-gray-500 text-sm">Không có dữ liệu nhân viên.</p>
                                                </div>
                                            )}
                                        </div>
                                        {bySale.length > 5 && bySale.length <= 10 && !showAllSales && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllSales(!showAllSales)}
                                                    className="w-full text-purple-600 hover:text-purple-600 hover:bg-purple-50"
                                                >
                                                    Xem thêm ({bySale.length - 5})
                                                </Button>
                                            </div>
                                        )}
                                        {bySale.length > 10 && !showAllSales && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllSales(!showAllSales)}
                                                    className="w-full text-purple-600 hover:text-purple-600 hover:bg-purple-50"
                                                >
                                                    Xem thêm 5
                                                </Button>
                                            </div>
                                        )}
                                        {showAllSales && bySale.length > 5 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllSales(!showAllSales)}
                                                    className="w-full text-purple-600 hover:text-purple-600 hover:bg-purple-50"
                                                >
                                                    Thu gọn
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="saleadmin" className="mt-0">
                                <Card className="bg-white rounded-2xl shadow-sm border-0">
                                    <CardHeader className="p-6 pb-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-blue-50 text-[#175ead]">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                <CardTitle className="text-lg font-semibold">Top Sale Admin</CardTitle>
                                            </div>
                                            {bySaleAdmin.length > 10 && (
                                                <button className="text-xs text-[#175ead] hover:underline font-medium">
                                                    Xem đầy đủ →
                                                </button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {(showAllSaleAdmins ? bySaleAdmin.slice(0, 10) : bySaleAdmin.slice(0, 5)).map((saleAdmin, idx) => (
                                                <div key={saleAdmin.id} className="group flex justify-between items-center text-sm">
                                                    <div className="space-y-1">
                                                        <p className="font-medium group-hover:text-[#175ead] transition-colors">{saleAdmin.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-[#175ead]/60"
                                                                    style={{ width: `${(saleAdmin.revenue / (bySaleAdmin[0]?.revenue || 1)) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500">{saleAdmin.orderCount} đơn</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold tabular-nums text-gray-900">{formatCurrency(saleAdmin.revenue)}</span>
                                                </div>
                                            ))}
                                            {bySaleAdmin.length === 0 && (
                                                <div className="py-10 text-center space-y-2">
                                                    <Package className="w-8 h-8 mx-auto text-gray-300" />
                                                    <p className="text-gray-500 text-sm">Không có dữ liệu Sale Admin.</p>
                                                </div>
                                            )}
                                        </div>
                                        {bySaleAdmin.length > 5 && bySaleAdmin.length <= 10 && !showAllSaleAdmins && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllSaleAdmins(!showAllSaleAdmins)}
                                                    className="w-full text-[#175ead] hover:text-[#175ead] hover:bg-blue-50"
                                                >
                                                    Xem thêm ({bySaleAdmin.length - 5})
                                                </Button>
                                            </div>
                                        )}
                                        {bySaleAdmin.length > 10 && !showAllSaleAdmins && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllSaleAdmins(!showAllSaleAdmins)}
                                                    className="w-full text-[#175ead] hover:text-[#175ead] hover:bg-blue-50"
                                                >
                                                    Xem thêm 5
                                                </Button>
                                            </div>
                                        )}
                                        {showAllSaleAdmins && bySaleAdmin.length > 5 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowAllSaleAdmins(!showAllSaleAdmins)}
                                                    className="w-full text-[#175ead] hover:text-[#175ead] hover:bg-blue-50"
                                                >
                                                    Thu gọn
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    )
}
