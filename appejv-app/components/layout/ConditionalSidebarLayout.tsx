'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ConditionalSidebarLayoutProps {
  children: React.ReactNode
  user: any
  role: string
}

export function ConditionalSidebarLayout({ children, user, role }: ConditionalSidebarLayoutProps) {
  const pathname = usePathname()
  
  // Only add left padding on sales pages for sales users (where sidebar shows)
  const shouldHaveSidebarPadding = user && 
    pathname.startsWith('/sales') && 
    ['sale', 'admin', 'sale_admin'].includes(role)

  return (
    <div className={cn("min-h-screen", shouldHaveSidebarPadding ? "md:pl-64" : "")}>
      {children}
    </div>
  )
}
