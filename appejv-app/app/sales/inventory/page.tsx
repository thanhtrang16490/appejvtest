'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { Package, Search, Plus, X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category_id: string
  image_url?: string
  categories?: { id: string; name: string }
}

interface Category {
  id: string
  name: string
  count: number
}

const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return { label: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-100' }
  } else if (stock < 20) {
    return { label: 'Sắp hết', color: 'text-amber-600', bg: 'bg-amber-100' }
  } else {
    return { label: 'Còn hàng', color: 'text-emerald-600', bg: 'bg-emerald-100' }
  }
}

export default function InventoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
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

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      // Fetch products with categories
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .is('deleted_at', null)
        .order('name')

      if (error) throw error

      setProducts(productsData || [])

      // Calculate categories with product count
      const categoriesWithCount = (categoriesData || [])
        .map(cat => ({
          ...cat,
          count: (productsData || []).filter(p => p.category_id === cat.id).length
        }))
        .filter(cat => cat.count > 0)

      setCategories([
        { id: 'all', name: 'Tất cả', count: productsData?.length || 0 },
        ...categoriesWithCount
      ])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error(error.message || 'Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query) ||
        p.categories?.name?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory, products])

  const stockSummary = useMemo(() => {
    return {
      inStock: products.filter(p => p.stock >= 20).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock < 20).length,
      outOfStock: products.filter(p => p.stock === 0).length,
    }
  }, [products])

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

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kho hàng
              {isAdmin && <span className="text-sm text-[#175ead] font-bold ml-2">• ADMIN</span>}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{filteredProducts.length} sản phẩm</p>
          </div>
          {isAdmin && (
            <Link href="/sales/inventory/add">
              <button className="w-10 h-10 bg-[#175ead] rounded-full flex items-center justify-center hover:bg-[#134a8a] transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </Link>
          )}
        </div>

        {/* Stock Summary */}
        {!searchQuery && !selectedCategory && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-600">Còn hàng</p>
                <p className="text-base font-bold text-gray-900">{stockSummary.inStock}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-600">Sắp hết</p>
                <p className="text-base font-bold text-gray-900">{stockSummary.lowStock}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-600">Hết hàng</p>
                <p className="text-base font-bold text-gray-900">{stockSummary.outOfStock}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                (selectedCategory === category.id || (!selectedCategory && category.id === 'all'))
                  ? 'bg-[#175ead] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-400">
              {searchQuery || selectedCategory
                ? 'Không tìm thấy sản phẩm nào'
                : 'Chưa có sản phẩm nào trong kho'}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
                className="mt-3 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock)
              
              return (
                <Link key={product.id} href={`/sales/inventory/${product.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    {/* Product Image */}
                    <div className="relative w-full aspect-square bg-blue-50 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-10 h-10 text-[#175ead]" />
                      )}
                      <span className={cn('absolute top-2 right-2 text-[10px] px-2 py-1 rounded-lg font-semibold', stockStatus.bg, stockStatus.color)}>
                        {stockStatus.label}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 truncate flex-1">
                          {product.categories?.name || 'Uncategory'}
                        </span>
                        {product.code && (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-2">
                            {product.code}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-500">Giá</p>
                          <p className="text-sm font-bold text-[#175ead]">{formatCurrency(product.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500">Kho</p>
                          <p className="text-sm font-bold text-gray-900">{product.stock}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
