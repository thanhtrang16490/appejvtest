import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react'

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/appejv-logo.png" 
                alt="APPE JV Logo" 
                className="w-12 h-12 object-contain bg-white rounded-lg p-2"
              />
              <div>
                <h3 className="text-xl font-bold">APPE JV Việt Nam</h3>
                <p className="text-blue-100 text-sm">Công ty Cổ phần APPE JV Việt Nam</p>
              </div>
            </div>
            <p className="text-blue-100 mb-4">
              Chuyên sản xuất và cung cấp thức ăn chăn nuôi và thủy sản chất lượng cao. 
              Thành lập từ 2008 với nhà máy hiện đại tại Hà Nam.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-blue-100 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-blue-100 hover:text-white transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/auth/customer-login" className="text-blue-100 hover:text-white transition-colors">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-blue-100 text-sm">
                  Km 50, Quốc lộ 1A, Phường Tiền Tân, TP. Phủ Lý, Hà Nam
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+84351359520" className="text-blue-100 hover:text-white transition-colors">
                  +84 3513 595 202/203
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@appe.com.vn" className="text-blue-100 hover:text-white transition-colors">
                  info@appe.com.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-blue-100 text-sm">
            © {currentYear} APPE JV Việt Nam. All rights reserved.
          </p>
          <p className="text-blue-200 text-xs mt-2">
            Công ty Cổ phần APPE JV Việt Nam - Thành lập năm 2008
          </p>
        </div>
      </div>
    </footer>
  )
}
