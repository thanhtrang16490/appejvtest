'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Home, ShoppingCart, Package, BarChart3, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export default function WarehouseMenuPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      {/* User Info Card */}
      <div className="bg-white p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user?.full_name ? getInitials(user.full_name) : 'W'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.full_name || 'Warehouse'}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
              Kho
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
          Chức năng chính
        </h3>

        <Link href="/warehouse">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Tổng quan</p>
              <p className="text-xs text-gray-500">Dashboard kho hàng</p>
            </div>
          </div>
        </Link>

        <Link href="/warehouse/orders">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Đơn hàng chờ xuất</p>
              <p className="text-xs text-gray-500">Xử lý đơn hàng</p>
            </div>
          </div>
        </Link>

        <Link href="/warehouse/products">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Sản phẩm</p>
              <p className="text-xs text-gray-500">Quản lý tồn kho</p>
            </div>
          </div>
        </Link>

        <Link href="/warehouse/reports">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Báo cáo</p>
              <p className="text-xs text-gray-500">Thống kê kho hàng</p>
            </div>
          </div>
        </Link>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2 pt-4">
          Tài khoản
        </h3>

        <Link href="/sales/profile">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Thông tin cá nhân</p>
              <p className="text-xs text-gray-500">Xem và chỉnh sửa</p>
            </div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900">Đăng xuất</p>
            <p className="text-xs text-gray-500">Thoát khỏi tài khoản</p>
          </div>
        </button>
      </div>
    </div>
  )
}
