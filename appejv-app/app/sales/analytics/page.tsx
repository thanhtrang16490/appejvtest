'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

type TimeRange = 'week' | 'month' | 'quarter' | 'year'

const COLORS = ['#175ead', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [productData, setProductData] = useState<any[]>([])
  const [salesPersonData, setSalesPersonData] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchProfile()
  }, [user, authLoading])

  useEffect(() => {
    if (profile) {
      fetchAnalytics()
    }
  }, [profile, timeRange])

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

  const getDateRange = () => {
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    return { startDate: startDate.toISOString(), endDate: now.toISOString() }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { startDate, endDate } = getDateRange()

      // Fetch orders with items
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          sale_id,
          customer_id,
          order_items(
            quantity,
            price_at_order,
            product:products(
              name,
              category_id,
              category:categories(name)
            )
          )
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .in('status', ['paid', 'completed'])

      if (!orders) return

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
      const totalOrders = orders.length
      const uniqueCustomers = new Set(orders.map(o => o.customer_id)).size
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate growth (compare with previous period)
      const prevStartDate = new Date(startDate)
      const prevEndDate = new Date(startDate)
      const periodDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      prevStartDate.setDate(prevStartDate.getDate() - periodDays)

      const { data: prevOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', prevStartDate.toISOString())
        .lt('created_at', startDate)
        .in('status', ['paid', 'completed'])

      const prevRevenue = prevOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const prevOrderCount = prevOrders?.length || 0
      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
      const ordersGrowth = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        avgOrderValue,
        revenueGrowth,
        ordersGrowth
      })

      // Revenue by day/week/month
      const revenueByDate: { [key: string]: number } = {}
      orders.forEach(order => {
        const date = new Date(order.created_at)
        let key: string
        
        if (timeRange === 'week') {
          key = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' })
        } else if (timeRange === 'month') {
          key = date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
        } else {
          key = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
        }
        
        revenueByDate[key] = (revenueByDate[key] || 0) + order.total_amount
      })

      const revenueChartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
        date,
        revenue
      }))

      setRevenueData(revenueChartData)

      // Revenue by category
      const categoryRevenue: { [key: string]: number } = {}
      orders.forEach(order => {
        order.order_items.forEach((item: any) => {
          const categoryName = item.product?.category?.name || 'Khác'
          const itemRevenue = item.quantity * item.price_at_order
          categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + itemRevenue
        })
      })

      const categoryChartData = Object.entries(categoryRevenue)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)

      setCategoryData(categoryChartData)

      // Top products
      const productRevenue: { [key: string]: { revenue: number; quantity: number } } = {}
      orders.forEach(order => {
        order.order_items.forEach((item: any) => {
          const productName = item.product?.name || 'N/A'
          const itemRevenue = item.quantity * item.price_at_order
          
          if (!productRevenue[productName]) {
            productRevenue[productName] = { revenue: 0, quantity: 0 }
          }
          productRevenue[productName].revenue += itemRevenue
          productRevenue[productName].quantity += item.quantity
        })
      })

      const productChartData = Object.entries(productRevenue)
        .map(([name, data]) => ({ name, revenue: data.revenue, quantity: data.quantity }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      setProductData(productChartData)

      // Sales person performance (admin only)
      if (profile.role === 'admin') {
        const salesRevenue: { [key: string]: number } = {}
        const salesOrders: { [key: string]: number } = {}

        orders.forEach(order => {
          if (order.sale_id) {
            salesRevenue[order.sale_id] = (salesRevenue[order.sale_id] || 0) + order.total_amount
            salesOrders[order.sale_id] = (salesOrders[order.sale_id] || 0) + 1
          }
        })

        // Fetch sales person names
        const { data: salesPeople } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', Object.keys(salesRevenue))

        const salesChartData = salesPeople?.map(person => ({
          name: person.full_name,
          revenue: salesRevenue[person.id] || 0,
          orders: salesOrders[person.id] || 0
        })).sort((a, b) => b.revenue - a.revenue) || []

        setSalesPersonData(salesChartData)
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      toast.error('Không thể tải dữ liệu phân tích')
    } finally {
      setLoading(false)
    }
  }

  const exportChart = (chartId: string, filename: string) => {
    // This is a placeholder - in production, you'd use a library like html2canvas
    toast.info('Tính năng xuất biểu đồ đang được phát triển')
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
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Phân tích</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Time Range Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: 'week', label: '7 ngày' },
            { value: 'month', label: '30 ngày' },
            { value: 'quarter', label: '3 tháng' },
            { value: 'year', label: '1 năm' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as TimeRange)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                timeRange === range.value
                  ? 'bg-[#175ead] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#175ead]" />
              </div>
              {stats.revenueGrowth !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  stats.revenueGrowth > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stats.revenueGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stats.revenueGrowth).toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1">Doanh thu</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>
              {stats.ordersGrowth !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  stats.ordersGrowth > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stats.ordersGrowth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stats.ordersGrowth).toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1">Đơn hàng</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalCustomers}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Giá trị TB</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.avgOrderValue)}</p>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Xu hướng doanh thu</h2>
            <button
              onClick={() => exportChart('revenue-chart', 'doanh-thu')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#175ead" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#175ead" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#175ead" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
                name="Doanh thu"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Doanh thu theo danh mục</h2>
              <button
                onClick={() => exportChart('category-chart', 'danh-muc')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Top 10 sản phẩm</h2>
              <button
                onClick={() => exportChart('product-chart', 'san-pham')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  width={100}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Person Performance (Admin only) */}
        {profile.role === 'admin' && salesPersonData.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Hiệu suất nhân viên</h2>
              <button
                onClick={() => exportChart('sales-chart', 'nhan-vien')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesPersonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: any, name?: string) => {
                    if (name === 'revenue') return formatCurrency(value)
                    return value
                  }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#175ead" name="Doanh thu" />
                <Bar dataKey="orders" fill="#10b981" name="Đơn hàng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
