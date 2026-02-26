'use client'

import { Home, Package, ShoppingCart, BarChart3, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'

export default function WarehouseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/warehouse', icon: Home, label: 'Tổng quan' },
    { href: '/warehouse/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { href: '/warehouse/products', icon: Package, label: 'Sản phẩm' },
    { href: '/warehouse/reports', icon: BarChart3, label: 'Báo cáo' },
    { href: '/warehouse/menu', icon: Menu, label: 'Menu' },
  ]

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      <AppHeader />
      
      <main className="pb-[60px]">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] z-50">
        <div className="flex items-center justify-around h-full max-w-5xl mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-amber-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
