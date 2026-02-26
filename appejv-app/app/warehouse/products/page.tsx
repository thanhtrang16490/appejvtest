'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Package, Search, X, Edit } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

export default function WarehouseProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'low'>('all')
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newStock, setNewStock] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (user.role !== 'warehouse') {
      router.push('/sales')
      return
    }
    fetchProducts()
    
    const filter = searchParams.get('filter')
    if (filter === 'low') {
      setFilterType('low')
    }
  }, [user, searchParams])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, filterType])

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      console.error('Error fetching products:', error)
      toast.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by stock level
    if (filterType === 'low') {
      filtered = filtered.filter(p => p.stock < 20)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleEditStock = (product: any) => {
    setEditingProduct(product)
    setNewStock(product.stock.toString())
  }

  const handleSaveStock = async () => {
    if (!editingProduct) return

    const stockValue = parseInt(newStock)
    if (isNaN(stockValue) || stockValue < 0) {
      toast.error('Vui lòng nhập số lượng hợp lệ')
      return
    }

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('products')
        .update({ 
          stock: stockValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProduct.id)

      if (error) throw error

      toast.success('Cập nhật thành công! Số lượng tồn kho đã được cập nhật')
      setEditingProduct(null)
      setNewStock('')
      fetchProducts()
    } catch (error: any) {
      console.error('Error updating stock:', error)
      toast.error('Không thể cập nhật số lượng tồn')
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Hết hàng', color: 'text-red-700', bg: 'bg-red-100' }
    if (stock < 20) return { label: 'Sắp hết', color: 'text-amber-700', bg: 'bg-amber-100' }
    return { label: 'Còn hàng', color: 'text-emerald-700', bg: 'bg-emerald-100' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbeb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      {/* Header */}
      <div className="bg-[#fffbeb] p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sản phẩm</h1>
            <p className="text-sm text-gray-600">{filteredProducts.length} sản phẩm</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
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

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
              filterType === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Sắp hết
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="p-4 space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy sản phẩm</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const status = getStockStatus(product.stock)
            return (
              <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">{product.name}</p>
                      {product.code && (
                        <p className="text-xs text-gray-500">SKU: {product.code}</p>
                      )}
                      <p className="text-sm font-semibold text-amber-600 mt-1">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 ${status.bg} ${status.color} text-sm font-bold rounded-lg mb-1`}>
                      {product.stock} {product.unit || 'cái'}
                    </span>
                    <br />
                    <span className={`inline-block px-2 py-1 ${status.bg} ${status.color} text-xs font-semibold rounded-lg`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleEditStock(product)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-amber-50 border border-amber-600 text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Cập nhật tồn kho</span>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Edit Stock Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Cập nhật tồn kho"
      >
        {editingProduct && (
          <div className="space-y-4">
            <p className="text-base font-semibold text-gray-900">{editingProduct.name}</p>
            <p className="text-sm text-gray-600">
              Số lượng tồn hiện tại: {editingProduct.stock}
            </p>
            
            <Input
              label="Số lượng mới"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Nhập số lượng"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveStock}
                className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
