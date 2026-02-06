'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
    Menu, 
    X, 
    Home,
    Phone,
    User,
    Users,
    Info,
    ShoppingBag
} from 'lucide-react'

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/appejv-logo.png" 
            alt="APPE JV Logo" 
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#175ead] to-[#2575be] bg-clip-text text-transparent">
            APPE JV
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Trang chủ
          </Link>
          <Link href="/gioi-thieu" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Giới thiệu
          </Link>
          <Link href="/san-pham" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Sản phẩm
          </Link>
          <Link href="/lien-he" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Liên hệ
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <img 
                src="/appejv-logo.png" 
                alt="APPE JV Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">APPE JV</h2>
                <p className="text-xs text-gray-600">Thức ăn chăn nuôi chất lượng cao</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/50"
              onClick={closeMenu}
            >
              <X className="h-6 w-6 text-gray-600" />
            </Button>
          </div>

          {/* Drawer Content - Main Menu */}
          <div className="flex-1 px-4 py-6 bg-white">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Menu chính
            </h3>
            <nav className="space-y-2">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#175ead] transition-all group">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#175ead]/10 transition-colors">
                  <Home className="w-5 h-5 text-gray-600 group-hover:text-[#175ead]" />
                </div>
                <span className="font-medium">Trang chủ</span>
              </Link>
              <Link href="/gioi-thieu" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#175ead] transition-all group">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#175ead]/10 transition-colors">
                  <Info className="w-5 h-5 text-gray-600 group-hover:text-[#175ead]" />
                </div>
                <span className="font-medium">Giới thiệu</span>
              </Link>
              <Link href="/san-pham" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#175ead] transition-all group">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#175ead]/10 transition-colors">
                  <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-[#175ead]" />
                </div>
                <span className="font-medium">Sản phẩm</span>
              </Link>
              <Link href="/lien-he" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#175ead] transition-all group">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#175ead]/10 transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 group-hover:text-[#175ead]" />
                </div>
                <span className="font-medium">Liên hệ</span>
              </Link>
            </nav>
          </div>

          {/* Drawer Footer - Login Buttons */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
            <Link href="/auth/customer-login" onClick={closeMenu}>
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-2 border-[#2575be]/30 hover:bg-[#175ead]/5 hover:border-[#2575be] text-[#175ead] font-medium"
                size="lg"
              >
                <User className="w-5 h-5 mr-2" />
                Đăng nhập khách hàng
              </Button>
            </Link>
            <Link href="/auth/login" onClick={closeMenu}>
              <Button 
                className="w-full bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg font-medium" 
                size="lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Đăng nhập nhân viên
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}