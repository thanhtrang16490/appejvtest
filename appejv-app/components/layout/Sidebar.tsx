'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Users, NotebookText, BarChart3, LayoutDashboard, LogOut, Sparkles, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { HeaderMenu } from './HeaderMenu'

const salesNavItems = [
    { name: 'Tổng quan', href: '/sales', icon: LayoutDashboard },
    { name: 'Đơn hàng', href: '/sales/orders', icon: NotebookText },
    { name: 'Bán hàng', href: '/sales/selling', icon: ShoppingCart },
    { name: 'Khách hàng', href: '/sales/customers', icon: Users },
    { name: 'Báo cáo', href: '/sales/reports', icon: BarChart3 },
]

interface SidebarProps {
  role?: string
  user?: any
}

export function Sidebar({ role = 'customer', user }: SidebarProps) {
    const pathname = usePathname()

    // Only show sidebar on desktop for sales pages and sales users
    const shouldShowSidebar = user && 
        pathname.startsWith('/sales') && 
        ['sale', 'admin', 'sale_admin'].includes(role)
    
    if (!shouldShowSidebar) {
        return null
    }

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg z-40">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img 
                        src="/appejv-logo.png" 
                        alt="APPE JV Logo" 
                        className="w-10 h-10 object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">APPE JV</h1>
                        <p className="text-xs text-gray-500">Hệ thống bán hàng</p>
                    </div>
                </div>
                <HeaderMenu user={user} role={role} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {salesNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/sales' && pathname.startsWith(item.href))
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-transform group-hover:scale-110",
                                isActive ? "text-white stroke-[2.5px]" : "text-gray-500"
                            )} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* AI Assistant Button */}
            <div className="px-4 pb-4">
                <Button className="w-full bg-gradient-to-r from-[#175ead] to-[#2575be] text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Trợ lý AI
                </Button>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <form action={logout}>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl py-3"
                    >
                        <LogOut className="h-5 w-5" />
                        Đăng xuất
                    </Button>
                </form>
            </div>
        </aside>
    )
}
