import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

async function getAnalyticsData() {
  const supabase = await createClient()

  // Get date ranges (current month vs previous month)
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthEnd = currentMonthStart

  // Current month revenue
  const { data: currentRevenue } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')
    .gte('created_at', currentMonthStart.toISOString())

  // Previous month revenue
  const { data: previousRevenue } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')
    .gte('created_at', previousMonthStart.toISOString())
    .lt('created_at', previousMonthEnd.toISOString())

  const currentRevenueTotal = currentRevenue?.reduce((sum, o: any) => sum + (o.total_amount || 0), 0) || 0
  const previousRevenueTotal = previousRevenue?.reduce((sum, o: any) => sum + (o.total_amount || 0), 0) || 0
  const revenueChange = previousRevenueTotal > 0 
    ? ((currentRevenueTotal - previousRevenueTotal) / previousRevenueTotal) * 100 
    : 0

  // Orders
  const currentOrdersCount = currentRevenue?.length || 0
  const previousOrdersCount = previousRevenue?.length || 0
  const ordersChange = previousOrdersCount > 0
    ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100
    : 0

  // Average order value
  const avgCurrent = currentOrdersCount > 0 ? currentRevenueTotal / currentOrdersCount : 0
  const avgPrevious = previousOrdersCount > 0 ? previousRevenueTotal / previousOrdersCount : 0
  const avgChange = avgPrevious > 0 ? ((avgCurrent - avgPrevious) / avgPrevious) * 100 : 0

  // Top products
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      product_id,
      quantity,
      products (name, price)
    `)
    .gte('created_at', currentMonthStart.toISOString())

  const productSales = orderItems?.reduce((acc: any, item: any) => {
    const id = item.product_id
    if (!acc[id]) {
      acc[id] = {
        name: item.products?.name || 'Unknown',
        quantity: 0,
        revenue: 0
      }
    }
    acc[id].quantity += item.quantity
    acc[id].revenue += item.quantity * (item.products?.price || 0)
    return acc
  }, {})

  const topProducts = Object.values(productSales || {})
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5)

  return {
    revenue: { current: currentRevenueTotal, previous: previousRevenueTotal, change: revenueChange },
    orders: { current: currentOrdersCount, previous: previousOrdersCount, change: ordersChange },
    avgOrderValue: { current: avgCurrent, previous: avgPrevious, change: avgChange },
    topProducts
  }
}

function MetricCard({ title, value, change, icon: Icon }: any) {
  const isPositive = change >= 0
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData()

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Phân tích dữ liệu</h1>
        <p className="text-gray-500 mt-1">So sánh tháng này với tháng trước</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Doanh thu"
          value={formatCurrency(analytics.revenue.current)}
          change={analytics.revenue.change}
          icon={DollarSign}
        />
        <MetricCard
          title="Đơn hàng"
          value={analytics.orders.current}
          change={analytics.orders.change}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Giá trị TB/đơn"
          value={formatCurrency(analytics.avgOrderValue.current)}
          change={analytics.avgOrderValue.change}
          icon={TrendingUp}
        />
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            Sản phẩm bán chạy (Tháng này)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-4">
              {analytics.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantity} đã bán</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
