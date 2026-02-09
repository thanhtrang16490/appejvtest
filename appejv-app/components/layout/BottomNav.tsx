'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ShoppingCart, User, Menu, LayoutDashboard, Users, NotebookText, BarChart3, FileText, Wallet, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CartSheet } from '@/components/cart/CartSheet'

// Define navigation items for different roles
const salesNavItems = [
    { name: 'Tổng quan', href: '/sales', icon: LayoutDashboard },
    { name: 'Đơn hàng', href: '/sales/orders', icon: NotebookText },
    { name: 'Bán hàng', href: '/sales/selling', icon: ShoppingCart, isCenter: true },
    { name: 'Khách hàng', href: '/sales/customers', icon: Users },
    { name: 'Báo cáo', href: '/sales/reports', icon: BarChart3 },
]

export function BottomNav({ role = 'sale' }: { role?: string }) {
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    // Always use sales nav items since this component only shows on sales pages
    const navItems = salesNavItems

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY < lastScrollY) {
                    // Scrolling up - HIDE navbar
                    setIsVisible(false)
                } else {
                    // Scrolling down - SHOW navbar
                    setIsVisible(true)
                }
                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar)
            return () => {
                window.removeEventListener('scroll', controlNavbar)
            }
        }
    }, [lastScrollY])

    if (pathname.startsWith('/auth')) return null

    // Only show on mobile (hidden on md and up)
    return (
        <div className="md:hidden">
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] border-t bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-transform duration-300",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}>
                <nav className="flex items-center justify-between px-4 py-2 h-20">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        const isCenter = (item as any).isCenter
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 min-w-0 transition-all active:scale-90",
                                    isCenter && "relative -mt-6"
                                )}
                            >
                                <div className={cn(
                                    "flex flex-col items-center justify-center transition-all",
                                    isCenter 
                                        ? "w-14 h-14 bg-[#175ead] rounded-full shadow-lg"
                                        : "py-2"
                                )}>
                                    <item.icon className={cn(
                                        "transition-all",
                                        isCenter 
                                            ? "h-6 w-6 text-white"
                                            : isActive
                                                ? "h-5 w-5 text-[#175ead] stroke-[2.5px]"
                                                : "h-5 w-5 text-gray-400"
                                    )} />
                                    {!isCenter && (
                                        <span className={cn(
                                            "text-[10px] font-medium leading-none truncate w-full text-center mt-1",
                                            isActive ? "text-[#175ead]" : "text-gray-400"
                                        )}>
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                                {isCenter && (
                                    <span className="text-[10px] font-medium text-gray-600 mt-1">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
