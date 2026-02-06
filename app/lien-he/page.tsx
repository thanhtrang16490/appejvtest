import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Youtube
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ - APPE JV Việt Nam',
  description: 'Liên hệ với APPE JV để được tư vấn về sản phẩm thức ăn chăn nuôi. Hotline: +84 3513 595 202/203, Email: info@appe.com.vn',
  openGraph: {
    title: 'Liên hệ - APPE JV Việt Nam',
    description: 'Liên hệ với chúng tôi để được tư vấn về sản phẩm thức ăn chăn nuôi chất lượng cao',
    url: 'https://appejv.app/lien-he',
  },
}

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Hotline',
      content: '+84 3513 595 202/203',
      link: 'tel:+84351359520',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@appe.com.vn',
      link: 'mailto:info@appe.com.vn',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: 'Km 50, QL1A, Phường Tiền Tân, TP. Phủ Lý, Hà Nam',
      link: 'https://maps.google.com/?q=Km+50+QL1A+Phu+Ly+Ha+Nam',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
      color: 'from-purple-500 to-purple-600'
    },
  ]

  const offices = [
    {
      name: 'Nhà máy Hà Nam',
      address: 'Km 50, Quốc lộ 1A, Phường Tiền Tân, TP. Phủ Lý, Hà Nam',
      phone: '+84 3513 595 202/203',
      email: 'info@appe.com.vn',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#175ead] to-[#2575be] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-600 hover:text-[#175ead] transition-colors text-sm"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm">{info.content}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <Input 
                        type="text" 
                        placeholder="Nhập họ và tên của bạn"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="0123 456 789"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chủ đề
                      </label>
                      <Input 
                        type="text" 
                        placeholder="Tư vấn sản phẩm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung *
                      </label>
                      <textarea 
                        className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#175ead]"
                        placeholder="Nhập nội dung tin nhắn..."
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#145a9d] hover:to-[#1e6aae] text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi tin nhắn
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Social Media */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h3>
                <div className="flex gap-3">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1877f2] hover:bg-[#145dbf] rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#ff0000] hover:bg-[#cc0000] rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://zalo.me" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#0068ff] hover:bg-[#0052cc] rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <MessageSquare className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map & Offices */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Địa điểm
              </h2>
              
              {/* Google Map Placeholder */}
              <div className="bg-gray-200 rounded-lg overflow-hidden mb-6 h-[300px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Google Maps</p>
                  <p className="text-sm">Km 50, QL1A, Phủ Lý, Hà Nam</p>
                </div>
              </div>

              {/* Office List */}
              <div className="max-w-2xl">
                {offices.map((office, index) => (
                  <Card key={index} className="border-2 border-[#2575be]/20 hover:border-[#2575be] transition-colors">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{office.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#175ead]" />
                          <span>{office.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0 text-[#175ead]" />
                          <a href={`tel:${office.phone}`} className="hover:text-[#175ead]">
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0 text-[#175ead]" />
                          <a href={`mailto:${office.email}`} className="hover:text-[#175ead]">
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#175ead] to-[#2575be] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cần tư vấn ngay?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+84351359520">
              <Button size="lg" className="bg-white text-[#175ead] hover:bg-blue-50">
                <Phone className="w-5 h-5 mr-2" />
                Gọi ngay: 0351 3595 202/203
              </Button>
            </a>
            <a href="mailto:info@appe.com.vn">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Mail className="w-5 h-5 mr-2" />
                Gửi email
              </Button>
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
