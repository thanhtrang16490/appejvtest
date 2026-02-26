'use client'

import { Bell, Home, Package, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext'

function CustomerNav() {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()

  const navItems = [
    { href: '/customer', icon: Home, label: 'Trang chủ' },
    { href: '/customer/products', icon: Package, label: 'Sản phẩm' },
    { href: '/customer/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { href: '/customer/account', icon: User, label: 'Tài khoản' },
  ]

  return (
    <>
      {/* Notification Button */}
      <Link
        href="/customer/notifications"
        className="fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] z-50">
        <div className="flex items-center justify-around h-full max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-[#175ead]' : 'text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-[#f0f9ff]">
        <main className="pb-[60px]">
          {children}
        </main>
        <CustomerNav />
      </div>
    </NotificationProvider>
  )
}
