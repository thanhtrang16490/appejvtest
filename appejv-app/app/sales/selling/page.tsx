'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ShoppingCart, Search, Plus, Minus, X, Package, Grid3x3, Check } from 'lucide-react'

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category_id: string
  image_url?: string
}

interface CartItem extends Product {
  quantity: number
}

interface Category {
  id: string
  name: string
  count: number
}

const CART_STORAGE_KEY = 'sales_cart'

export default function SellingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickSearchQuery, setQuickSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [editingItem, setEditingItem] = useState<CartItem | null>(null)
  const [tempQuantity, setTempQuantity] = useState('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
    loadCartFromStorage()
  }, [user, authLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user!.id)
        .single()

      if (!profileData || !['sale', 'sale_admin', 'admin'].includes(profileData.role)) {
        router.push('/')
        return
      }

      setProfile(profileData)

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .is('deleted_at', null)
        .order('name')

      setProducts(productsData || [])

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      // Calculate categories with product count
      const categoriesWithCount = (categoriesData || [])
        .map(cat => ({
          ...cat,
          count: (productsData || []).filter(p => p.category_id === cat.id && p.stock > 0).length
        }))
        .filter(cat => cat.count > 0)

      setCategories([
        { id: 'all', name: 'Tất cả', count: productsData?.length || 0 },
        ...categoriesWithCount
      ])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error(error.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const loadCartFromStorage = () => {
    try {
      const cartJson = localStorage.getItem(CART_STORAGE_KEY)
      if (cartJson) {
        setCart(JSON.parse(cartJson))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  const saveCartToStorage = (cartData: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      let newCart
      if (existingItem) {
        toast.success(`Đã tăng số lượng "${product.name}"`)
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      } else {
        toast.success(`Đã thêm "${product.name}" vào giỏ`)
        newCart = [...prevCart, { ...product, quantity: 1 }]
      }
      saveCartToStorage(newCart)
      return newCart
    })
  }, [])

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta
          if (newQuantity <= 0) return null
          if (newQuantity > item.stock) return item
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) as CartItem[]
      saveCartToStorage(newCart)
      return newCart
    })
  }, [])

  const setQuantityDirectly = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === productId) {
          if (quantity <= 0) return null
          if (quantity > item.stock) {
            toast.error(`Số lượng tối đa: ${item.stock}`)
            return { ...item, quantity: item.stock }
          }
          return { ...item, quantity }
        }
        return item
      }).filter(Boolean) as CartItem[]
      saveCartToStorage(newCart)
      return newCart
    })
  }, [])

  const handleQuantityEdit = (item: CartItem) => {
    setEditingItem(item)
    setTempQuantity(item.quantity.toString())
    setShowQuantityModal(true)
  }

  const handleQuantitySubmit = () => {
    if (!editingItem) return
    
    const quantity = parseInt(tempQuantity)
    if (!isNaN(quantity) && quantity > 0) {
      setQuantityDirectly(editingItem.id, quantity)
    }
    setShowQuantityModal(false)
    setEditingItem(null)
    setTempQuantity('')
  }

  const getTotalAmount = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cart])

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      toast.error('Vui lòng thêm sản phẩm vào đơn hàng')
      return
    }

    try {
      setIsCreatingOrder(true)
      const supabase = createClient()
      const totalAmount = getTotalAmount()

      // Create draft order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          sale_id: user!.id,
          status: 'draft',
          total_amount: totalAmount
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      toast.success('Đơn hàng đã được tạo thành công!')
      
      // Reset cart
      setCart([])
      saveCartToStorage([])
      
      // Navigate to orders
      router.push('/sales/orders')
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast.error(error.message || 'Có lỗi khi tạo đơn hàng')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === activeCategory)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [products, activeCategory, searchQuery])

  const quickSearchResults = useMemo(() => {
    if (!quickSearchQuery || quickSearchQuery.trim().length < 2) {
      return []
    }
    
    const query = quickSearchQuery.toLowerCase().trim()
    return products
      .filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(query)
        const codeMatch = p.code?.toLowerCase().includes(query)
        return (nameMatch || codeMatch) && p.stock > 0
      })
      .slice(0, 5)
  }, [products, quickSearchQuery])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#f0f9ff] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Đặt hàng</h1>
          <button
            onClick={handleCompleteOrder}
            disabled={cart.length === 0 || isCreatingOrder}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-lg',
              cart.length === 0 || isCreatingOrder
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-emerald-600 hover:bg-emerald-50'
            )}
          >
            {isCreatingOrder ? 'Đang tạo...' : 'Xong'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Cart or Empty State */}
        {cart.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Bạn muốn đặt gì hôm nay?</h2>
            <p className="text-sm text-gray-600">Nhấn nút bên dưới để chọn sản phẩm</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleQuantityEdit(item)}
                      className="min-w-[40px] text-center text-base font-semibold text-gray-900"
                    >
                      {item.quantity}
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-emerald-600">
                  Thành tiền: {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}

            {/* Total */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalAmount())}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center gap-3">
        <button
          onClick={() => setShowProductModal(true)}
          className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg"
        >
          <Grid3x3 className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm sản phẩm nhanh..."
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {quickSearchQuery && (
              <button
                onClick={() => setQuickSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Quick Search Results */}
          {quickSearchResults.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl max-h-80 overflow-y-auto">
              {quickSearchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    addToCart(product)
                    setQuickSearchQuery('')
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-emerald-600">{formatCurrency(product.price)}</span>
                      <span className="text-gray-500">• Còn: {product.stock}</span>
                    </div>
                  </div>
                  <Plus className="w-6 h-6 text-emerald-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Chọn sản phẩm ({products.length})</h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 px-4 py-3 border-b border-gray-200 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    activeCategory === cat.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">Không tìm thấy sản phẩm</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white border border-gray-200 rounded-xl p-3 hover:border-emerald-500 hover:shadow-md transition-all"
                    >
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                      ) : (
                        <div className="w-full aspect-square bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                          <Package className="w-6 h-6 text-emerald-600" />
                        </div>
                      )}
                      <p className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</p>
                      <p className="text-xs font-bold text-emerald-600 mb-1">{formatCurrency(product.price)}</p>
                      <p className="text-[10px] text-gray-500">Còn: {product.stock}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quantity Edit Modal */}
      {showQuantityModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Nhập số lượng</h3>
              <button
                onClick={() => setShowQuantityModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="text-center">
                <h4 className="text-base font-bold text-gray-900 mb-2">{editingItem.name}</h4>
                <p className="text-sm text-emerald-600 font-semibold">{formatCurrency(editingItem.price)} / sản phẩm</p>
                <p className="text-xs text-gray-500 mt-1">Tồn kho: {editingItem.stock}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    const current = parseInt(tempQuantity) || 0
                    if (current > 1) setTempQuantity((current - 1).toString())
                  }}
                  className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600"
                >
                  <Minus className="w-6 h-6 text-white" />
                </button>

                <input
                  type="number"
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(e.target.value)}
                  className="w-24 h-15 text-3xl font-bold text-center bg-gray-100 rounded-xl border-2 border-emerald-500 focus:outline-none"
                  autoFocus
                />

                <button
                  onClick={() => {
                    const current = parseInt(tempQuantity) || 0
                    if (current < editingItem.stock) {
                      setTempQuantity((current + 1).toString())
                    }
                  }}
                  className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Total */}
              <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">Thành tiền</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(editingItem.price * (parseInt(tempQuantity) || 0))}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateQuantity(editingItem.id, -editingItem.quantity)
                    setShowQuantityModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-200"
                >
                  <X className="w-5 h-5" />
                  Xóa
                </button>

                <button
                  onClick={handleQuantitySubmit}
                  className="flex-2 flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-xl font-semibold hover:bg-emerald-600 px-8"
                >
                  <Check className="w-5 h-5" />
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
