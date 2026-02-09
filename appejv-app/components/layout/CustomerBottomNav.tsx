'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, FileText, User, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

const customerNavItems = [
    { name: 'Trang chủ', href: '/customer/dashboard', icon: Home },
    { name: 'Đơn hàng', href: '/customer/orders', icon: FileText },
    { name: 'Đặt hàng', href: '/customer/selling', icon: ShoppingCart, isCenter: true },
    { name: 'Sản phẩm', href: '/customer/products', icon: ShoppingBag },
    { name: 'Tài khoản', href: '/customer/account', icon: User },
]

export function CustomerBottomNav() {
    const pathname = usePathname()

    // Don't show on auth pages
    if (pathname.startsWith('/auth')) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
            <nav className="flex items-center justify-between px-4 py-2 h-20">
                {customerNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/customer/dashboard' && pathname.startsWith(item.href))
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
                                            ? "h-6 w-6 text-[#175ead] stroke-[2.5px]"
                                            : "h-6 w-6 text-gray-400"
                                )} />
                                {!isCenter && (
                                    <span className={cn(
                                        "text-[11px] font-medium leading-none truncate w-full text-center mt-1.5",
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
    )
}
