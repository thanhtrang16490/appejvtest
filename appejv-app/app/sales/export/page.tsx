'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Download, FileSpreadsheet, Calendar, Users, Package, ShoppingCart, ChevronLeft } from 'lucide-react'

type ExportType = 'orders' | 'customers' | 'products' | 'reports'

export default function ExportPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<ExportType | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchProfile()
  }, [user, authLoading])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user!.id)
        .single()

      if (!profileData || !['admin', 'sale_admin'].includes(profileData.role)) {
        toast.error('Bạn không có quyền truy cập trang này')
        router.push('/sales')
        return
      }

      setProfile(profileData)
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    // Get headers from first object
    const headers = Object.keys(data[0])
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Handle values with commas or quotes
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',')
      )
    ].join('\n')

    // Add BOM for UTF-8 encoding (helps Excel recognize Vietnamese characters)
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportOrders = async () => {
    try {
      setExporting('orders')
      const supabase = createClient()

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          customer:customers(full_name, email, phone),
          sale:profiles!orders_sale_id_fkey(full_name, email)
        `)
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to)
        .order('created_at', { ascending: false })

      if (error) throw error

      const exportData = (orders || []).map((order: any) => ({
        'Mã đơn hàng': order.id,
        'Ngày tạo': new Date(order.created_at).toLocaleString('vi-VN'),
        'Trạng thái': order.status,
        'Tổng tiền': order.total_amount,
        'Khách hàng': order.customer?.full_name || 'N/A',
        'Email KH': order.customer?.email || 'N/A',
        'SĐT KH': order.customer?.phone || 'N/A',
        'Nhân viên': order.sale?.full_name || 'N/A',
        'Email NV': order.sale?.email || 'N/A'
      }))

      exportToCSV(exportData, 'don-hang')
      toast.success(`Đã xuất ${exportData.length} đơn hàng`)
    } catch (error: any) {
      console.error('Error exporting orders:', error)
      toast.error(error.message || 'Không thể xuất dữ liệu đơn hàng')
    } finally {
      setExporting(null)
    }
  }

  const handleExportCustomers = async () => {
    try {
      setExporting('customers')
      const supabase = createClient()

      const { data: customers, error } = await supabase
        .from('customers')
        .select(`
          id,
          full_name,
          email,
          phone,
          address,
          created_at,
          sale:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const exportData = (customers || []).map((customer: any) => ({
        'Mã KH': customer.id,
        'Họ tên': customer.full_name,
        'Email': customer.email || 'N/A',
        'Số điện thoại': customer.phone || 'N/A',
        'Địa chỉ': customer.address || 'N/A',
        'Ngày tạo': new Date(customer.created_at).toLocaleString('vi-VN'),
        'Nhân viên phụ trách': customer.sale?.full_name || 'Chưa phân công',
        'Email NV': customer.sale?.email || 'N/A'
      }))

      exportToCSV(exportData, 'khach-hang')
      toast.success(`Đã xuất ${exportData.length} khách hàng`)
    } catch (error: any) {
      console.error('Error exporting customers:', error)
      toast.error(error.message || 'Không thể xuất dữ liệu khách hàng')
    } finally {
      setExporting(null)
    }
  }

  const handleExportProducts = async () => {
    try {
      setExporting('products')
      const supabase = createClient()

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          code,
          price,
          stock,
          description,
          created_at,
          category:categories(name)
        `)
        .is('deleted_at', null)
        .order('name')

      if (error) throw error

      const exportData = (products || []).map((product: any) => ({
        'Mã SP': product.id,
        'Mã sản phẩm': product.code || 'N/A',
        'Tên sản phẩm': product.name,
        'Danh mục': product.category?.name || 'N/A',
        'Giá': product.price,
        'Tồn kho': product.stock,
        'Mô tả': product.description || 'N/A',
        'Ngày tạo': new Date(product.created_at).toLocaleString('vi-VN')
      }))

      exportToCSV(exportData, 'san-pham')
      toast.success(`Đã xuất ${exportData.length} sản phẩm`)
    } catch (error: any) {
      console.error('Error exporting products:', error)
      toast.error(error.message || 'Không thể xuất dữ liệu sản phẩm')
    } finally {
      setExporting(null)
    }
  }

  const handleExportReports = async () => {
    try {
      setExporting('reports')
      const supabase = createClient()

      // Get orders with items for the date range
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          customer:customers(full_name),
          sale:profiles!orders_sale_id_fkey(full_name),
          order_items(
            quantity,
            price_at_order,
            product:products(name, code)
          )
        `)
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Flatten order items for detailed report
      const exportData: any[] = []
      ;(orders || []).forEach((order: any) => {
        ;(order.order_items || []).forEach((item: any) => {
          exportData.push({
            'Mã đơn hàng': order.id,
            'Ngày': new Date(order.created_at).toLocaleDateString('vi-VN'),
            'Trạng thái': order.status,
            'Khách hàng': order.customer?.full_name || 'N/A',
            'Nhân viên': order.sale?.full_name || 'N/A',
            'Mã SP': item.product?.code || 'N/A',
            'Tên sản phẩm': item.product?.name || 'N/A',
            'Số lượng': item.quantity,
            'Đơn giá': item.price_at_order,
            'Thành tiền': item.quantity * item.price_at_order,
            'Tổng đơn hàng': order.total_amount
          })
        })
      })

      exportToCSV(exportData, 'bao-cao-chi-tiet')
      toast.success(`Đã xuất báo cáo chi tiết ${exportData.length} dòng`)
    } catch (error: any) {
      console.error('Error exporting reports:', error)
      toast.error(error.message || 'Không thể xuất báo cáo')
    } finally {
      setExporting(null)
    }
  }

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
    <div className="min-h-screen bg-[#f0f9ff] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#f0f9ff] border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Xuất dữ liệu</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Date Range Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[#175ead]" />
            <h2 className="text-base font-bold text-gray-900">Khoảng thời gian</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Khoảng thời gian áp dụng cho đơn hàng và báo cáo
          </p>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#175ead]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Đơn hàng</h3>
                <p className="text-xs text-gray-500">Xuất danh sách đơn hàng</p>
              </div>
            </div>
            <button
              onClick={handleExportOrders}
              disabled={exporting === 'orders'}
              className="w-full flex items-center justify-center gap-2 bg-[#175ead] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#134a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting === 'orders' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Xuất CSV
                </>
              )}
            </button>
          </div>

          {/* Export Customers */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Khách hàng</h3>
                <p className="text-xs text-gray-500">Xuất danh sách khách hàng</p>
              </div>
            </div>
            <button
              onClick={handleExportCustomers}
              disabled={exporting === 'customers'}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting === 'customers' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Xuất CSV
                </>
              )}
            </button>
          </div>

          {/* Export Products */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Sản phẩm</h3>
                <p className="text-xs text-gray-500">Xuất danh sách sản phẩm</p>
              </div>
            </div>
            <button
              onClick={handleExportProducts}
              disabled={exporting === 'products'}
              className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting === 'products' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Xuất CSV
                </>
              )}
            </button>
          </div>

          {/* Export Reports */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Báo cáo chi tiết</h3>
                <p className="text-xs text-gray-500">Xuất báo cáo theo sản phẩm</p>
              </div>
            </div>
            <button
              onClick={handleExportReports}
              disabled={exporting === 'reports'}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting === 'reports' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Xuất CSV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-900">
            <strong>Lưu ý:</strong> Dữ liệu được xuất dưới định dạng CSV (UTF-8 with BOM) để đảm bảo hiển thị đúng tiếng Việt trong Excel. 
            Nếu gặp vấn đề với ký tự tiếng Việt, hãy mở file bằng Excel và chọn encoding UTF-8.
          </p>
        </div>
      </div>
    </div>
  )
}
