'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'
import { CustomerBottomNav } from './CustomerBottomNav'

interface ConditionalBottomNavProps {
  user: any
  role: string
}

export function ConditionalBottomNav({ user, role }: ConditionalBottomNavProps) {
  const pathname = usePathname()
  
  // Hide bottom nav on selling pages (both sales and customer)
  if (pathname === '/sales/selling' || pathname === '/customer/selling') {
    return null
  }
  
  // Check if user is on sales pages
  const isSalesUser = user && 
    pathname.startsWith('/sales') && 
    ['sale', 'admin', 'sale_admin'].includes(role)
  
  // Check if user is on customer pages
  const isCustomer = user && 
    pathname.startsWith('/customer') && 
    role === 'customer'

  // Show appropriate bottom nav
  if (isSalesUser) {
    return <BottomNav role={role} />
  }

  if (isCustomer) {
    return <CustomerBottomNav />
  }

  return null
}
