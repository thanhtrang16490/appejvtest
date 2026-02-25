'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  UserPlus, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock,
  Tag,
  Settings,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalCustomers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
  }
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Tổng quan hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nhân viên</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <Link href="/admin/users">
              <Button variant="link" className="px-0 mt-4 text-red-600">
                Quản lý →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Khách hàng</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalCustomers}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Link href="/sales/customers">
              <Button variant="link" className="px-0 mt-4 text-green-600">
                Xem danh sách →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Link href="/sales/inventory">
              <Button variant="link" className="px-0 mt-4 text-blue-600">
                Quản lý kho →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <Link href="/sales/orders">
              <Button variant="link" className="px-0 mt-4 text-amber-600">
                Xem đơn hàng →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-900">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-sm text-green-700 mt-2">
              Từ {stats.totalOrders} đơn hàng đã hoàn thành
            </p>
            <Link href="/admin/analytics">
              <Button variant="outline" className="mt-4 border-green-300 text-green-700 hover:bg-green-100">
                <TrendingUp className="w-4 h-4 mr-2" />
                Xem phân tích chi tiết
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-900">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              Đơn chờ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-600">
              {stats.pendingOrders}
            </p>
            <p className="text-sm text-amber-700 mt-2">
              Cần xử lý ngay
            </p>
            <Link href="/sales/orders?status=pending">
              <Button variant="outline" className="mt-4 border-amber-300 text-amber-700 hover:bg-amber-100">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Xử lý đơn hàng
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <UserPlus className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium">Thêm nhân viên</span>
              </Button>
            </Link>

            <Link href="/admin/categories">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Tag className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium">Quản lý danh mục</span>
              </Button>
            </Link>

            <Link href="/admin/settings">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Settings className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium">Cài đặt hệ thống</span>
              </Button>
            </Link>

            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <BarChart3 className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium">Xem phân tích</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
