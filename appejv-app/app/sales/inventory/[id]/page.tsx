'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import SalesLayout from '../../layout'
import { 
  ChevronLeft, 
  Package, 
  Tag, 
  Layers, 
  DollarSign, 
  Archive, 
  Calendar,
  Edit2,
  Check,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category_id: string
  image_url?: string
  description?: string
  created_at: string
  categories?: { id: string; name: string }
}

interface Category {
  id: string
  name: string
}

const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return { label: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, iconColor: 'text-red-600' }
  } else if (stock < 20) {
    return { label: 'Sắp hết', color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertCircle, iconColor: 'text-amber-600' }
  } else {
    return { label: 'Còn hàng', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle, iconColor: 'text-emerald-600' }
  }
}

export default function ProductDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    name: '',
    code: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
  })

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user, authLoading, productId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(categoriesData || [])

      // Fetch product
      const { data: productData, error } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .eq('id', productId)
        .is('deleted_at', null)
        .single()

      if (error) throw error
      setProduct(productData)
      setEditedData({
        name: productData.name || '',
        code: productData.code || '',
        category_id: productData.category_id || '',
        description: productData.description || '',
        price: productData.price?.toString() || '',
        stock: productData.stock?.toString() || '',
      })
    } catch (error: any) {
      console.error('Error fetching product:', error)
      toast.error(error.message || 'Không thể tải thông tin sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('products')
        .update({
          name: editedData.name,
          code: editedData.code,
          category_id: editedData.category_id || null,
          description: editedData.description,
          price: parseFloat(editedData.price) || 0,
          stock: parseInt(editedData.stock) || 0,
        })
        .eq('id', productId)

      if (error) throw error

      toast.success('Đã cập nhật thông tin sản phẩm')
      setEditing(false)
      fetchData()
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast.error('Không thể cập nhật thông tin sản phẩm')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    if (product) {
      setEditedData({
        name: product.name || '',
        code: product.code || '',
        category_id: product.category_id || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
      })
    }
  }

  if (authLoading || loading) {
    return (
      <SalesLayout>
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </SalesLayout>
    )
  }

  if (!product) {
    return (
      <SalesLayout>
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
          <p className="text-red-600">Không tìm thấy sản phẩm</p>
        </div>
      </SalesLayout>
    )
  }

  const stockStatus = getStockStatus(product.stock)
  const StockIcon = stockStatus.icon

  return (
    <SalesLayout>
      <div className="min-h-screen bg-[#f0f9ff]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f0f9ff] border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Chi tiết sản phẩm</h1>
          <div className="w-10">
            {editing ? (
              <button
                onClick={handleSave}
                className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 rounded-full transition-colors"
              >
                <Check className="w-6 h-6 text-emerald-600" />
              </button>
            ) : (
              isAdmin && (
                <button
                  onClick={() => setEditing(true)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit2 className="w-6 h-6 text-[#175ead]" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Product Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Product Image */}
            <div className="relative w-full h-64 bg-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-300" />
                </div>
              )}
            </div>

            <div className="p-5">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    label="Tên sản phẩm"
                    value={editedData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                  />
                  
                  <Input
                    label="Mã sản phẩm"
                    value={editedData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, code: e.target.value })}
                    placeholder="Nhập mã sản phẩm"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={editedData.category_id}
                      onChange={(e) => setEditedData({ ...editedData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Input
                    label="Giá bán"
                    value={editedData.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, price: e.target.value })}
                    placeholder="Nhập giá bán"
                    type="number"
                  />
                  
                  <Input
                    label="Tồn kho"
                    value={editedData.stock}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, stock: e.target.value })}
                    placeholder="Nhập số lượng tồn kho"
                    type="number"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={editedData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedData({ ...editedData, description: e.target.value })}
                      placeholder="Nhập mô tả sản phẩm"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
                      <p className="text-sm text-gray-600">Mã: {product.code}</p>
                    </div>
                    <Badge variant={
                      product.stock === 0 ? 'danger' :
                      product.stock < 20 ? 'warning' :
                      'success'
                    }>
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-[#175ead]">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info Section */}
          {!editing && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin chi tiết</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Danh mục</p>
                    <p className="text-sm font-medium text-gray-900">
                      {product.categories?.name || '---'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Archive className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Tồn kho</p>
                    <p className="text-sm font-medium text-gray-900">{product.stock} sản phẩm</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Ngày tạo</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(product.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                {product.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Tag className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-0.5">Mô tả</p>
                      <p className="text-sm font-medium text-gray-900">{product.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancel Button when editing */}
          {editing && (
            <button
              onClick={handleCancel}
              className="w-full py-3.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </SalesLayout>
  )
}
