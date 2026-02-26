'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, cn } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingBag, Plus, Search, X } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { OrdersLoading } from '@/components/loading/OrdersLoading'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { useOrders, useUpdateOrder } from '@/lib/hooks/useOrders'
import { toast } from 'sonner'

const STATUS = {
    draft: { label: 'Đơn nháp', cls: 'bg-gray-100 text-gray-700' },
    ordered: { label: 'Đặt hàng', cls: 'bg-amber-100 text-amber-700' },
    shipping: { label: 'Giao hàng', cls: 'bg-blue-100 text-blue-700' },
    paid: { label: 'Thanh toán', cls: 'bg-purple-100 text-purple-700' },
    completed: { label: 'Hoàn thành', cls: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-700' },
} as Record<string, { label: string; cls: string }>

const TABS = [
    { id: 'draft', label: 'Nháp' }, { id: 'ordered', label: 'Đặt hàng' },
    { id: 'shipping', label: 'Giao hàng' }, { id: 'paid', label: 'Thanh toán' },
    { id: 'completed', label: 'Hoàn thành' }, { id: 'cancelled', label: 'Đã hủy' },
]

const NEXT: Record<string, { status: string; label: string; cls: string }> = {
    draft: { status: 'ordered', label: 'Đặt hàng', cls: 'bg-amber-500 hover:bg-amber-600 text-white' },
    ordered: { status: 'shipping', label: 'Giao hàng', cls: 'bg-blue-500 hover:bg-blue-600 text-white' },
    shipping: { status: 'paid', label: 'Thanh toán', cls: 'bg-purple-500 hover:bg-purple-600 text-white' },
    paid: { status: 'completed', label: 'Hoàn thành', cls: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
}

export default function SalesOrdersPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('draft')
    const [scopeTab, setScopeTab] = useState<'my' | 'team'>('my')
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isHeaderVisible } = useScrollHeader()
    const { data: ordersResponse, isLoading, refetch } = useOrders({})
    const updateOrder = useUpdateOrder()

    useEffect(() => { const t = searchParams.get('tab'); if (t) setActiveTab(t) }, [searchParams])
    useEffect(() => { fetchUser() }, [])

    const fetchUser = async () => {
        try {
            const sb = createClient()
            const { data: { user } } = await sb.auth.getUser()
            if (!user) { router.push('/auth/login'); return }
            setUser(user)
            const { data: pd } = await sb.from('profiles').select('role, full_name').eq('id', user.id).single()
            if (!pd || !['sale', 'admin', 'sale_admin'].includes((pd as any).role)) { router.push('/'); return }
            setProfile(pd)
        } catch (e) { console.error(e) }
    }

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            const result = await updateOrder.mutateAsync({ id: orderId, data: { status: newStatus } })
            if ((result as any).error) toast.error((result as any).error)
            else { toast.success('Đã cập nhật trạng thái'); refetch() }
        } catch { toast.error('Có lỗi xảy ra') }
    }

    const allOrders = ordersResponse?.data || []

    const getOrders = (status: string) => {
        let list = allOrders.filter(o => o.status === status)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            list = list.filter(o => String(o.id).includes(q) || (o as any).customer?.name?.toLowerCase().includes(q) || (o as any).customer?.phone?.includes(q))
        }
        return list
    }

    const isSaleAdmin = profile?.role === 'sale_admin'

    if (isLoading || !user || !profile) return (
        <div className="bg-[#f0f9ff] min-h-screen"><div className="pt-24 pb-20 px-4"><OrdersLoading /></div></div>
    )

    return (
        <div className="bg-[#f0f9ff] min-h-screen">
            {/* Fixed Header */}
            <div className={cn("fixed top-0 left-0 right-0 z-50 bg-[#f0f9ff] transition-transform duration-300", isHeaderVisible ? "translate-y-0" : "-translate-y-full")}>
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <img src="/appejv-logo.png" alt="APPE JV" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <NotificationModal user={user} role={profile.role} />
                        <HeaderMenu user={user} role={profile.role} />
                    </div>
                </div>
            </div>

            {/* Sticky Controls */}
            <div className={cn("sticky left-0 right-0 z-40 bg-[#f0f9ff] px-4 pb-3 pt-2 transition-all duration-300", !isHeaderVisible ? "top-0" : "top-20")}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{isSaleAdmin ? 'Đơn hàng nhóm' : 'Đơn hàng của tôi'}</h1>
                        <p className="text-sm text-gray-600">Quản lý và theo dõi tiến độ đơn hàng</p>
                    </div>
                    <Link href="/sales/selling">
                        <Button size="sm" className="bg-[#175ead] hover:bg-blue-600 rounded-full w-10 h-10 p-0"><Plus className="w-5 h-5" /></Button>
                    </Link>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 border border-gray-200 mb-3">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent"
                        placeholder="Tìm theo mã đơn, tên, SĐT khách..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-gray-400" /></button>}
                </div>

                {/* Scope Tabs */}
                {isSaleAdmin && (
                    <div className="flex gap-2 mb-3">
                        {[{ id: 'my', label: 'Của tôi' }, { id: 'team', label: 'Team' }].map(t => (
                            <button key={t.id} onClick={() => setScopeTab(t.id as 'my' | 'team')}
                                className={cn("flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors",
                                    scopeTab === t.id ? "bg-[#175ead] text-white border-[#175ead]" : "bg-white text-gray-600 border-gray-200")}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {TABS.map(tab => {
                        const count = allOrders.filter(o => o.status === tab.id).length
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={cn("px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors",
                                    activeTab === tab.id ? "bg-[#175ead] text-white" : "bg-white text-gray-600 border border-gray-200")}>
                                {tab.label}{count > 0 ? ` (${count})` : ''}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Orders */}
            <div className="pt-56 pb-20 px-4 flex flex-col gap-3">
                {getOrders(activeTab).length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <ShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                        <p className="font-medium text-sm">{searchQuery ? `Không tìm thấy "${searchQuery}"` : 'Không có đơn hàng nào.'}</p>
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="mt-3 text-sm text-[#175ead] font-medium">Xóa tìm kiếm</button>}
                    </div>
                ) : getOrders(activeTab).map(order => {
                    const cfg = STATUS[order.status] || STATUS.draft
                    const next = NEXT[order.status]
                    return (
                        <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2.5 bg-blue-50 rounded-xl flex-shrink-0">
                                        <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">Đơn hàng #{order.id}</h3>
                                            <Badge className={cn("text-[10px] px-1.5 py-0.5 border-none flex-shrink-0", cfg.cls)}>{cfg.label}</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                        {(order as any).customer?.name && <p className="text-xs text-gray-500">{(order as any).customer.name}</p>}
                                    </div>
                                </div>
                                <div className="text-base font-bold text-gray-900 flex-shrink-0">{formatCurrency(order.total_amount)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/sales/orders/${order.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full text-xs h-8">Chi tiết</Button>
                                </Link>
                                {next && (
                                    <Button size="sm" className={cn("flex-1 text-xs h-8", next.cls)}
                                        onClick={() => handleUpdateStatus(order.id, next.status)}
                                        disabled={updateOrder.isPending}>
                                        {next.label}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
