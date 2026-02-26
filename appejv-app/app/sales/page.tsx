'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, Users, AlertTriangle, BarChart3, ChevronDown, ShoppingCart, TrendingUp, X, Receipt } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'

const filterTabs = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'thisMonth', label: 'Tháng này' },
    { id: 'lastMonth', label: 'Tháng trước' },
    { id: 'thisYear', label: 'Năm nay' },
    { id: 'other', label: 'Khác' },
]

const timeRangeOptions = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'last7days', label: '7 ngày qua' },
    { id: 'thisMonth', label: 'Tháng này' },
    { id: 'lastMonth', label: 'Tháng trước' },
    { id: 'thisQuarter', label: 'Quý này' },
    { id: 'thisYear', label: 'Năm nay' },
    { id: 'all', label: 'Tất cả' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Nháp', color: 'text-gray-700', bg: 'bg-gray-100' },
    ordered: { label: 'Đặt hàng', color: 'text-amber-700', bg: 'bg-amber-100' },
    shipping: { label: 'Giao hàng', color: 'text-blue-700', bg: 'bg-blue-100' },
    paid: { label: 'Thanh toán', color: 'text-purple-700', bg: 'bg-purple-100' },
    completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
}

function getDateRange(filter: string) {
    const now = new Date()
    let startDate: Date
    let endDate: Date = new Date()
    switch (filter) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
            break
        case 'yesterday':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            break
        case 'last7days':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
            break
        case 'lastMonth':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            endDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
        case 'thisQuarter': {
            const q = Math.floor(now.getMonth() / 3)
            startDate = new Date(now.getFullYear(), q * 3, 1)
            endDate = new Date(now.getFullYear(), (q + 1) * 3, 1)
            break
        }
        case 'thisYear':
            startDate = new Date(now.getFullYear(), 0, 1)
            endDate = new Date(now.getFullYear() + 1, 0, 1)
            break
        case 'all':
            startDate = new Date(2020, 0, 1)
            endDate = new Date(now.getFullYear() + 1, 0, 1)
            break
        default: // thisMonth
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }
    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
}

function buildChartData(orders: any[], filter: string) {
    const now = new Date()
    const grouped: Record<string, number> = {}
    orders.forEach((o: any) => {
        const d = new Date(o.created_at)
        let key: string
        if (filter === 'today' || filter === 'yesterday') {
            key = `${Math.floor(d.getHours() / 3) * 3}h`
        } else if (filter === 'last7days') {
            key = `${d.getDate()}/${d.getMonth() + 1}`
        } else if (filter === 'thisYear' || filter === 'all') {
            key = `T${d.getMonth() + 1}`
        } else {
            key = `T${Math.ceil(d.getDate() / 7)}`
        }
        grouped[key] = (grouped[key] || 0) + (o.total_amount || 0)
    })
    const result: { label: string; value: number; isHighlight: boolean }[] = []
    if (filter === 'today' || filter === 'yesterday') {
        for (let h = 0; h < 24; h += 3) {
            result.push({ label: `${h}h`, value: grouped[`${h}h`] || 0, isHighlight: filter === 'today' && now.getHours() >= h && now.getHours() < h + 3 })
        }
    } else if (filter === 'last7days') {
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now); d.setDate(now.getDate() - i)
            const key = `${d.getDate()}/${d.getMonth() + 1}`
            result.push({ label: key, value: grouped[key] || 0, isHighlight: i === 0 })
        }
    } else if (filter === 'thisMonth' || filter === 'lastMonth') {
        for (let w = 1; w <= 4; w++) result.push({ label: `T${w}`, value: grouped[`T${w}`] || 0, isHighlight: false })
    } else if (filter === 'thisQuarter') {
        const q = Math.floor(now.getMonth() / 3)
        for (let m = q * 3; m < q * 3 + 3; m++) result.push({ label: `T${m + 1}`, value: grouped[`T${m + 1}`] || 0, isHighlight: m === now.getMonth() })
    } else {
        for (let m = 1; m <= 12; m++) result.push({ label: `T${m}`, value: grouped[`T${m}`] || 0, isHighlight: m === now.getMonth() + 1 })
    }
    return result
}

export default function SalesDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState({ orderedCount: 0, lowStockCount: 0, customerCount: 0, totalRevenue: 0 })
    const [teamStats, setTeamStats] = useState({ teamMembers: 0, teamCustomers: 0, teamOrders: 0, teamRevenue: 0 })
    const [topPerformers, setTopPerformers] = useState<{ name: string; revenue: number }[]>([])
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [chartData, setChartData] = useState<{ label: string; value: number; isHighlight: boolean }[]>([])
    const [activeFilter, setActiveFilter] = useState('thisMonth')
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'

    useEffect(() => { fetchData() }, [activeFilter])

    const fetchData = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/auth/login'); return }
            setUser(user)

            const { data: pd } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
            if (!pd || !['sale', 'admin', 'sale_admin'].includes((pd as any).role)) { router.push('/'); return }
            setProfile(pd)

            const isSale = (pd as any).role === 'sale'
            const isSaleAdmin = (pd as any).role === 'sale_admin'
            let managedIds: string[] = []
            if (isSaleAdmin) {
                const { data: ms } = await supabase.from('profiles').select('id').eq('manager_id', user.id)
                managedIds = ms?.map((s: any) => s.id) || []
            }

            const { startDate, endDate } = getDateRange(activeFilter)

            let oQ = supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'ordered').gte('created_at', startDate).lt('created_at', endDate)
            if (isSale) oQ = oQ.eq('sale_id', user.id)
            else if (isSaleAdmin) oQ = oQ.in('sale_id', [user.id, ...managedIds])
            const { count: orderedCount } = await oQ

            const { count: lowStockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock', 20)

            let cQ = supabase.from('customers').select('*', { count: 'exact', head: true })
            if (isSale) cQ = cQ.eq('assigned_to', user.id)
            else if (isSaleAdmin) cQ = cQ.in('assigned_to', [user.id, ...managedIds])
            const { count: customerCount } = await cQ

            let rQ = supabase.from('orders').select('total_amount, created_at').eq('status', 'completed').gte('created_at', startDate).lt('created_at', endDate)
            if (isSale) rQ = rQ.eq('sale_id', user.id)
            else if (isSaleAdmin) rQ = rQ.in('sale_id', [user.id, ...managedIds])
            const { data: completedOrders } = await rQ
            const totalRevenue = completedOrders?.reduce((s, o: any) => s + (o.total_amount || 0), 0) || 0

            let recQ = supabase.from('orders').select('id, status, total_amount, created_at').order('created_at', { ascending: false }).limit(5)
            if (isSale) recQ = recQ.eq('sale_id', user.id)
            else if (isSaleAdmin) recQ = recQ.in('sale_id', [user.id, ...managedIds])
            const { data: recentData } = await recQ

            setStats({ orderedCount: orderedCount || 0, lowStockCount: lowStockCount || 0, customerCount: customerCount || 0, totalRevenue })
            setRecentOrders(recentData || [])
            setChartData(buildChartData(completedOrders || [], activeFilter))

            if (isSaleAdmin && managedIds.length > 0) {
                const { count: tc } = await supabase.from('customers').select('*', { count: 'exact', head: true }).in('assigned_to', managedIds)
                const { count: to } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('sale_id', managedIds)
                const { data: tr } = await supabase.from('orders').select('total_amount').in('sale_id', managedIds).eq('status', 'completed')
                const tRev = tr?.reduce((s: number, o: any) => s + (o.total_amount || 0), 0) || 0
                setTeamStats({ teamMembers: managedIds.length, teamCustomers: tc || 0, teamOrders: to || 0, teamRevenue: tRev })

                const perf = await Promise.all(managedIds.slice(0, 5).map(async (id) => {
                    const { data: p } = await supabase.from('profiles').select('full_name').eq('id', id).single()
                    const { data: ords } = await supabase.from('orders').select('total_amount').eq('sale_id', id).eq('status', 'completed')
                    const rev = ords?.reduce((s: number, o: any) => s + (o.total_amount || 0), 0) || 0
                    return { name: (p as any)?.full_name || 'Unknown', revenue: rev }
                }))
                setTopPerformers(perf.sort((a, b) => b.revenue - a.revenue).slice(0, 3))
            }
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const maxChart = Math.max(...chartData.map(d => d.value), 1)
    const isSaleAdmin = profile?.role === 'sale_admin'

    if (loading) return (
        <div className="bg-[#f0f9ff] min-h-screen flex items-center justify-center">
            <div className="text-gray-500">Đang tải...</div>
        </div>
    )

    return (
        <div className="bg-[#f0f9ff] min-h-screen">
            {/* Fixed Header */}
            <div className={cn("fixed top-0 left-0 right-0 z-50 bg-[#f0f9ff] transition-transform duration-300", isHeaderVisible ? "translate-y-0" : "-translate-y-full")}>
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <img src="/appejv-logo.png" alt="APPE JV" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {user && profile && <><NotificationModal user={user} role={profile.role} /><HeaderMenu user={user} role={profile.role} /></>}
                    </div>
                </div>
            </div>

            {/* Sticky Filter */}
            <div className={cn("sticky left-0 right-0 z-40 bg-[#f0f9ff] px-4 pb-3 pt-2 transition-all duration-300", !isHeaderVisible ? "top-0" : "top-20")}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tổng quan bán hàng</h1>
                        <p className="text-sm text-gray-600">{isSaleAdmin ? 'Hiệu suất nhóm của bạn' : 'Hiệu suất bán hàng của bạn'}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {filterTabs.map(tab => (
                        <button key={tab.id} onClick={() => tab.id === 'other' ? setShowModal(true) : setActiveFilter(tab.id)}
                            className={cn("flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors flex-shrink-0",
                                activeFilter === tab.id ? "bg-[#175ead] text-white border-[#175ead]" : "bg-white text-gray-600 border-gray-200")}>
                            {tab.label}
                            {tab.id === 'other' && <ChevronDown className="w-3 h-3" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="pt-44 pb-20 px-4 flex flex-col gap-4">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-[#175ead]" />
                        <span className="text-sm font-semibold text-gray-900">Biểu đồ doanh thu</span>
                        <span className="text-xs text-gray-400 ml-auto">{timeRangeOptions.find(o => o.id === activeFilter)?.label}</span>
                    </div>
                    <div className="flex items-end gap-0.5" style={{ height: '80px' }}>
                        {chartData.length > 0 ? chartData.map((pt, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 h-full">
                                <div className={cn("w-full rounded-t-sm", pt.isHighlight ? "bg-[#175ead]" : "bg-[#175ead]/25")}
                                    style={{ height: `${Math.max((pt.value / maxChart) * 64, pt.value > 0 ? 3 : 0)}px` }} />
                                <span className="text-[6px] text-gray-400 truncate w-full text-center">{pt.label}</span>
                            </div>
                        )) : <div className="w-full flex items-center justify-center text-gray-400 text-xs italic">Chưa có dữ liệu</div>}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <MetricCard title="Tổng doanh thu" icon={TrendingUp} value={formatCurrency(stats.totalRevenue)} color="text-emerald-600" bg="bg-emerald-50" />
                    <MetricCard title="Đặt hàng" icon={ShoppingBag} value={stats.orderedCount.toString()} color="text-amber-600" bg="bg-amber-50" />
                    <MetricCard title="Hàng sắp hết" icon={AlertTriangle} value={stats.lowStockCount.toString()} color="text-red-500" bg="bg-red-50" />
                    <MetricCard title="Khách hàng" icon={Users} value={stats.customerCount.toString()} color="text-[#175ead]" bg="bg-blue-50" />
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Thao tác nhanh</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <QuickActionButton title="Tạo đơn mới" href="/sales/selling" icon={ShoppingBag} color="bg-blue-50" iconColor="text-[#175ead]" />
                        <QuickActionButton title="Khách hàng" href="/sales/customers" icon={Users} color="bg-emerald-50" iconColor="text-emerald-600" />
                        <QuickActionButton title="Bán hàng" href="/sales/selling" icon={ShoppingCart} color="bg-amber-50" iconColor="text-amber-600" />
                        <QuickActionButton title="Báo cáo" href="/sales/reports" icon={BarChart3} color="bg-indigo-50" iconColor="text-indigo-600" />
                    </div>
                </div>

                {/* Team Performance */}
                {isSaleAdmin && (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">👥 Hiệu suất Team</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <MetricCard title="Thành viên" icon={Users} value={teamStats.teamMembers.toString()} color="text-[#175ead]" bg="bg-blue-50" />
                                <MetricCard title="Khách hàng" icon={Users} value={teamStats.teamCustomers.toString()} color="text-emerald-600" bg="bg-emerald-50" />
                                <MetricCard title="Đơn hàng" icon={ShoppingBag} value={teamStats.teamOrders.toString()} color="text-amber-600" bg="bg-amber-50" />
                                <MetricCard title="Doanh thu" icon={TrendingUp} value={new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(teamStats.teamRevenue)} color="text-emerald-600" bg="bg-emerald-50" />
                            </div>
                        </div>
                        {topPerformers.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">📊 Top Performers</h2>
                                <div className="flex flex-col gap-2">
                                    {topPerformers.map((p, i) => (
                                        <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                                            <span className="text-xl font-bold text-[#175ead] w-8">#{i + 1}</span>
                                            <span className="flex-1 text-sm font-semibold text-gray-900">{p.name}</span>
                                            <span className="text-sm font-bold text-emerald-600">{formatCurrency(p.revenue)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Recent Orders */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
                        <Link href="/sales/orders" className="text-sm font-medium text-[#175ead]">Xem tất cả</Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow-sm">
                            <Receipt className="w-12 h-12 text-gray-200" />
                            <p className="text-sm text-gray-400">Chưa có đơn hàng nào</p>
                            <Link href="/sales/selling">
                                <Button size="sm" className="bg-[#175ead] hover:bg-blue-700 text-white rounded-lg">Tạo đơn đầu tiên</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {recentOrders.map(order => {
                                const cfg = statusMap[order.status] || statusMap.draft
                                return (
                                    <Link key={order.id} href={`/sales/orders/${order.id}`}>
                                        <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <Receipt className="w-5 h-5 text-[#175ead]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Đơn #{order.id}</p>
                                                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.total_amount)}</span>
                                                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md", cfg.bg, cfg.color)}>{cfg.label}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Time Range Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-t-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <span className="text-lg font-bold text-gray-900">Chọn thời gian</span>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto">
                            {timeRangeOptions.map(opt => (
                                <button key={opt.id} onClick={() => { setActiveFilter(opt.id); setShowModal(false) }}
                                    className={cn("w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 text-left",
                                        activeFilter === opt.id ? "bg-blue-50" : "hover:bg-gray-50")}>
                                    <span className={cn("text-base", activeFilter === opt.id ? "text-[#175ead] font-semibold" : "text-gray-700")}>{opt.label}</span>
                                    {activeFilter === opt.id && <span className="text-[#175ead] text-lg">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function MetricCard({ title, icon: Icon, value, color, bg }: { title: string; icon: any; value: string; color: string; bg: string }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 flex-1">{title}</span>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bg)}>
                    <Icon className={cn("w-4 h-4", color)} />
                </div>
            </div>
            <div className="text-xl font-bold text-gray-900 truncate">{value}</div>
        </div>
    )
}

function QuickActionButton({ title, href, icon: Icon, color, iconColor }: { title: string; href: string; icon: any; color: string; iconColor: string }) {
    return (
        <Link href={href} className={cn("flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 transition-all active:scale-95", color)}>
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{title}</span>
        </Link>
    )
}
