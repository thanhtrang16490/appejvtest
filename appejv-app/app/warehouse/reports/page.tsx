'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { BarChart3, Package, ShoppingCart, DollarSign } from 'lucide-react'

export default function WarehouseReportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [productStats, setProductStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'stock' | 'orders'>('stock')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (user.role !== 'warehouse') {
      router.push('/sales')
      return
    }
    fetchReports()
  }, [user, sortBy])

  const fetchReports = async () => {
    try {
      const supabase = createClient()

      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, code, stock, unit, price')
        .order('name', { ascending: true })

      if (productsError) throw productsError

      // For each product, count orders
      const statsPromises = (products || []).map(async (product) => {
        const { count } = await supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', product.id)

        return {
          ...product,
          orderCount: count || 0
        }
      })

      const stats = await Promise.all(statsPromises)

      // Sort by selected criteria
      const sorted = stats.sort((a, b) => {
        if (sortBy === 'stock') {
          return a.stock - b.stock // Low stock first
        } else {
          return b.orderCount - a.orderCount // Most orders first
        }
      })

      setProductStats(sorted)
    } catch (error: any) {
      console.error('Error fetching reports:', error)
      toast.error('Không thể tải báo cáo')
    } finally {
      setLoading(false)
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

  const lowStockCount = productStats.filter(p => p.stock < 20 && p.stock > 0).length
  const outOfStockCount = productStats.filter(p => p.stock === 0).length

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      {/* Header */}
      <div className="bg-[#fffbeb] p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Báo cáo kho</h1>
            <p className="text-sm text-gray-600">Thống kê theo mặt hàng</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('stock')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
              sortBy === 'stock'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Theo tồn kho
          </button>
          <button
            onClick={() => setSortBy('orders')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
              sortBy === 'orders'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Theo đơn hàng
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-600 mb-2">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-900">{productStats.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-600 mb-2">Sắp hết hàng</p>
            <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-600 mb-2">Hết hàng</p>
            <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
          </div>
        </div>

        {/* Product List */}
        <h2 className="text-lg font-semibold text-gray-900 pt-2">Chi tiết sản phẩm</h2>
        <div className="space-y-3">
          {productStats.map((product, index) => {
            const status = getStockStatus(product.stock)
            return (
              <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-amber-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-900">{product.name}</p>
                        {product.code && (
                          <p className="text-xs text-gray-500">SKU: {product.code}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 ${status.bg} ${status.color} text-xs font-semibold rounded-lg`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        <span>Tồn: {product.stock} {product.unit || 'cái'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Đơn: {product.orderCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
