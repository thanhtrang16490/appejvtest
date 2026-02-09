'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, ShoppingBag, Users, AlertTriangle, BarChart3, ChevronDown, Menu, Bell, ShoppingCart } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'

const filterTabs = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'thisMonth', label: 'Tháng này' },
    { id: 'other', label: 'Khác' },
]

export default function SalesDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState({
        pendingCount: 0,
        lowStockCount: 0,
        customerCount: 0,
        totalRevenue: 0
    })
    const [activeFilter, setActiveFilter] = useState('thisMonth')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

    useEffect(() => {
        fetchData()
    }, [activeFilter])

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

            // Verify role
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
            const isAdmin = (profileData as any).role === 'admin'

            // For Sale Admin, fetch managed sales IDs
            let managedSaleIds: string[] = []
            if (isSaleAdmin) {
                const { data: managedSales } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('manager_id', user.id)
                managedSaleIds = managedSales?.map((s: any) => s.id) || []
            }

            // Get date range based on filter
            const { startDate, endDate } = getDateRange()

            // Fetch Stats
            // 1. Pending Orders
            let pendingQuery = supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending')
                .gte('created_at', startDate)
                .lt('created_at', endDate)

            if (isSale) {
                pendingQuery = pendingQuery.eq('sale_id', user.id)
            } else if (isSaleAdmin) {
                pendingQuery = pendingQuery.in('sale_id', [user.id, ...managedSaleIds])
            }
            // Admin sees all - no filter
            const { count: pendingCount } = await pendingQuery

            // 2. Low Stock Items
            const { count: lowStockCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .lt('stock', 20)

            // 3. Customers
            let customerQuery = supabase.from('customers').select('*', { count: 'exact', head: true })
            if (isSale) {
                customerQuery = customerQuery.eq('assigned_sale', user.id)
            } else if (isSaleAdmin) {
                customerQuery = customerQuery.in('assigned_sale', [user.id, ...managedSaleIds])
            }
            // Admin sees all customers - no filter
            const { count: customerCount } = await customerQuery

            // 4. Completed Orders & Revenue
            let revenueQuery = supabase
                .from('orders')
                .select('total_amount')
                .eq('status', 'completed')
                .gte('created_at', startDate)
                .lt('created_at', endDate)

            if (isSale) {
                revenueQuery = revenueQuery.eq('sale_id', user.id)
            } else if (isSaleAdmin) {
                revenueQuery = revenueQuery.in('sale_id', [user.id, ...managedSaleIds])
            }
            // Admin sees all revenue - no filter
            const { data: completedOrders } = await revenueQuery

            const totalRevenue = completedOrders?.reduce((sum, o: any) => sum + (o.total_amount || 0), 0) || 0

            setStats({
                pendingCount: pendingCount || 0,
                lowStockCount: lowStockCount || 0,
                customerCount: customerCount || 0,
                totalRevenue
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDateRange = () => {
        const now = new Date()
        let startDate: Date
        let endDate: Date = new Date()

        switch (activeFilter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                break
            case 'yesterday':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                break
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
                break
            default:
                startDate = new Date(0)
                endDate = new Date()
        }

        return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount) + ' VNĐ'
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

    const isSale = (profile as any).role === 'sale'
    const isSaleAdmin = (profile as any).role === 'sale_admin'

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

            {/* Sticky Filter Tabs */}
            <div className={cn(
                "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2 pt-2 transition-all duration-300",
                !isHeaderVisible ? "top-0" : "top-20"
            )}>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tổng quan bán hàng</h1>
                            <p className="text-sm text-gray-600">
                                {isSaleAdmin ? 'Hiệu suất nhóm của bạn' : 'Hiệu suất bán hàng của bạn'}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                        </div>
                    </div>
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {filterTabs.map((tab) => (
                            <Button
                                key={tab.id}
                                variant={activeFilter === tab.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveFilter(tab.id)}
                                className={cn(
                                    "rounded-full whitespace-nowrap text-sm font-medium",
                                    activeFilter === tab.id 
                                        ? "bg-[#175ead] text-white" 
                                        : "bg-white text-gray-600 border-gray-200"
                                )}
                            >
                                {tab.label}
                                {tab.id === 'other' && <ChevronDown className="w-4 h-4 ml-1" />}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-44 pb-20">
                <div className="p-4 flex flex-col gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard 
                            title="Tổng doanh thu" 
                            icon={BarChart3} 
                            value={formatCurrency(stats.totalRevenue)} 
                            color="text-emerald-500" 
                            bg="bg-emerald-50" 
                        />
                        <MetricCard 
                            title="Chờ xử lý" 
                            icon={ShoppingBag} 
                            value={stats.pendingCount.toString()} 
                            color="text-amber-500" 
                            bg="bg-amber-50" 
                        />
                        <MetricCard 
                            title="Hàng sắp hết" 
                            icon={AlertTriangle} 
                            value={stats.lowStockCount.toString()} 
                            color="text-rose-500" 
                            bg="bg-rose-50" 
                        />
                        <MetricCard 
                            title="Khách hàng" 
                            icon={Users} 
                            value={stats.customerCount.toString()} 
                            color="text-[#175ead]" 
                            bg="bg-blue-50" 
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <QuickActionButton 
                                title="Tạo đơn mới" 
                                href="/sales/selling" 
                                icon={ShoppingBag} 
                                color="bg-blue-50 text-blue-600 border-blue-200" 
                            />
                            <QuickActionButton 
                                title="Khách hàng" 
                                href="/sales/customers" 
                                icon={Users} 
                                color="bg-emerald-50 text-emerald-600 border-emerald-200" 
                            />
                            <QuickActionButton 
                                title="Bán hàng" 
                                href="/sales/selling" 
                                icon={ShoppingCart} 
                                color="bg-amber-50 text-amber-600 border-amber-200" 
                            />
                            <QuickActionButton 
                                title="Báo cáo" 
                                href="/sales/reports" 
                                icon={BarChart3} 
                                color="bg-indigo-50 text-indigo-600 border-indigo-200" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, icon: Icon, value, color, bg }: any) {
    return (
        <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-gray-600">{title}</CardTitle>
                <div className={cn("p-2 rounded-lg", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold text-gray-900">{value}</div>
            </CardContent>
        </Card>
    )
}

function QuickActionButton({ title, href, icon: Icon, color }: any) {
    return (
        <Link href={href} className={cn("flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all active:scale-95", color)}>
            <div className="p-3 bg-white rounded-xl shadow-sm">
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-center">{title}</span>
        </Link>
    )
}
