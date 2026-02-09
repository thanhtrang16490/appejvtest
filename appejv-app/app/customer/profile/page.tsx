'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
    User, 
    QrCode, 
    Star, 
    Plus, 
    Shield, 
    Phone, 
    ChevronRight,
    Sparkles 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HeaderMenu } from '@/components/layout/HeaderMenu'

const profileMenuItems = [
    {
        icon: User,
        label: 'Chủ quán Thanh Trang',
        subtitle: '',
        hasArrow: true,
        color: 'text-[#175ead]'
    },
    {
        icon: QrCode,
        label: 'Quét QR để vào quán khác',
        subtitle: '',
        hasArrow: true,
        color: 'text-[#175ead]'
    }
]

const referralItems = [
    {
        icon: Star,
        label: 'Gói cơ bản',
        subtitle: 'Còn 299 lượt tạo đơn',
        hasArrow: true,
        color: 'text-gray-600'
    }
]

const managementItems = [
    {
        icon: QrCode,
        label: 'Thêm QR để bật loa báo tíng tíng',
        subtitle: '',
        hasArrow: false,
        color: 'text-[#175ead]'
    },
    {
        icon: Plus,
        label: 'Thêm nhân viên',
        subtitle: '',
        hasArrow: true,
        color: 'text-[#175ead]'
    },
    {
        icon: Shield,
        label: 'Quản lý dữ liệu',
        subtitle: '',
        hasArrow: true,
        color: 'text-gray-600'
    }
]

const supportItems = [
    {
        icon: Phone,
        label: 'Gọi tổng đài',
        subtitle: '1900 4512',
        hasArrow: false,
        color: 'text-[#175ead]'
    }
]

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [customer, setCustomer] = useState<any>(null)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
    const [avatarKey, setAvatarKey] = useState(Date.now()) // For cache busting
    const [role, setRole] = useState('customer')
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 50) {
                    setIsHeaderVisible(false)
                } else {
                    setIsHeaderVisible(true)
                }
                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader)
            return () => {
                window.removeEventListener('scroll', controlHeader)
            }
        }
    }, [lastScrollY])

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

            // Fetch role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            if (profile && (profile as any).role) {
                setRole((profile as any).role)
            }

            // Fetch customer details
            const { data: customerData } = await supabase
                .from('customers')
                .select('*')
                .eq('phone', user.phone as string)
                .single()

            setCustomer(customerData)
            setAvatarKey(Date.now()) // Update avatar key to bust cache
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
                    <Button onClick={() => router.push('/auth/login')}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        )
    }

    const MenuSection = ({ items, className = "" }: { items: any[], className?: string }) => (
        <Card className={cn("bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border-0", className)}>
            <CardContent className="p-0">
                {items.map((item, index) => (
                    <div key={index}>
                        <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-all active:scale-[0.98]">
                            <div className={cn("p-3 rounded-full bg-gray-50", item.color)}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="font-semibold text-gray-900 text-base">{item.label}</p>
                                {item.subtitle && (
                                    <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                                )}
                            </div>
                            {item.hasArrow && (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        {index < items.length - 1 && (
                            <div className="border-t border-gray-100/50 mx-5" />
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )

    return (
        <div className="bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 min-h-screen relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute top-40 right-10 w-24 h-24 bg-blue-300/30 rounded-full blur-lg"></div>
                <div className="absolute bottom-40 left-20 w-28 h-28 bg-pink-300/20 rounded-full blur-xl"></div>
            </div>

            {/* Fixed Header - Only show logo when scrolled */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-200/90 via-pink-100/90 to-blue-200/90 backdrop-blur-sm transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV Logo" 
                            className="w-10 h-10 object-contain"
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
                        {mounted && <HeaderMenu user={user} role={role} />}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-20 pb-20 relative z-10">
                <div className="p-4 flex flex-col gap-6">
                    {/* Profile Header */}
                    <div className="text-center pt-8 pb-4">
                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-xl">
                            <AvatarImage 
                                src={customer?.avatar_url ? `${customer.avatar_url}?v=${avatarKey}` : undefined} 
                                alt={customer?.name || 'Avatar'} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                                {customer?.name?.[0] || user.phone?.[0] || 'T'}
                            </AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            {customer?.name || 'Thanh Trang'}
                        </h1>
                        <p className="text-gray-600 font-medium">
                            {user.phone || '0961566633'}
                        </p>
                    </div>

                    {/* Profile Menu Items */}
                    <MenuSection items={profileMenuItems} />

                    {/* Referral Section */}
                    <MenuSection items={referralItems} />

                    {/* Management Items */}
                    <MenuSection items={managementItems} />

                    {/* Support */}
                    <MenuSection items={supportItems} />

                    {/* Version Info */}
                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-500 font-medium">Phiên bản 1.2.0</p>
                    </div>
                </div>
            </div>
        </div>
    )
}