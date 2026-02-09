'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'

interface ConditionalBottomNavProps {
  user: any
  role: string
}

export function ConditionalBottomNav({ user, role }: ConditionalBottomNavProps) {
  const pathname = usePathname()
  
  // Hide bottom nav on selling page
  if (pathname === '/sales/selling') {
    return null
  }
  
  // Only show BottomNav on sales pages and for sales users
  const shouldShowBottomNav = user && 
    pathname.startsWith('/sales') && 
    ['sale', 'admin', 'sale_admin'].includes(role)

  if (!shouldShowBottomNav) {
    return null
  }

  return <BottomNav role={role} />
}
