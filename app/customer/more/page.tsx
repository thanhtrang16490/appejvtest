'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
    Settings, 
    HelpCircle, 
    Shield, 
    Bell, 
    CreditCard,
    LogOut,
    Sparkles,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/auth/actions'

const menuSections = [
    {
        title: 'Cài đặt',
        items: [
            {
                icon: Settings,
                label: 'Cài đặt tài khoản',
                href: '/customer/account',
                color: 'text-gray-600'
            },
            {
                icon: Bell,
                label: 'Thông báo',
                href: '#',
                color: 'text-gray-600'
            },
            {
                icon: CreditCard,
                label: 'Phương thức thanh toán',
                href: '#',
                color: 'text-gray-600'
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
                color: 'text-gray-600'
            },
            {
                icon: Shield,
                label: 'Chính sách bảo mật',
                href: '#',
                color: 'text-gray-600'
            }
        ]
    }
]

export default function MorePage() {
    const [user, setUser] = useState<any>(null)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
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
            setUser(user)
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

    const MenuSection = ({ title, items }: { title: string, items: any[] }) => (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 px-2">{title}</h3>
            <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-0">
                    {items.map((item, index) => (
                        <div key={index}>
                            <button 
                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                onClick={() => item.href !== '#' && router.push(item.href)}
                            >
                                <div className={cn("p-2 rounded-full bg-gray-50", item.color)}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-gray-900">{item.label}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                            {index < items.length - 1 && (
                                <div className="border-t border-gray-100 mx-4" />
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
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
                    <h1 className="text-2xl font-bold text-gray-900">Nhiều hơn</h1>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-28 pb-20">
                <div className="p-4 flex flex-col gap-6">
                    {/* Menu Sections */}
                    {menuSections.map((section, index) => (
                        <MenuSection key={index} title={section.title} items={section.items} />
                    ))}

                    {/* Logout Button */}
                    {user && (
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
                    )}

                    {/* Footer Info */}
                    <div className="text-center text-xs text-gray-400 mt-4">
                        <p>APPE JV - Phiên bản 1.2.0</p>
                        {user && (
                            <p className="mt-1">Đăng nhập với {user.phone}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}