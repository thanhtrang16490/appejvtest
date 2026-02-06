import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Factory, 
  Award, 
  Users, 
  TrendingUp, 
  Shield,
  Leaf,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu về APPE JV',
  description: 'APPE (Appe JSC) là công ty quốc tế hoạt động trong lĩnh vực sản xuất thức ăn chăn nuôi, với nhà máy hiện đại tại Hà Nam, tổng công suất 400.000 tấn/năm.',
  openGraph: {
    title: 'Giới thiệu về APPE JV Việt Nam',
    description: 'Công ty quốc tế chuyên sản xuất thức ăn chăn nuôi với công suất 400.000 tấn/năm',
    url: 'https://appejv.app/gioi-thieu',
  },
}

export default function AboutPage() {
  const stats = [
    { icon: Factory, label: 'Nhà máy', value: '01', color: 'from-[#175ead] to-[#2575be]' },
    { icon: TrendingUp, label: 'Công suất/năm', value: '400K+', unit: 'tấn', color: 'from-[#2575be] to-[#3d8dd1]' },
    { icon: Award, label: 'Sản phẩm', value: '49+', color: 'from-[#175ead] to-[#2575be]' },
    { icon: Users, label: 'Kinh nghiệm', value: '15+', unit: 'năm', color: 'from-[#2575be] to-[#3d8dd1]' },
  ]

  const factories = [
    { name: 'Nhà máy Hà Nam', location: 'Km 50, QL1A, Phủ Lý, Hà Nam' },
  ]

  const features = [
    {
      icon: Shield,
      title: 'An toàn - Chất lượng cao',
      description: 'Sản phẩm đạt tiêu chuẩn an toàn thực phẩm, chất lượng cao với giá cả hợp lý',
    },
    {
      icon: Leaf,
      title: 'Nguyên liệu chất lượng',
      description: 'Sử dụng nguồn nguyên liệu thô chất lượng cao, bổ sung đầy đủ khoáng chất và dinh dưỡng',
    },
    {
      icon: Globe,
      title: 'Công nghệ tiên tiến',
      description: 'Ứng dụng công nghệ sản xuất tiên tiến từ Hoa Kỳ, kiểm soát nghiêm ngặt toàn bộ quy trình',
    },
  ]

  const products = [
    { name: 'Thức ăn cho lợn', description: 'Đa dạng sản phẩm cho từng giai đoạn phát triển' },
    { name: 'Thức ăn cho gia cầm', description: 'Công thức dinh dưỡng tối ưu cho gà, vịt' },
    { name: '49 sản phẩm khác nhau', description: 'Đáp ứng nhiều mô hình chăn nuôi' },
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
              Giới thiệu về APPE
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Công ty quốc tế chuyên sản xuất thức ăn chăn nuôi chất lượng cao
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Factory className="w-5 h-5" />
                <span className="font-semibold">Nhà máy Hà Nam</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">400.000+ tấn/năm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  {stat.unit && (
                    <div className="text-sm text-gray-500 mb-2">{stat.unit}</div>
                  )}
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
              Tổng quan
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-12">
              <strong>APPE (Appe JSC)</strong> là công ty quốc tế hoạt động trong lĩnh vực <strong>sản xuất thức ăn chăn nuôi</strong>, 
              với định hướng cung cấp các sản phẩm <strong>an toàn – chất lượng cao – giá cả hợp lý</strong> cho thị trường chăn nuôi, 
              đặc biệt tại khu vực phía Bắc Việt Nam.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Factories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Quy mô & Năng lực sản xuất
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Tổng công suất sản xuất trên <strong className="text-[#175ead]">400.000 tấn/năm</strong>
            </p>

            <div className="max-w-2xl mx-auto">
              {factories.map((factory, index) => (
                <Card key={index} className="border-2 border-[#2575be]/20 hover:border-[#2575be] transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Factory className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{factory.name}</h3>
                        <p className="text-gray-600 flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#175ead]" />
                          {factory.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Sản phẩm
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Đa dạng các dòng thức ăn chăn nuôi phù hợp cho từng giai đoạn phát triển
            </p>

            <div className="space-y-4">
              {products.map((product, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-gradient-to-r from-[#175ead] to-[#2575be] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Công nghệ & Kiểm soát chất lượng
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Ứng dụng công nghệ sản xuất tiên tiến từ Hoa Kỳ
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Phối trộn nguyên liệu</h3>
                <p className="text-blue-100">Kiểm soát chính xác tỷ lệ và chất lượng</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Kiểm soát nhiệt độ</h3>
                <p className="text-blue-100">Đảm bảo chất lượng sản phẩm ổn định</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Ép viên & Hoàn thiện</h3>
                <p className="text-blue-100">Quy trình khép kín, hiện đại</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farm to Fork Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Triết lý "Farm to Fork"
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  APPE theo đuổi mô hình <strong>"Farm to Fork"</strong>, kiểm soát xuyên suốt chuỗi giá trị 
                  từ nguyên liệu thức ăn chăn nuôi, đến quá trình sản xuất – phân phối, và cuối cùng là thực phẩm trên bàn ăn.
                </p>
                <p className="text-xl font-semibold text-[#175ead]">
                  Đảm bảo chất lượng và an toàn thực phẩm từ nông trại đến người tiêu dùng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Thông tin liên hệ
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[#2575be]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[#175ead] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Địa chỉ</h3>
                      <p className="text-gray-600">
                        Km 50, Quốc lộ 1A<br />
                        Phường Tiền Tân, TP. Phủ Lý<br />
                        Hà Nam, Việt Nam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#2575be]/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Phone className="w-6 h-6 text-[#175ead] flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg mb-1">Điện thoại</h3>
                        <a href="tel:+84351359520" className="text-gray-600 hover:text-[#175ead]">
                          +84 3513 595 202/203
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="w-6 h-6 text-[#175ead] flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg mb-1">Email</h3>
                        <a href="mailto:info@appe.com.vn" className="text-gray-600 hover:text-[#175ead]">
                          info@appe.com.vn
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
