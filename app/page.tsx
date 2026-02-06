import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Award,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Quản lý đơn hàng",
      description: "Hệ thống quản lý đơn hàng hiện đại, theo dõi từ A-Z"
    },
    {
      icon: Users,
      title: "Quản lý khách hàng",
      description: "Dữ liệu khách hàng tập trung, phân tích hành vi mua sắm"
    },
    {
      icon: TrendingUp,
      title: "Báo cáo doanh thu",
      description: "Thống kê chi tiết, báo cáo theo thời gian thực"
    },
    {
      icon: Award,
      title: "Chất lượng cao",
      description: "Sản phẩm chất lượng cao, đảm bảo an toàn thực phẩm"
    }
  ];

  const products = [
    {
      name: "Thức ăn chăn nuôi cao cấp",
      description: "Dinh dưỡng hoàn hảo cho gia súc, gia cầm",
      image: "🌾"
    },
    {
      name: "Phụ gia thức ăn",
      description: "Tăng cường sức khỏe và năng suất",
      image: "💊"
    },
    {
      name: "Vitamin & khoáng chất",
      description: "Bổ sung dinh dưỡng thiết yếu",
      image: "🧪"
    }
  ];

  const stats = [
    { number: "500+", label: "Khách hàng tin tưởng" },
    { number: "10+", label: "Năm kinh nghiệm" },
    { number: "50+", label: "Sản phẩm chất lượng" },
    { number: "24/7", label: "Hỗ trợ khách hàng" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Giải pháp 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> thông minh</span>
            <br />cho chăn nuôi
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            APPE JV cung cấp hệ thống quản lý bán hàng hiện đại và sản phẩm thức ăn chăn nuôi chất lượng cao, 
            giúp tối ưu hóa hiệu quả kinh doanh của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/customer-login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                Khám phá sản phẩm
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                Dành cho nhân viên
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại sao chọn APPE JV?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến giải pháp toàn diện cho ngành chăn nuôi với công nghệ hiện đại
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sản phẩm chất lượng</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dòng sản phẩm thức ăn chăn nuôi cao cấp, đảm bảo dinh dưỡng tối ưu
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{product.image}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  <Button variant="outline" className="w-full">
                    Tìm hiểu thêm
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg text-center bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Hotline</h3>
                <p className="text-blue-600 font-semibold">1900 4512</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-green-600 font-semibold">info@appejv.com</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Địa chỉ</h3>
                <p className="text-purple-600 font-semibold">TP. Hồ Chí Minh</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">APPE JV</span>
              </div>
              <p className="text-gray-400">
                Giải pháp thông minh cho ngành chăn nuôi hiện đại
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Thức ăn chăn nuôi</li>
                <li>Phụ gia thức ăn</li>
                <li>Vitamin & khoáng chất</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Hướng dẫn sử dụng</li>
                <li>Chính sách bảo hành</li>
                <li>Liên hệ hỗ trợ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1900 4512</li>
                <li>✉️ info@appejv.com</li>
                <li>📍 TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 APPE JV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
