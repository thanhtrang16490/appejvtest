'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { BarChart3, TrendingUp, Wallet, Package, Users, ChevronDown, X } from 'lucide-react'

const filterTabs = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'all', label: 'Tất cả' },
  { id: 'other', label: 'Khác' },
]

const timeRangeOptions = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'last_7_days', label: '7 ngày qua' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'last_month', label: 'Tháng trước' },
  { id: 'last_3_months', label: '3 tháng gần đây' },
  { id: 'this_quarter', label: 'Quý này' },
  { id: 'this_year', label: 'Năm nay' },
  { id: 'all', label: 'Tất cả' },
]

type ReportData = {
  name: string
  revenue: number
  quantity: number
}

type TrendData = {
  label: string
  revenue: number
}

type CustomerData = {
  id: string
  name: string
  revenue: number
  orderCount: number
}

type SaleData = {
  id: string
  name: string
  revenue: number
  orderCount: number
}

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('this_month')
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'product' | 'category'>('product')
  const [roleTab, setRoleTab] = useState<'customer' | 'sale' | 'saleadmin'>('customer')
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    byProduct: [] as ReportData[],
    byCategory: [] as ReportData[],
    byCustomer: [] as CustomerData[],
    bySale: [] as SaleData[],
    bySaleAdmin: [] as SaleData[],
    trend: [] as TrendData[],
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user, authLoading, period])

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

      // Fetch analytics
      const data = await getAnalytics(period, user!.id, profileData.role)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAnalytics = async (period: string, userId: string, role: string) => {
    const supabase = createClient()
    const isAdmin = role === 'admin'
    const isSale = role === 'sale'
    const isSaleAdmin = role === 'sale_admin'

    let managedSaleIds: string[] = []
    if (isSaleAdmin) {
      const { data: managedSales } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', userId)
      managedSaleIds = managedSales?.map(s => s.id) || []
    }

    let query = supabase
      .from('orders')
      .select(`
        id,
        created_at,
        customer_id,
        sale_id,
        status
      `)
      .neq('status', 'cancelled')

    if (isSale) {
      query = query.eq('sale_id', userId)
    } else if (isSaleAdmin) {
      query = query.in('sale_id', [userId, ...managedSaleIds])
    }

    // Apply date filter
    const now = new Date()
    if (period === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
      query = query.gte('created_at', startOfDay).lt('created_at', endOfDay)
    } else if (period === 'yesterday') {
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      query = query.gte('created_at', startOfYesterday).lt('created_at', endOfYesterday)
    } else if (period === 'last_7_days') {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      query = query.gte('created_at', date.toISOString())
    } else if (period === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfMonth)
    } else if (period === 'last_month') {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfLastMonth).lt('created_at', endOfLastMonth)
    } else if (period === 'last_3_months') {
      const date = new Date()
      date.setMonth(date.getMonth() - 2)
      const startOfPeriod = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfPeriod)
    } else if (period === 'this_quarter') {
      const quarter = Math.floor(now.getMonth() / 3)
      const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1).toISOString()
      query = query.gte('created_at', startOfQuarter)
    } else if (period === 'this_year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString()
      query = query.gte('created_at', startOfYear)
    }

    const { data: orders } = await query

    // Aggregate data
    const byProduct: Record<string, ReportData> = {}
    const byCategory: Record<string, ReportData> = {}
    const byCustomer: Record<string, CustomerData> = {}
    const bySale: Record<string, SaleData> = {}
    const bySaleAdmin: Record<string, SaleData> = {}
    const trendMap: Record<string, number> = {}
    let totalRevenue = 0

    if (orders && orders.length > 0) {
      // Fetch order items for all orders
      const orderIds = orders.map(o => o.id)
      const { data: allItems } = await supabase
        .from('order_items')
        .select('order_id, quantity, price_at_order, product:products(id, name, category_id)')
        .in('order_id', orderIds)

      // Fetch categories
      const categoryIds = [...new Set(allItems?.map((i: any) => i.product?.category_id).filter(Boolean))]
      let categoriesMap: any = {}
      if (categoryIds.length > 0) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds)
        categories?.forEach((c: any) => {
          categoriesMap[c.id] = c
        })
      }

      // Fetch profiles for customers and sales
      const customerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))]
      const saleIds = [...new Set(orders.map(o => o.sale_id).filter(Boolean))]
      const allProfileIds = [...new Set([...customerIds, ...saleIds])]

      let profilesMap: any = {}
      if (allProfileIds.length > 0 && isAdmin) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .in('id', allProfileIds)
        
        profiles?.forEach((p: any) => {
          profilesMap[p.id] = p
        })
      }

      // Group items by order
      const itemsByOrder: Record<string, any[]> = {}
      allItems?.forEach((item: any) => {
        if (!itemsByOrder[item.order_id]) {
          itemsByOrder[item.order_id] = []
        }
        itemsByOrder[item.order_id].push(item)
      })

      for (const order of orders) {
        const date = new Date(order.created_at)
        const monthLabel = date.toLocaleString('default', { month: 'short' })

        let orderTotal = 0
        const items = itemsByOrder[order.id] || []
        
        for (const item of items) {
          const productName = item.product?.name || 'Unknown'
          const categoryId = item.product?.category_id
          const categoryName = categoryId ? (categoriesMap[categoryId]?.name || 'Uncategorized') : 'Uncategorized'
          const revenue = (item.price_at_order || 0) * (item.quantity || 0)

          orderTotal += revenue
          totalRevenue += revenue

          // Product Aggregation
          if (!byProduct[productName]) {
            byProduct[productName] = { name: productName, revenue: 0, quantity: 0 }
          }
          byProduct[productName].revenue += revenue
          byProduct[productName].quantity += item.quantity

          // Category Aggregation
          if (!byCategory[categoryName]) {
            byCategory[categoryName] = { name: categoryName, revenue: 0, quantity: 0 }
          }
          byCategory[categoryName].revenue += revenue
          byCategory[categoryName].quantity += item.quantity
        }

        // Customer Aggregation (for admin only)
        if (isAdmin && order.customer_id) {
          if (!byCustomer[order.customer_id]) {
            byCustomer[order.customer_id] = {
              id: order.customer_id,
              name: profilesMap[order.customer_id]?.full_name || 'Unknown',
              revenue: 0,
              orderCount: 0
            }
          }
          byCustomer[order.customer_id].revenue += orderTotal
          byCustomer[order.customer_id].orderCount += 1
        }

        // Sale Aggregation (for admin only)
        if (isAdmin && order.sale_id) {
          const saleRole = profilesMap[order.sale_id]?.role
          
          // Aggregate by Sale (only role='sale')
          if (saleRole === 'sale') {
            if (!bySale[order.sale_id]) {
              bySale[order.sale_id] = {
                id: order.sale_id,
                name: profilesMap[order.sale_id]?.full_name || 'Unknown',
                revenue: 0,
                orderCount: 0
              }
            }
            bySale[order.sale_id].revenue += orderTotal
            bySale[order.sale_id].orderCount += 1
          }
          
          // Aggregate by Sale Admin (only role='sale_admin')
          if (saleRole === 'sale_admin') {
            if (!bySaleAdmin[order.sale_id]) {
              bySaleAdmin[order.sale_id] = {
                id: order.sale_id,
                name: profilesMap[order.sale_id]?.full_name || 'Unknown',
                revenue: 0,
                orderCount: 0
              }
            }
            bySaleAdmin[order.sale_id].revenue += orderTotal
            bySaleAdmin[order.sale_id].orderCount += 1
          }
        }

        // Trend
        trendMap[monthLabel] = (trendMap[monthLabel] || 0) + orderTotal
      }
    }

    return {
      totalRevenue,
      byProduct: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue),
      byCategory: Object.values(byCategory).sort((a, b) => b.revenue - a.revenue),
      byCustomer: Object.values(byCustomer).sort((a, b) => b.revenue - a.revenue),
      bySale: Object.values(bySale).sort((a, b) => b.revenue - a.revenue),
      bySaleAdmin: Object.values(bySaleAdmin).sort((a, b) => b.revenue - a.revenue),
      trend: Object.entries(trendMap).map(([label, revenue]) => ({ label, revenue })),
    }
  }

  const handleFilterChange = useCallback((filterId: string) => {
    if (filterId === 'other') {
      setShowTimeRangeModal(true)
    } else {
      setPeriod(filterId)
    }
  }, [])

  const handleTimeRangeSelect = useCallback((rangeId: string) => {
    setPeriod(rangeId)
    setShowTimeRangeModal(false)
  }, [])

  const isAdmin = profile?.role === 'admin'
  const isSaleAdmin = profile?.role === 'sale_admin'
  const { totalRevenue, byProduct, byCategory, byCustomer, bySale, bySaleAdmin, trend } = analytics
  
  const maxRevenue = useMemo(() => Math.max(...trend.map(t => t.revenue), 1), [trend])
  
  const displayData = useMemo(() => {
    return activeTab === 'product' ? byProduct.slice(0, 5) : byCategory.slice(0, 5)
  }, [activeTab, byProduct, byCategory])
  
  const roleData = useMemo(() => {
    if (roleTab === 'customer') return byCustomer.slice(0, 5)
    if (roleTab === 'sale') return bySale.slice(0, 5)
    return bySaleAdmin.slice(0, 5)
  }, [roleTab, byCustomer, bySale, bySaleAdmin])

  const maxDisplayRevenue = useMemo(() => {
    return displayData[0]?.revenue || 1
  }, [displayData])

  const maxRoleRevenue = useMemo(() => {
    return roleData[0]?.revenue || 1
  }, [roleData])

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
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isAdmin ? 'Toàn hệ thống' : isSaleAdmin ? 'Nhóm của bạn' : 'Của bạn'}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#175ead]" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-colors flex items-center gap-1',
                period === tab.id
                  ? 'bg-[#175ead] text-white border-[#175ead]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}
            >
              {tab.label}
              {tab.id === 'other' && (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>

        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-[#175ead] to-[#1e40af] rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-white/90 tracking-wider">TỔNG DOANH THU</p>
            <Wallet className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{formatCurrency(totalRevenue)}</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-white/80" />
            <p className="text-xs text-white/80">Dựa trên khoảng thời gian đã chọn</p>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Xu hướng doanh thu</h2>
          </div>
          <div className="h-40 flex items-end gap-1 px-1">
            {trend.length > 0 ? (
              trend.map((t, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-200 rounded-t-lg min-h-[4px]"
                    style={{ height: `${(t.revenue / maxRevenue) * 100}%` }}
                  />
                  <p className="text-[9px] font-bold text-gray-400 uppercase">{t.label}</p>
                </div>
              ))
            ) : (
              <p className="flex-1 text-center text-xs text-gray-400 italic">Chưa có đủ dữ liệu</p>
            )}
          </div>
        </div>

        {/* Product/Category Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex gap-1 p-1 bg-gray-50">
            <button
              onClick={() => setActiveTab('product')}
              className={cn(
                'flex-1 py-3 rounded-xl text-xs font-bold tracking-wide transition-colors',
                activeTab === 'product'
                  ? 'bg-[#175ead] text-white'
                  : 'text-gray-600'
              )}
            >
              SẢN PHẨM
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={cn(
                'flex-1 py-3 rounded-xl text-xs font-bold tracking-wide transition-colors',
                activeTab === 'category'
                  ? 'bg-[#175ead] text-white'
                  : 'text-gray-600'
              )}
            >
              DANH MỤC
            </button>
          </div>

          <div className="p-4 space-y-4">
            {displayData.length > 0 ? (
              displayData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${(item.revenue / maxDisplayRevenue) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{item.quantity} units</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(item.revenue)}</p>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Không có dữ liệu</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Only: Role-based Reports */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex gap-1 p-1 bg-gray-50">
              <button
                onClick={() => setRoleTab('customer')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-[10px] font-bold tracking-wide transition-colors',
                  roleTab === 'customer'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600'
                )}
              >
                KHÁCH HÀNG
              </button>
              <button
                onClick={() => setRoleTab('sale')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-[10px] font-bold tracking-wide transition-colors',
                  roleTab === 'sale'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600'
                )}
              >
                SALE
              </button>
              <button
                onClick={() => setRoleTab('saleadmin')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-[10px] font-bold tracking-wide transition-colors',
                  roleTab === 'saleadmin'
                    ? 'bg-[#175ead] text-white'
                    : 'text-gray-600'
                )}
              >
                SALE ADMIN
              </button>
            </div>

            <div className="p-4 space-y-4">
              {roleData.length > 0 ? (
                roleData.map((item: any, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full rounded-full',
                              roleTab === 'customer' && 'bg-emerald-400',
                              roleTab === 'sale' && 'bg-purple-400',
                              roleTab === 'saleadmin' && 'bg-blue-400'
                            )}
                            style={{ width: `${(item.revenue / maxRoleRevenue) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{item.orderCount} đơn</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(item.revenue)}</p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Time Range Modal */}
      {showTimeRangeModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center"
          onClick={() => setShowTimeRangeModal(false)}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Chọn thời gian</h3>
              <button
                onClick={() => setShowTimeRangeModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTimeRangeSelect(option.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors',
                    period === option.id && 'bg-blue-50'
                  )}
                >
                  <span className={cn(
                    'text-base',
                    period === option.id ? 'text-[#175ead] font-semibold' : 'text-gray-700'
                  )}>
                    {option.label}
                  </span>
                  {period === option.id && (
                    <div className="w-5 h-5 bg-[#175ead] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
