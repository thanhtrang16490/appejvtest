'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, ChevronRight, Phone, MapPin, Users } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { CustomerListActions } from '@/components/sales/CustomerListActions'
import { CustomersLoading } from '@/components/loading/CustomersLoading'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'

// Generate consistent color based on name
const getAvatarColor = (name: string) => {
    const colors = [
        { bg: 'bg-blue-500', text: 'text-white' },
        { bg: 'bg-emerald-500', text: 'text-white' },
        { bg: 'bg-purple-500', text: 'text-white' },
        { bg: 'bg-amber-500', text: 'text-white' },
        { bg: 'bg-rose-500', text: 'text-white' },
        { bg: 'bg-cyan-500', text: 'text-white' },
        { bg: 'bg-indigo-500', text: 'text-white' },
        { bg: 'bg-pink-500', text: 'text-white' },
        { bg: 'bg-teal-500', text: 'text-white' },
        { bg: 'bg-orange-500', text: 'text-white' },
    ]
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
}

export default function SalesCustomersPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [customers, setCustomers] = useState<any[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

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

            const userRole = (profileData as any).role
            const isSale = userRole === 'sale'
            const isSaleAdmin = userRole === 'sale_admin'
            const isAdmin = userRole === 'admin'

            // For Sale Admin, fetch managed sales IDs
            let managedSaleIds: string[] = []
            if (isSaleAdmin) {
                const { data: managedSales } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('manager_id', user.id)
                managedSaleIds = managedSales?.map(s => (s as any).id) || []
            }

            // Fetch customers based on role
            let query = supabase
                .from('customers')
                .select('*')
                .is('deleted_at', null) // Filter out soft-deleted customers

            if (isAdmin) {
                // Admin sees all customers
                console.log('Admin user - fetching all customers')
            } else if (isSale) {
                // Sale sees only their assigned customers
                query = query.eq('assigned_sale', user.id)
                console.log('Sale user - filtering by assigned_sale:', user.id)
            } else if (isSaleAdmin) {
                // Sale Admin sees their customers + managed team's customers
                query = query.in('assigned_sale', [user.id, ...managedSaleIds])
                console.log('Sale Admin - filtering by assigned_sales:', [user.id, ...managedSaleIds])
            }

            const { data: customersData } = await query.order('name')
            console.log('Fetched customers count:', customersData?.length || 0)

            setCustomers(customersData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="pt-24 pb-20 px-4">
                    <CustomersLoading />
                </div>
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

    const userRole = (profile as any).role
    const isAdmin = userRole === 'admin'
    const canCreateCustomer = ['admin', 'sale', 'sale_admin'].includes(userRole)

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
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>
            </div>

            {/* Sticky Search and Title */}
            <div className={cn(
                "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2 pt-2 transition-all duration-300",
                !isHeaderVisible ? "top-0" : "top-20"
            )}>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
                            <p className="text-sm text-gray-600">
                                {filteredCustomers.length} khách hàng
                            </p>
                        </div>
                        <CustomerListActions canCreate={canCreateCustomer} isAdmin={isAdmin} onCustomerCreated={fetchData} />
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm khách hàng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-white pl-10 border-none shadow-sm rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-44 pb-20">
                <div className="p-4">
                    <div className="grid gap-2">
                        {filteredCustomers.map((customer) => {
                            const avatarColor = getAvatarColor(customer.name)
                            const initials = customer.name.substring(0, 2).toUpperCase()
                            
                            return (
                                <Link key={customer.id} href={`/sales/customers/${customer.id}`}>
                                    <Card className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-all active:scale-[0.99]">
                                        <CardContent className="py-2 px-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-11 w-11 flex-shrink-0">
                                                    {customer.avatar_url ? (
                                                        <AvatarImage src={customer.avatar_url} alt={customer.name} />
                                                    ) : null}
                                                    <AvatarFallback className={cn("font-bold text-sm", avatarColor.bg, avatarColor.text)}>
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-sm text-gray-900 truncate">
                                                            {customer.name}
                                                        </h3>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                            {customer.code}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                <span className="font-medium">{customer.phone}</span>
                                                            </div>
                                                        )}
                                                        {customer.address && (
                                                            <div className="flex items-center gap-1 truncate">
                                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">{customer.address}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                        
                        {filteredCustomers.length === 0 && !loading && (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl shadow-sm">
                                <Users className="w-12 h-12 mb-4 opacity-30" />
                                <p className="font-medium">
                                    {searchQuery ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
                                </p>
                                {searchQuery && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-3 rounded-full"
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
