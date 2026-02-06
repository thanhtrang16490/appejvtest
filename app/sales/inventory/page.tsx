'use client'

import { createClient } from '@/lib/supabase/client'
import { InventoryTable } from '@/components/sales/InventoryTable'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database.types'
import { Sparkles, Menu, Bell } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InventoryPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [products, setProducts] = useState<Database['public']['Tables']['products']['Row'][]>([])
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
        fetchData()
    }, [])

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

            // Fetch profile
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

            // Fetch products
            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .order('name')

            setProducts(productsData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
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

    const isAdmin = profile.role === 'admin'

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
                    <div className="flex items-center gap-2">
                        <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white rounded-full px-4 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Trợ lý AI
                        </Button>
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>

                {/* Page Title */}
                <div className="px-4 pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Kho hàng</h1>
                            <p className="text-sm text-gray-600">
                                {products.length} sản phẩm
                                {isAdmin && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        ADMIN
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-32 pb-20">
                <div className="p-4">
                    <InventoryTable 
                        initialProducts={products} 
                        isAdmin={isAdmin}
                    />
                </div>
            </div>
        </div>
    )
}
