'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
    ChevronLeft, 
    X, 
    Plus, 
    Minus, 
    Grid3x3, 
    Mic,
    ArrowUp
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SellingPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [cart, setCart] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showProductSheet, setShowProductSheet] = useState(false)
    const [activeTab, setActiveTab] = useState<string>('all')
    const [categories, setCategories] = useState<any[]>([])
    const [inputText, setInputText] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [showAddProductSheet, setShowAddProductSheet] = useState(false)
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [customers, setCustomers] = useState<any[]>([])
    const [customerSearchQuery, setCustomerSearchQuery] = useState('')
    const [showCustomerResults, setShowCustomerResults] = useState(false)
    const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([])
    const [isCreatingOrder, setIsCreatingOrder] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (inputText.trim()) {
            searchProducts(inputText)
        } else {
            setSearchResults([])
            setShowSearchResults(false)
        }
    }, [inputText])

    useEffect(() => {
        if (customerSearchQuery.trim()) {
            searchCustomers(customerSearchQuery)
        } else {
            setCustomerSearchResults([])
            setShowCustomerResults(false)
        }
    }, [customerSearchQuery])

    useEffect(() => {
        // Filter products based on active tab
        if (activeTab === 'all') {
            setFilteredProducts(products)
        } else {
            // activeTab is now category_id
            setFilteredProducts(products.filter(p => p.category_id === parseInt(activeTab)))
        }
    }, [activeTab, products])

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

            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .is('deleted_at', null)
                .gt('stock', 0)
                .order('name')

            setProducts(productsData || [])
            setFilteredProducts(productsData || [])

            // Fetch categories
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('*')
                .order('display_order')
            
            setCategories(categoriesData || [])

            // Fetch customers
            const { data: customersData } = await supabase
                .from('customers')
                .select('*')
                .is('deleted_at', null)
                .order('name')

            setCustomers(customersData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
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
            setCart([...cart, { ...product, quantity: 1, note: '' }])
        }
    }

    const updateQuantity = (productId: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + delta
                if (newQuantity <= 0) return null
                if (newQuantity > item.stock) return item
                return { ...item, quantity: newQuantity }
            }
            return item
        }).filter(Boolean) as any[])
    }

    const updateNote = (productId: number, note: string) => {
        setCart(cart.map(item =>
            item.id === productId ? { ...item, note } : item
        ))
    }

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getProductInitials = (name: string) => {
        const words = name.split(' ')
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    const getInitialsColor = (name: string) => {
        const colors = [
            'bg-blue-100 text-blue-600',
            'bg-purple-100 text-purple-600',
            'bg-emerald-100 text-emerald-600',
            'bg-amber-100 text-amber-600',
            'bg-rose-100 text-rose-600',
            'bg-cyan-100 text-cyan-600',
        ]
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return colors[hash % colors.length]
    }

    const ProductImage = ({ product, size = 'md' }: { product: any, size?: 'sm' | 'md' | 'lg' }) => {
        const sizeClasses = {
            sm: 'w-12 h-12 text-sm',
            md: 'w-16 h-16 text-xl',
            lg: 'w-20 h-20 text-2xl'
        }
        
        if (product.image_url) {
            return (
                <div className={cn("rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100", sizeClasses[size])}>
                    <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        }
        
        const initials = getProductInitials(product.name)
        const colorClass = getInitialsColor(product.name)
        
        return (
            <div className={cn(
                "rounded-2xl flex items-center justify-center font-bold flex-shrink-0",
                sizeClasses[size],
                colorClass
            )}>
                {initials}
            </div>
        )
    }

    const searchProducts = (query: string) => {
        const lowerQuery = query.toLowerCase()
        const results = products.filter(product =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.code.toLowerCase().includes(lowerQuery)
        ).slice(0, 5) // Limit to 5 results
        
        setSearchResults(results)
        setShowSearchResults(results.length > 0)
    }

    const selectSearchResult = (product: any) => {
        addToCart(product)
        setInputText('')
        setSearchResults([])
        setShowSearchResults(false)
    }

    const searchCustomers = (query: string) => {
        const lowerQuery = query.toLowerCase()
        const results = customers.filter(customer =>
            customer.name.toLowerCase().includes(lowerQuery) ||
            customer.code.toLowerCase().includes(lowerQuery) ||
            customer.phone?.includes(lowerQuery)
        ).slice(0, 5)
        
        setCustomerSearchResults(results)
        setShowCustomerResults(results.length > 0)
    }

    const selectCustomer = (customer: any) => {
        setSelectedCustomer(customer)
        setCustomerSearchQuery('')
        setCustomerSearchResults([])
        setShowCustomerResults(false)
    }

    const handleAddNewProduct = async () => {
        if (!newProduct.name || !newProduct.price) {
            alert('Vui lòng nhập tên và giá sản phẩm')
            return
        }

        try {
            const supabase = createClient()
            
            // Generate product code
            const code = `SP${Date.now().toString().slice(-6)}`
            
            const { data, error } = await (supabase as any).from('products').insert([{
                code,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock) || 0,
                category: null
            }]).select().single()

            if (error) throw error

            // Add to products list and cart
            const product = data
            setProducts([...products, product])
            addToCart(product)
            
            // Reset and close
            setNewProduct({ name: '', price: '', stock: '' })
            setShowAddProductSheet(false)
        } catch (error) {
            console.error('Error adding product:', error)
            alert('Có lỗi khi thêm sản phẩm')
        }
    }

    const handleCompleteOrder = async () => {
        if (cart.length === 0) {
            toast.error('Vui lòng thêm sản phẩm vào đơn hàng')
            return
        }

        try {
            setIsCreatingOrder(true)
            const supabase = createClient()
            
            // Calculate total
            const totalAmount = getTotalAmount()
            
            console.log('Creating order with data:', {
                customer_id: selectedCustomer?.id || null,
                sale_id: user.id,
                status: 'draft',
                total_amount: totalAmount
            })
            
            // Create draft order
            const { data: orderData, error: orderError } = await (supabase as any)
                .from('orders')
                .insert([{
                    customer_id: selectedCustomer?.id || null,
                    sale_id: user.id,
                    status: 'draft',
                    total_amount: totalAmount
                }])
                .select()
                .single()

            if (orderError) {
                console.error('Order creation error:', orderError)
                throw new Error(orderError.message || 'Lỗi khi tạo đơn hàng')
            }

            console.log('Order created:', orderData)

            // Create order items
            const orderItems = cart.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_order: item.price
            }))

            console.log('Creating order items:', orderItems)

            const { error: itemsError } = await (supabase as any)
                .from('order_items')
                .insert(orderItems)

            if (itemsError) {
                console.error('Order items creation error:', itemsError)
                throw new Error(itemsError.message || 'Lỗi khi tạo chi tiết đơn hàng')
            }

            // Success - show toast and redirect
            toast.success('Đã tạo đơn hàng nháp thành công!')
            
            // Reset cart and customer
            setCart([])
            setSelectedCustomer(null)
            
            // Redirect to orders page with draft tab
            setTimeout(() => {
                router.push('/sales/orders?tab=draft')
            }, 500)
        } catch (error: any) {
            console.error('Error creating order:', error)
            const errorMessage = error?.message || 'Có lỗi khi tạo đơn hàng'
            toast.error(errorMessage)
        } finally {
            setIsCreatingOrder(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user || !profile) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gradient-to-br from-orange-100/95 via-pink-100/95 to-blue-100/95 backdrop-blur-sm">
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Bán hàng</h1>
                    <button 
                        onClick={handleCompleteOrder}
                        className="text-blue-500 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cart.length === 0 || isCreatingOrder}
                    >
                        {isCreatingOrder ? 'Đang tạo...' : 'Xong'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 pt-4 pb-32">
                {/* Customer Search Input */}
                <div className="mb-4 relative">
                    {selectedCustomer ? (
                        <div className="h-12 bg-white rounded-2xl border-none shadow-sm flex items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">
                                        {selectedCustomer.name[0]}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {selectedCustomer.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {selectedCustomer.code}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Input
                            placeholder="Khách hàng"
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            className="h-12 bg-white rounded-2xl border-none shadow-sm"
                        />
                    )}
                    
                    {/* Customer Search Results */}
                    {showCustomerResults && (
                        <>
                            <div 
                                className="fixed inset-0 z-40"
                                onClick={() => {
                                    setShowCustomerResults(false)
                                    setCustomerSearchQuery('')
                                }}
                            />
                            <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                {customerSearchResults.map((customer) => (
                                    <button
                                        key={customer.id}
                                        onClick={() => selectCustomer(customer)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-blue-600 font-bold">
                                                {customer.name[0]}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {customer.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {customer.code} • {customer.phone || 'N/A'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Cart Items or Empty State */}
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-xl font-semibold text-gray-900 mb-2">
                            Đơn này bạn bán hàng gì?
                        </p>
                        <p className="text-sm text-gray-500">
                            Chat tên hàng hoặc đọc tên hàng<br />
                            để Knote tính tiền nhanh.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <Card key={item.id} className="bg-white rounded-2xl border-none shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {item.stock}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                            >
                                                <Minus className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <span className="w-8 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                    <Input
                                        placeholder="Ghi chú..."
                                        value={item.note}
                                        onChange={(e) => updateNote(item.id, e.target.value)}
                                        className="h-10 bg-gray-50 border-none text-sm"
                                    />
                                </CardContent>
                            </Card>
                        ))}

                        {/* Total */}
                        <Card className="bg-white rounded-2xl border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <span className="font-semibold text-gray-900">Tổng cộng</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(getTotalAmount())}
                                </span>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
                <>
                    <div 
                        className="fixed inset-0 z-[70]"
                        onClick={() => {
                            setShowSearchResults(false)
                            setInputText('')
                        }}
                    />
                    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl z-[80] max-h-80 overflow-y-auto">
                        {searchResults.map((product) => {
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => selectSearchResult(product)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                >
                                    <ProductImage product={product} size="sm" />
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatCurrency(product.price)} • Còn {product.stock}
                                        </p>
                                    </div>
                                    <Plus className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                </button>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Bottom Input Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom z-30">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowProductSheet(true)}
                        className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white"
                    >
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Tìm sản phẩm"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="h-12 bg-gray-100 border-none rounded-2xl pr-12"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Sheet */}
            {showProductSheet && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setShowProductSheet(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col">
                        {/* Sheet Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Hàng hóa ({products.length})</h2>
                            <button
                                onClick={() => setShowProductSheet(false)}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                                    activeTab === 'all'
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-600"
                                )}
                            >
                                Tất cả
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveTab(category.id.toString())}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                                        activeTab === category.id.toString()
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-3 gap-4">
                                {/* Add Product Button */}
                                <button 
                                    onClick={() => {
                                        setShowProductSheet(false)
                                        setShowAddProductSheet(true)
                                    }}
                                    className="flex flex-col items-center justify-start gap-2"
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span className="text-xs text-gray-600 text-center">
                                        Thêm hàng
                                    </span>
                                </button>

                                {/* Product Items */}
                                {filteredProducts.map((product) => {
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                addToCart(product)
                                                setShowProductSheet(false)
                                            }}
                                            className="flex flex-col items-center justify-start gap-2"
                                        >
                                            <ProductImage product={product} size="md" />
                                            <span className="text-xs text-gray-900 text-center line-clamp-2 font-medium">
                                                {product.name}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Add Product Sheet */}
            {showAddProductSheet && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => {
                            setShowAddProductSheet(false)
                            setNewProduct({ name: '', price: '', stock: '' })
                        }}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Thêm hàng mới</h2>
                            <button
                                onClick={() => {
                                    setShowAddProductSheet(false)
                                    setNewProduct({ name: '', price: '', stock: '' })
                                }}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên sản phẩm *
                                </label>
                                <Input
                                    placeholder="Nhập tên sản phẩm"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="h-12 bg-gray-50 border-gray-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giá bán *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="h-12 bg-gray-50 border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="h-12 bg-gray-50 border-gray-200"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleAddNewProduct}
                                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
                            >
                                Thêm vào đơn hàng
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
