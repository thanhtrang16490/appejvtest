'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, ChevronRight, User, Phone, MapPin, Users, Plus, Sparkles, Menu, Bell } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { CustomerListActions } from '@/components/sales/CustomerListActions'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SalesCustomersPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [customers, setCustomers] = useState<any[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
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

    useEffect(() => {
        // Filter customers based on search query
        if (searchQuery.trim() === '') {
            setFilteredCustomers(customers)
        } else {
            const filtered = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone?.includes(searchQuery) ||
                customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredCustomers(filtered)
        }
    }, [searchQuery, customers])

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

            // Fetch customers
            const { data: customersData } = await supabase
                .from('customers')
                .select('*')
                .order('name')

            setCustomers(customersData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user || !profile) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
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
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-50 to-blue-50 transition-transform duration-300",
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
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-4 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Trợ lý AI
                        </Button>
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>
            </div>

            {/* Fixed Search and Title */}
            <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-br from-purple-50 to-blue-50 px-4 pb-2">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
                            <p className="text-sm text-gray-600">
                                {filteredCustomers.length} khách hàng
                            </p>
                        </div>
                        <CustomerListActions isAdmin={isAdmin} />
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm khách hàng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white pl-10 rounded-full border-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-44 pb-20">
                <div className="p-4">
                    <div className="grid gap-4">
                        {filteredCustomers.map((customer) => (
                            <Link key={customer.id} href={`/sales/customers/${customer.id}`}>
                                <Card className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-all active:scale-[0.99]">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-4 p-4">
                                            <Avatar className="h-12 w-12 border-2 border-gray-100">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=f8fafc,f1f5f9,e2e8f0`} />
                                                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                                                    {customer.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {customer.code}
                                                    </span>
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {customer.name}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{customer.phone || '---'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 truncate">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{customer.address || 'Chưa có địa chỉ'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2 rounded-full bg-gray-50">
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                        
                        {filteredCustomers.length === 0 && !loading && (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                                <Users className="w-12 h-12 mb-4 opacity-30" />
                                <p className="font-medium">
                                    {searchQuery ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
                                </p>
                                {searchQuery && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-2"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
