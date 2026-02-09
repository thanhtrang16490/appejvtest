'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, LogOut, MapPin, Phone, Sparkles, Settings, Bell, HelpCircle, ShoppingBag, FileText, Package } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { EditProfileSheet } from '@/components/account/EditProfileSheet'
import { cn, formatCurrency } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import Link from 'next/link'

const menuItems = [
    { icon: FileText, label: 'Đơn hàng của tôi', href: '/customer/orders', description: 'Xem lịch sử đơn hàng' },
    { icon: ShoppingBag, label: 'Sản phẩm', href: '/customer/products', description: 'Danh sách sản phẩm' },
    { icon: Bell, label: 'Thông báo', href: '#', description: 'Thông báo và ưu đãi' },
    { icon: HelpCircle, label: 'Trợ giúp & Hỗ trợ', href: '#', description: 'Liên hệ hỗ trợ' },
]

export default function AccountPage() {
    const [user, setUser] = useState<any>(null)
    const [customer, setCustomer] = useState<any>(null)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
    const [avatarKey, setAvatarKey] = useState(Date.now()) // For cache busting
    const [role, setRole] = useState('customer')
    const [mounted, setMounted] = useState(false)
    const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, completed: 0, totalSpent: 0 })
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
        fetchOrderStats()
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

    const fetchOrderStats = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user || !user.phone) return

            // Get customer ID
            const { data: customerData } = await supabase
                .from('customers')
                .select('id')
                .eq('phone', user.phone)
                .single()

            if (!customerData) return

            const customerId = (customerData as any).id

            // Fetch all orders
            const { data: orders } = await supabase
                .from('orders')
                .select('status, total_amount')
                .eq('customer_id', customerId)

            if (orders && orders.length > 0) {
                const stats = {
                    total: orders.length,
                    pending: orders.filter((o: any) => o.status === 'pending').length,
                    completed: orders.filter((o: any) => o.status === 'completed').length,
                    totalSpent: orders.reduce((sum: number, o: any) => sum + o.total_amount, 0)
                }
                setOrderStats(stats)
            }
        } catch (error) {
            console.error('Error fetching order stats:', error)
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
                {/* Logo and AI Assistant Row */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    {mounted && (
                        <div className="flex items-center gap-2">
                            <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white rounded-full px-4 py-2 text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4 mr-1" />
                                Trợ lý AI
                            </Button>
                            <HeaderMenu user={user} role={role} />
                        </div>
                    )}
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

                    {/* Order Statistics */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-white rounded-2xl shadow-sm border-0">
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-1">Tổng đơn hàng</span>
                                    <span className="text-2xl font-bold text-gray-900">{orderStats.total}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-2xl shadow-sm border-0">
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-1">Đang xử lý</span>
                                    <span className="text-2xl font-bold text-orange-500">{orderStats.pending}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-2xl shadow-sm border-0">
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-1">Hoàn thành</span>
                                    <span className="text-2xl font-bold text-green-500">{orderStats.completed}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-2xl shadow-sm border-0">
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-1">Tổng chi tiêu</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {formatCurrency(orderStats.totalSpent)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Menu Items */}
                    <div className="grid gap-3">
                        {menuItems.map((item, index) => (
                            <Link key={index} href={item.href}>
                                <Card className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <item.icon className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{item.label}</div>
                                                <div className="text-xs text-gray-500">{item.description}</div>
                                            </div>
                                            <div className="w-5 h-5 text-gray-400">
                                                →
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
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
