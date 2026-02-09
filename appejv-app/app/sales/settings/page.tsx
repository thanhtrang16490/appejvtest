'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
    Settings, 
    HelpCircle, 
    Shield, 
    Bell, 
    User,
    LogOut,
    Sparkles,
    ChevronRight,
    FileText,
    Users
} from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { logout } from '@/app/auth/actions'

const menuSections = [
    {
        title: 'Cài đặt',
        items: [
            {
                icon: User,
                label: 'Thông tin cá nhân',
                href: '/profile',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
            },
            {
                icon: Bell,
                label: 'Thông báo',
                href: '#',
                color: 'text-amber-600',
                bgColor: 'bg-amber-50'
            },
            {
                icon: Settings,
                label: 'Cài đặt hệ thống',
                href: '#',
                color: 'text-gray-600',
                bgColor: 'bg-gray-50'
            }
        ]
    },
    {
        title: 'Quản lý',
        items: [
            {
                icon: Users,
                label: 'Quản lý người dùng',
                href: '/sales/users',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                adminOnly: true
            },
            {
                icon: FileText,
                label: 'Báo cáo',
                href: '/sales/reports',
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50'
            }
        ]
    },
    {
        title: 'Hỗ trợ',
        items: [
            {
                icon: HelpCircle,
                label: 'Trợ giúp & Hỗ trợ',
                href: '#',
                color: 'text-cyan-600',
                bgColor: 'bg-cyan-50'
            },
            {
                icon: Shield,
                label: 'Chính sách bảo mật',
                href: '#',
                color: 'text-rose-600',
                bgColor: 'bg-rose-50'
            }
        ]
    }
]

export default function SalesSettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
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
                .select('role, full_name')
                .eq('id', user.id)
                .single()

            if (!profileData || !['sale', 'admin', 'sale_admin'].includes((profileData as any).role)) {
                router.push('/')
                return
            }

            setProfile(profileData)
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) return
        
        try {
            await logout()
            router.push('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    const MenuSection = ({ title, items }: { title: string, items: any[] }) => {
        const isAdmin = profile?.role === 'admin'
        const filteredItems = items.filter(item => !item.adminOnly || isAdmin)

        if (filteredItems.length === 0) return null

        return (
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-500 px-2 uppercase tracking-wider">{title}</h3>
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                    <CardContent className="p-0">
                        {filteredItems.map((item, index) => (
                            <div key={index}>
                                <button 
                                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                    onClick={() => item.href !== '#' && router.push(item.href)}
                                >
                                    <div className={cn("p-2.5 rounded-xl", item.bgColor)}>
                                        <item.icon className={cn("w-5 h-5", item.color)} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-gray-900">{item.label}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                                {index < filteredItems.length - 1 && (
                                    <div className="border-t border-gray-100 mx-4" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
                    <p className="text-sm text-gray-600">
                        {profile.full_name || user.email}
                        {profile.role === 'admin' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                ADMIN
                            </span>
                        )}
                        {profile.role === 'sale_admin' && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                SALE ADMIN
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-44 pb-20">
                <div className="p-4 flex flex-col gap-6">
                    {/* Menu Sections */}
                    {menuSections.map((section, index) => (
                        <MenuSection key={index} title={section.title} items={section.items} />
                    ))}

                    {/* Logout Button */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <Button 
                                variant="destructive" 
                                className="w-full bg-red-500 hover:bg-red-600 rounded-full font-bold"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Đăng xuất
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Footer Info */}
                    <div className="text-center text-xs text-gray-400 mt-4">
                        <p className="font-semibold">APPE JV Sales - Phiên bản 1.2.0</p>
                        <p className="mt-1">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
