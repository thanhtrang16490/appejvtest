'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutGrid,
  Receipt,
  ShoppingCart,
  Users,
  BarChart3,
} from 'lucide-react'

const NAV_ITEMS = [
  {
    href: '/sales',
    label: 'Tổng quan',
    icon: LayoutGrid,
  },
  {
    href: '/sales/orders',
    label: 'Đơn hàng',
    icon: Receipt,
  },
  {
    href: '/sales/selling',
    label: 'Bán hàng',
    icon: ShoppingCart,
  },
  {
    href: '/sales/customers',
    label: 'Khách hàng',
    icon: Users,
  },
  {
    href: '/sales/reports',
    label: 'Báo cáo',
    icon: BarChart3,
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Hide on selling page
  if (pathname?.includes('/selling')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around h-[60px] px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive ? 'text-[#175ead]' : 'text-gray-400'
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                'text-[11px] font-semibold',
                isActive && 'font-bold'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
