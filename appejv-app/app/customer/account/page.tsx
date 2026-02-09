'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, LogOut, MapPin, Phone, Sparkles, Settings, CreditCard, Bell, HelpCircle } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { EditProfileSheet } from '@/components/account/EditProfileSheet'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const menuItems = [
    { icon: Settings, label: 'Cài đặt tài khoản', href: '#' },
    { icon: CreditCard, label: 'Phương thức thanh toán', href: '#' },
    { icon: Bell, label: 'Thông báo', href: '#' },
    { icon: HelpCircle, label: 'Trợ giúp & Hỗ trợ', href: '#' },
]

export default function AccountPage() {
    const [user, setUser] = useState<any>(null)
    const [customer, setCustomer] = useState<any>(null)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
    const [avatarKey, setAvatarKey] = useState(Date.now()) // For cache busting
    const router = useRouter()

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
                router.push('/auth/customer-login')
                return
            }

            setUser(user)

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

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
                    <Button onClick={() => router.push('/auth/customer-login')}>
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
                {/* Logo and AI Assistant Row */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white rounded-full px-4 py-2 text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Trợ lý AI
                    </Button>
                </div>

                {/* Page Title */}
                <div className="px-4 pb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Tài khoản</h1>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-28 pb-20">
                <div className="p-4 flex flex-col gap-6">
                    {/* Profile Card */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <Avatar className="h-16 w-16 border-2 border-gray-100">
                                <AvatarImage 
                                    src={customer?.avatar_url ? `${customer.avatar_url}?v=${avatarKey}` : undefined} 
                                    alt={customer?.name || 'Avatar'} 
                                />
                                <AvatarFallback className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-2xl font-bold text-white">
                                    {customer?.name?.[0] || user.phone?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-xl text-gray-900">
                                    {customer?.name || 'Người dùng'}
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    {user.phone}
                                </CardDescription>
                            </div>
                            <EditProfileSheet
                                currentName={customer?.name || ''}
                                currentAddress={customer?.address || ''}
                                currentAvatar={customer?.avatar_url}
                                onSuccess={fetchUserData}
                            />
                        </CardHeader>
                        <CardContent className="grid gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-600">Mã KH:</span>
                                <span className="text-gray-900">{customer?.code || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-600">Điện thoại:</span>
                                <span className="text-gray-900">{customer?.phone || user.phone}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <span className="font-medium text-gray-600">Địa chỉ:</span>
                                <span className="flex-1 text-gray-900">
                                    {customer?.address || 'Chưa cập nhật địa chỉ'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Menu Items */}
                    <div className="grid gap-3">
                        {menuItems.map((item, index) => (
                            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <item.icon className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <span className="flex-1 font-medium text-gray-900">
                                            {item.label}
                                        </span>
                                        <div className="w-5 h-5 text-gray-400">
                                            →
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <Button 
                                variant="destructive" 
                                className="w-full bg-red-500 hover:bg-red-600 rounded-full"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Footer Info */}
                    <div className="text-center text-xs text-gray-400 mt-4">
                        <p>Đăng nhập với {user.phone}</p>
                        <p className="mt-1">Phiên bản 1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
