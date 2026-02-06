import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <PublicHeader />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#175ead] to-[#2575be] leading-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-[#175ead]/10 to-[#2575be]/10 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Không tìm thấy trang
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#145a9d] hover:to-[#1e6aae] text-white"
              >
                <Home className="w-5 h-5 mr-2" />
                Về trang chủ
              </Button>
            </Link>
            <Link href="/san-pham">
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#175ead] text-[#175ead] hover:bg-[#175ead] hover:text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Xem sản phẩm
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Hoặc truy cập các trang sau:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/gioi-thieu" className="text-[#175ead] hover:text-[#2575be] font-medium">
                Giới thiệu
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/san-pham" className="text-[#175ead] hover:text-[#2575be] font-medium">
                Sản phẩm
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/lien-he" className="text-[#175ead] hover:text-[#2575be] font-medium">
                Liên hệ
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/auth/customer-login" className="text-[#175ead] hover:text-[#2575be] font-medium">
                Đăng nhập
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+84351359520" className="text-[#175ead] hover:text-[#2575be] font-semibold">
                📞 0351 3595 202/203
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a href="mailto:info@appe.com.vn" className="text-[#175ead] hover:text-[#2575be] font-semibold">
                ✉️ info@appe.com.vn
              </a>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
