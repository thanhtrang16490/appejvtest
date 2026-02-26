'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogOut, Settings, Package, BarChart3, Users, FileText, Building2, ChevronRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'

export default function MenuPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const sb = createClient()
            const { data: { user } } = await sb.auth.getUser()
            if (!user) { router.push('/auth/login'); return }
            setUser(user)
            const { data: pd } = await sb.from('profiles').select('role, full_name, email').eq('id', user.id).single()
            setProfile(pd)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const handleLogout = async () => {
        const sb = createClient()
        await sb.auth.signOut()
        router.push('/auth/login')
    }

    const isAdmin = profile?.role === 'admin'
    const isSaleAdmin = profile?.role === 'sale_admin'

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Quản trị viên'
            case 'sale_admin': return 'Trưởng phòng kinh doanh'
            case 'sale': return 'Nhân viên bán hàng'
            default: return 'Nhân viên'
        }
    }

    const menuItems = [
        { title: 'Kho hàng', desc: 'Kiểm tra tồn kho và giá bán', icon: Package, href: '/sales/inventory', color: 'bg-amber-50 text-amber-600' },
    ]

    if (isSaleAdmin || isAdmin) {
        menuItems.push({ title: 'Gán khách hàng', desc: 'Phân công khách hàng cho NV', icon: Users, href: '/sales/customers/assign', color: 'bg-emerald-50 text-emerald-600' })
    }

    const adminItems = []
    if (isSaleAdmin) {
        adminItems.push({ title: 'Quản lý Team', desc: 'Xem và quản lý thành viên', icon: Users, href: '/sales/team', color: 'bg-blue-50 text-blue-600' })
    }
    if (isSaleAdmin || isAdmin) {
        adminItems.push(
            { title: 'Phân tích dữ liệu', desc: 'Analytics và insights', icon: BarChart3, href: '/sales/reports', color: 'bg-purple-50 text-purple-600' },
            { title: 'Danh mục sản phẩm', desc: 'Tạo và chỉnh sửa danh mục', icon: Package, href: '/sales/categories', color: 'bg-amber-50 text-amber-600' },
            { title: 'Xuất dữ liệu', desc: 'Export CSV/Excel', icon: FileText, href: '/sales/export', color: 'bg-emerald-50 text-emerald-600' },
            { title: 'Quản lý nhân sự', desc: 'Tài khoản và phân quyền', icon: Users, href: '/sales/users', color: 'bg-red-50 text-red-600' },
        )
    }
    if (isAdmin) {
        adminItems.push({ title: 'Cài đặt hệ thống', desc: 'Cấu hình hệ thống', icon: Settings, href: '/admin/settings', color: 'bg-gray-50 text-gray-600' })
    }

    if (loading) return <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center"><div className="text-gray-500">Đang tải...</div></div>

    return (
        <div className="min-h-screen bg-[#f0f9ff]">
            {/* Header */}
            <div className="bg-[#f0f9ff] p-4 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/appejv-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-gray-900">Menu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {user && profile && (<><NotificationModal user={user} role={profile.role} /><HeaderMenu user={user} role={profile.role} /></>)}
                    </div>
                </div>
            </div>

            <div className="p-4 pb-8 flex flex-col gap-6">
                {/* User Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-7 h-7 text-[#175ead]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gray-900">{profile?.full_name || 'Người dùng'}</h3>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                            <span className="inline-block mt-1 text-xs font-semibold bg-blue-50 text-[#175ead] px-2 py-0.5 rounded-md">
                                {getRoleLabel(profile?.role)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                {menuItems.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Tính năng</h3>
                        <div className="flex flex-col gap-2">
                            {menuItems.map((item, i) => (
                                <Link key={i} href={item.href} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", item.color)}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Admin Tools */}
                {adminItems.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Công cụ quản trị</h3>
                            {(isAdmin || isSaleAdmin) && (
                                <span className="text-[10px] font-bold bg-blue-50 text-[#175ead] px-2 py-0.5 rounded-md">
                                    {isAdmin ? 'ADMIN' : 'SALE ADMIN'}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            {adminItems.map((item, i) => (
                                <Link key={i} href={item.href} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", item.color)}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Logout */}
                <Button onClick={handleLogout} variant="destructive" className="w-full py-6 rounded-xl mt-4">
                    <LogOut className="w-5 h-5 mr-2" />
                    Đăng xuất
                </Button>

                {/* Version */}
                <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest opacity-50">
                    SalesApp v1.0.0
                </p>
            </div>
        </div>
    )
}

