import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { EcosystemOrbit3D } from "@/components/ecosystem/EcosystemOrbit3D";
import { 
  Award,
  ArrowRight,
  Fish,
  Bird,
  Beef,
  Globe,
  Target,
  Heart
} from "lucide-react";

export default function Home() {
  const ecosystem = [
    {
      name: "A Group",
      logo: "/appejv-logo.png",
      description: "Tập đoàn hàng đầu trong lĩnh vực nông nghiệp và thực phẩm",
      isParent: true
    },
    {
      name: "APPE",
      logo: "/appe-logo.png",
      description: "Thức ăn chăn nuôi chất lượng cao"
    },
    {
      name: "AFARM",
      logo: "/afarm-logo.png",
      description: "Trang trại chăn nuôi công nghệ cao"
    },
    {
      name: "AFOOD",
      logo: "/afood-logo.png",
      description: "Chế biến thực phẩm an toàn"
    },
    {
      name: "AGRIL",
      logo: "/agril-logo.png",
      description: "Chuỗi nhà hàng 5 sao"
    },
    {
      name: "APHAMA",
      logo: "/aphama-logo.png",
      description: "Dược thú y và sinh học"
    },
    {
      name: "AVAC",
      logo: "/avac-logo.png",
      description: "Vaccine và sinh phẩm"
    }
  ]

  const features = [
    {
      icon: Award,
      title: "Chất lượng cao",
      description: "Sản phẩm đạt tiêu chuẩn quốc tế, đảm bảo an toàn và hiệu quả"
    },
    {
      icon: Target,
      title: "Công nghệ tiên tiến",
      description: "Ứng dụng công nghệ và tiêu chuẩn sản xuất hiện đại"
    },
    {
      icon: Heart,
      title: "Đồng hành bền vững",
      description: "Cam kết phát triển bền vững cùng khách hàng và đối tác"
    },
    {
      icon: Globe,
      title: "Xuất khẩu quốc tế",
      description: "Sản phẩm được xuất khẩu sang thị trường Lào và khu vực"
    }
  ];

  const products = [
    {
      name: "Pig Feed",
      title: "Thức ăn cho heo",
      description: "Công thức dinh dưỡng tối ưu cho từng giai đoạn phát triển, hỗ trợ tăng trưởng và sức đề kháng",
      icon: Beef,
      color: "from-pink-500 to-red-500"
    },
    {
      name: "Poultry Feed",
      title: "Thức ăn cho gia cầm",
      description: "Dinh dưỡng cân bằng cho gà, vịt, giúp vật nuôi khỏe mạnh và phát triển đồng đều",
      icon: Bird,
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Fish Feed",
      title: "Thức ăn cho thủy sản",
      description: "Đáp ứng nhu cầu nuôi trồng thủy sản trong nước và xuất khẩu sang Lào",
      icon: Fish,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const stats = [
    { number: "2008", label: "Năm thành lập" },
    { number: "15+", label: "Năm kinh nghiệm" },
    { number: "3", label: "Dòng sản phẩm chính" },
    { number: "24/7", label: "Hỗ trợ khách hàng" }
  ];

  const values = [
    {
      title: "Tầm nhìn",
      description: "Trở thành doanh nghiệp uy tín trong lĩnh vực sản xuất thức ăn chăn nuôi và thủy sản tại Việt Nam và khu vực",
      icon: Target
    },
    {
      title: "Sứ mệnh",
      description: "Cung cấp sản phẩm chất lượng cao, ổn định, ứng dụng công nghệ tiên tiến và đồng hành cùng khách hàng phát triển bền vững",
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full text-sm font-semibold text-gray-700 mb-4">
              Công ty Cổ phần APPE JV Việt Nam
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Giải pháp 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#175ead] to-[#2575be]"> dinh dưỡng</span>
            <br />cho chăn nuôi & thủy sản
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            APPE (A Group) chuyên sản xuất và cung cấp thức ăn chăn nuôi và thủy sản chất lượng cao, 
            giúp nâng cao hiệu quả chăn nuôi tại Việt Nam và khu vực.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/san-pham">
              <Button size="lg" className="bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                Khám phá sản phẩm
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/customer-login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                Đăng nhập khách hàng
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

      {/* Vision & Mission */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tầm nhìn & Sứ mệnh</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Video */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Khám phá APPE JV</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu về hành trình và cam kết của chúng tôi trong việc cung cấp thức ăn chăn nuôi chất lượng cao
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Wu_9WTZPMwY?si=GbagrIg01IBKqdse"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* A Group Ecosystem */}
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hệ sinh thái A Group</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              APPE là thành viên của hệ sinh thái A Group - tập đoàn hàng đầu trong lĩnh vực nông nghiệp, 
              chăn nuôi và thực phẩm tại Việt Nam
            </p>
          </div>

          {/* 3D Orbital Ecosystem Visualization with Three.js */}
          <EcosystemOrbit3D brands={ecosystem} />

          {/* Brand Cards Below */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            {ecosystem.filter(b => !b.isParent).map((brand, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-[#2575be] hover:shadow-lg transition-all bg-white">
                <CardContent className="p-3 text-center aspect-[16/9] flex flex-col items-center justify-center gap-0">
                  <div className="w-32 h-32 mx-auto flex items-center justify-center">
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{brand.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Cùng nhau xây dựng chuỗi giá trị nông nghiệp bền vững từ trang trại đến bàn ăn
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#175ead]"></span>
              <span className="font-semibold text-[#175ead]">Farm to Fork</span>
              <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#175ead]"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại sao chọn APPE?</h2>
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
      <section id="products" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dòng sản phẩm thức ăn chăn nuôi và thủy sản chất lượng cao, đảm bảo dinh dưỡng tối ưu
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${product.color}`}></div>
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${product.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <product.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-sm font-semibold text-gray-500 mb-2">{product.name}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h3>
                  </div>
                  <p className="text-gray-600 text-center mb-6">{product.description}</p>
                  <Link href="/san-pham">
                    <Button variant="outline" className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
