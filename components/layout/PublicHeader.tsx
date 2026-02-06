'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
    Menu, 
    X, 
    Home,
    Package,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    User,
    Users,
    Info,
    ShoppingBag
} from 'lucide-react'

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const menuSections = [
    {
      title: 'Khám phá',
      items: [
        { href: '/', label: 'Trang chủ', icon: Home, description: 'Về trang chủ' },
        { href: '/san-pham', label: 'Sản phẩm', icon: ShoppingBag, description: 'Xem danh mục sản phẩm' },
        { href: '#about', label: 'Giới thiệu', icon: Info, description: 'Về chúng tôi' },
      ]
    },
    {
      title: 'Liên hệ',
      items: [
        { href: 'tel:19004512', label: 'Hotline: 1900 4512', icon: Phone, description: 'Gọi ngay' },
        { href: 'mailto:info@appejv.com', label: 'Email hỗ trợ', icon: Mail, description: 'info@appejv.com' },
        { href: '#location', label: 'Địa chỉ', icon: MapPin, description: 'Tìm cửa hàng gần bạn' },
      ]
    }
  ]

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
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            APPE JV
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Trang chủ
          </Link>
          <Link href="/san-pham" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Sản phẩm
          </Link>
          <a href="#about" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Giới thiệu
          </a>
          <a href="#contact" className="text-gray-600 hover:text-[#175ead] transition-colors font-medium">
            Liên hệ
          </a>
          <Link href="/auth/customer-login">
            <Button variant="outline" className="rounded-full">
              <User className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
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
        "fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <img 
                src="/appejv-logo.png" 
                alt="APPE JV Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">APPE JV</h2>
                <p className="text-xs text-gray-600">Hệ thống bán hàng</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/50"
              onClick={closeMenu}
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="py-4">
                <h3 className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <nav className="space-y-1 px-3">
                  {section.items.map((item, itemIndex) => (
                    item.href.startsWith('#') ? (
                      <a
                        key={itemIndex}
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#175ead] transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#175ead]/10 transition-colors">
                          <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#175ead]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#175ead]" />
                      </a>
                    ) : (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#175ead] transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#175ead]/10 transition-colors">
                          <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#175ead]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#175ead]" />
                      </Link>
                    )
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Drawer Footer - Login Buttons */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
            <Link href="/auth/customer-login" onClick={closeMenu}>
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-2 border-[#2575be]/30 hover:bg-[#175ead]/5 hover:border-[#2575be] text-[#175ead] font-medium"
                size="lg"
              >
                <User className="w-4 h-4 mr-2" />
                Đăng nhập khách hàng
              </Button>
            </Link>
            <Link href="/auth/login" onClick={closeMenu}>
              <Button 
                className="w-full bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg font-medium" 
                size="lg"
              >
                <Users className="w-4 h-4 mr-2" />
                Đăng nhập nhân viên
              </Button>
            </Link>
          </div>

          {/* Contact Info Footer */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 text-center border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Hỗ trợ 24/7</p>
            <p className="text-sm font-semibold text-gray-900">📞 1900 4512</p>
            <p className="text-xs text-gray-500 mt-1">✉️ info@appejv.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}