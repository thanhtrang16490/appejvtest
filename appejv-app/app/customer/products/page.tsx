'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, cn } from '@/lib/utils'
import { Search, Sparkles, ShoppingCart, Package } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import Image from 'next/image'

interface Product {
    id: number
    code: string
    name: string
    slug: string
    unit: string
    stock: number
    price: number
    category: string
    image_url?: string
    description?: string
}

export default function CustomerProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState('customer')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetchUserData()
        fetchProducts()
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
        filterProducts()
    }, [searchQuery, selectedCategory, products])

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

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name')

            if (error) throw error

            setProducts(data || [])
            
            // Extract unique categories
            const uniqueCategories = Array.from(new Set(data?.map((p: any) => p.category).filter(Boolean))) as string[]
            setCategories(uniqueCategories)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterProducts = () => {
        let filtered = products

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory)
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredProducts(filtered)
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-blue-50 to-cyan-50 transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
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

                {/* Search Bar */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 bg-white border-gray-200 rounded-xl"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="px-4 pb-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Button
                            variant={selectedCategory === 'all' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className={cn(
                                "rounded-full whitespace-nowrap text-sm font-medium",
                                selectedCategory === 'all'
                                    ? "bg-[#175ead] text-white"
                                    : "bg-white text-gray-600 border-gray-200"
                            )}
                        >
                            Tất cả
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    "rounded-full whitespace-nowrap text-sm font-medium",
                                    selectedCategory === category
                                        ? "bg-[#175ead] text-white"
                                        : "bg-white text-gray-600 border-gray-200"
                                )}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-56 pb-20">
                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Đang tải...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                                    <CardContent className="p-0">
                                        {/* Product Image */}
                                        <div className="relative w-full h-32 bg-gray-100">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Package className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            {product.stock <= 10 && (
                                                <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                                                    Sắp hết
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-3">
                                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-2">
                                                {product.code} • {product.category}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-base font-bold text-[#175ead]">
                                                        {formatCurrency(product.price)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        /{product.unit}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#175ead] hover:bg-[#145a9d] text-white rounded-full w-8 h-8 p-0"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
