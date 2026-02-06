'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    Menu, 
    X, 
    Package, 
    Settings, 
    Users, 
    FileText, 
    Shield,
    LogOut,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logout } from '@/app/auth/actions'

const menuItems = [
    { name: 'Kho hàng', href: '/sales/inventory', icon: Package, description: 'Quản lý tồn kho', roles: ['admin', 'sale', 'sale_admin'] },
    { name: 'Quản lý người dùng', href: '/sales/users', icon: Users, description: 'Thêm, sửa người dùng', roles: ['admin'] },
    { name: 'Lịch sử thao tác', href: '/sales/audit-logs', icon: Shield, description: 'Xem nhật ký hệ thống', roles: ['admin'] },
    { name: 'Cài đặt', href: '/sales/settings', icon: Settings, description: 'Cấu hình hệ thống', roles: ['admin', 'sale_admin'] },
    { name: 'Báo cáo chi tiết', href: '/sales/detailed-reports', icon: FileText, description: 'Báo cáo nâng cao', roles: ['admin', 'sale_admin'] },
]

interface HeaderMenuProps {
    user?: any
    role?: string
}

export function HeaderMenu({ user, role }: HeaderMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
    }

    return (
        <>
            {/* Menu Button */}
            <Button 
                size="sm" 
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full hover:bg-white/20"
                onClick={toggleMenu}
            >
                <Menu className="w-5 h-5 text-gray-700" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
                    onClick={closeMenu}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                        <p className="text-sm text-gray-500">Các chức năng bổ sung</p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full hover:bg-white/50"
                        onClick={closeMenu}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 py-6 bg-white">
                    <h3 className="px-8 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Chức năng
                    </h3>
                    <nav className="space-y-2 px-4">
                        {menuItems
                            .filter(item => !role || item.roles.includes(role))
                            .map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-100"
                                                : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isActive 
                                                ? "bg-blue-100 text-blue-600" 
                                                : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                                        )}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                )
                            })}
                    </nav>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <form action={logout}>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl py-3 h-auto"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Đăng xuất</span>
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}