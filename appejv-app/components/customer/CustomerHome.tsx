'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Lock, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { HeaderMenu } from '@/components/layout/HeaderMenu'

const filterTabs = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'thisMonth', label: 'Tháng này' },
    { id: 'other', label: 'Khác' },
]

interface BestSellingProduct {
    product_id: number
    product_name: string
    total_quantity: number
    total_revenue: number
}

interface CustomerHomeProps {
    initialUser?: any
    initialRole?: string
}

export function CustomerHome({ initialUser, initialRole }: CustomerHomeProps) {
    const [activeFilter, setActiveFilter] = useState('thisMonth')
    const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([])
    const [totalOrders, setTotalOrders] = useState(0)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [user, setUser] = useState<any>(initialUser || null)
    const [role, setRole] = useState(initialRole || 'customer')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        // Only fetch if we don't have initial data
        if (!initialUser) {
            fetchUserData()
        }
        fetchData()
    }, [activeFilter, initialUser])

    const fetchUserData = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            if (profile && (profile as any).role) {
                setRole((profile as any).role)
            }
        }
    }

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 50) {
                    // Scrolling down & past threshold
                    setIsHeaderVisible(false)
                } else {
                    // Scrolling up
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

    const getDateRange = () => {
        const now = new Date()
        let startDate: Date
        let endDate: Date = new Date()

        switch (activeFilter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                break
            case 'yesterday':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                break
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
                break
            default:
                startDate = new Date(0)
                endDate = new Date()
        }

        return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { startDate, endDate } = getDateRange()

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user || !user.phone) {
                setLoading(false)
                return
            }

            // Get customer ID from phone
            const { data: customerData } = await supabase
                .from('customers')
                .select('id')
                .eq('phone', user.phone)
                .single()

            if (!customerData) {
                setLoading(false)
                return
            }

            const customerId = (customerData as any).id

            // Fetch orders count and total revenue for THIS customer only
            const { data: ordersData } = await supabase
                .from('orders')
                .select('id, total_amount')
                .eq('customer_id', customerId)
                .gte('created_at', startDate)
                .lt('created_at', endDate)

            setTotalOrders(ordersData?.length || 0)
            setTotalRevenue(ordersData?.reduce((sum, order: any) => sum + order.total_amount, 0) || 0)

            // Get order IDs for this customer
            const orderIds = ordersData?.map((order: any) => order.id) || []

            if (orderIds.length === 0) {
                setBestSellingProducts([])
                setLoading(false)
                return
            }

            // Fetch best selling products for THIS customer's orders only
            const { data: bestSellingData } = await supabase
                .from('order_items')
                .select(`
                    product_id,
                    quantity,
                    price_at_order,
                    order_id,
                    products!inner(name)
                `)
                .in('order_id', orderIds)

            if (bestSellingData) {
                // Group by product and calculate totals
                const productMap = new Map<number, BestSellingProduct>()
                
                bestSellingData.forEach((item: any) => {
                    const productId = item.product_id
                    const existing = productMap.get(productId)
                    
                    if (existing) {
                        existing.total_quantity += item.quantity
                        existing.total_revenue += item.quantity * item.price_at_order
                    } else {
                        productMap.set(productId, {
                            product_id: productId,
                            product_name: item.products.name,
                            total_quantity: item.quantity,
                            total_revenue: item.quantity * item.price_at_order
                        })
                    }
                })

                // Sort by quantity and take top 5
                const sortedProducts = Array.from(productMap.values())
                    .sort((a, b) => b.total_quantity - a.total_quantity)
                    .slice(0, 5)

                setBestSellingProducts(sortedProducts)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount) + ' VNĐ'
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
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV Logo" 
                            className="w-10 h-10 object-contain"
                        />
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
                            {user && <HeaderMenu user={user} role={role} />}
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Filter Tabs */}
            <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto">
                    {filterTabs.map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeFilter === tab.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter(tab.id)}
                            className={cn(
                                "rounded-full whitespace-nowrap text-sm font-medium",
                                activeFilter === tab.id 
                                    ? "bg-[#175ead] text-white" 
                                    : "bg-white text-gray-600 border-gray-200"
                            )}
                        >
                            {tab.label}
                            {tab.id === 'other' && <ChevronDown className="w-4 h-4 ml-1" />}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-32 pb-20">
                <div className="flex flex-col gap-4 p-4">
                    {/* Orders Card */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-500 text-sm font-medium mb-1">
                                        Đơn hàng
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900">{totalOrders}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spending Chart */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng chi tiêu</h3>
                            <div className="h-32 flex items-end justify-center">
                                <div className="text-gray-900 text-lg font-semibold">
                                    {formatCurrency(totalRevenue)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="w-2 h-2 bg-[#175ead] rounded-full"></div>
                                <span className="text-xs text-gray-500">
                                    {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spending Summary */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Chi tiêu tháng này</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(totalRevenue)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Most Purchased Products */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm mua nhiều nhất</h3>
                            {loading ? (
                                <div className="text-center py-4 text-gray-500">Đang tải...</div>
                            ) : bestSellingProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {bestSellingProducts.map((product, index) => (
                                        <div key={product.product_id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-900 font-medium">{index + 1}</span>
                                                <span className="text-gray-700">{product.product_name}</span>
                                            </div>
                                            <span className="text-gray-600">x{product.total_quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>Tổng số lượng đã mua</span>
                                            <span>
                                                {bestSellingProducts.reduce((sum, product) => sum + product.total_quantity, 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Chưa có đơn hàng nào
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
