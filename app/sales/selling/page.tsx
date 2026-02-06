'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ShoppingCart, Plus, Search, Package, Sparkles, Menu, Bell, Minus } from 'lucide-react'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { cn, formatCurrency } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SellingPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [cart, setCart] = useState<any[]>([])
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'electronics', name: 'Điện tử' },
        { id: 'clothing', name: 'Thời trang' },
        { id: 'food', name: 'Thực phẩm' },
        { id: 'books', name: 'Sách' },
        { id: 'home', name: 'Gia dụng' },
    ]

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
        filterProducts()
    }, [products, searchTerm, selectedCategory])

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

            // Verify role
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
                .gt('stock', 0)
                .order('name')

            setProducts(productsData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterProducts = () => {
        let filtered = products

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory)
        }

        setFilteredProducts(filtered)
    }

    const addToCart = (product: any) => {
        const existingItem = cart.find(item => item.id === product.id)
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                    : item
            ))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const removeFromCart = (productId: string) => {
        const existingItem = cart.find(item => item.id === productId)
        if (existingItem && existingItem.quantity > 1) {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ))
        } else {
            setCart(cart.filter(item => item.id !== productId))
        }
    }

    const getCartItemQuantity = (productId: string) => {
        const item = cart.find(item => item.id === productId)
        return item ? item.quantity : 0
    }

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
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
                        <Button 
                            size="sm" 
                            variant="ghost"
                            className="w-10 h-10 p-0 rounded-full hover:bg-white/20 relative"
                        >
                            <Bell className="w-5 h-5 text-gray-700" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                3
                            </span>
                        </Button>
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>

                {/* Page Title and Search */}
                <div className="px-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Bán hàng</h1>
                            <p className="text-sm text-gray-600">
                                {filteredProducts.length} sản phẩm có sẵn
                            </p>
                        </div>
                        <div className="relative">
                            <Button 
                                className="bg-[#175ead] text-white rounded-full px-4 py-2 relative"
                                onClick={() => {/* TODO: Open cart */}}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Giỏ hàng
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white border-gray-200 rounded-xl"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    "rounded-full whitespace-nowrap text-sm font-medium",
                                    selectedCategory === category.id 
                                        ? "bg-[#175ead] text-white" 
                                        : "bg-white text-gray-600 border-gray-200"
                                )}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-56 pb-20">
                <div className="p-4">
                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map((product) => {
                            const cartQuantity = getCartItemQuantity(product.id)
                            return (
                                <Card key={product.id} className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                                    <div className="aspect-square bg-gray-100 relative">
                                        {product.image_url ? (
                                            <img 
                                                src={product.image_url} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        <Badge 
                                            variant="secondary" 
                                            className="absolute top-2 right-2 bg-white/90 text-gray-700"
                                        >
                                            Còn {product.stock}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-3">
                                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-lg font-bold text-blue-600 mb-2">
                                            {formatCurrency(product.price)}
                                        </p>
                                        
                                        {cartQuantity > 0 ? (
                                            <div className="flex items-center justify-between">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-8 h-8 p-0 rounded-full"
                                                    onClick={() => removeFromCart(product.id)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="font-semibold text-gray-900">
                                                    {cartQuantity}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    className="w-8 h-8 p-0 rounded-full bg-[#175ead] text-white"
                                                    onClick={() => addToCart(product)}
                                                    disabled={cartQuantity >= product.stock}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="w-full bg-[#175ead] text-white rounded-xl"
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Thêm
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
                <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-lg border p-4 z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">{getTotalItems()} sản phẩm</p>
                            <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(getTotalAmount())}
                            </p>
                        </div>
                        <Button className="bg-[#175ead] text-white rounded-xl px-6">
                            Thanh toán
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}