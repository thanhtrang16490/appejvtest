import { useState } from 'react'

interface Brand {
  name: string
  logo: string
  description: string
  isParent?: boolean
  fullDescription?: string
  services?: string[]
  website?: string
  contact?: string
}

interface EcosystemModalProps {
  brands: Brand[]
}

export default function EcosystemModal({ brands }: EcosystemModalProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const brandDetails: Record<string, {
    fullDescription: string
    services: string[]
    website?: string
    highlights: string[]
  }> = {
    'A Group': {
      fullDescription: 'Tập đoàn A Group là tập đoàn hàng đầu trong lĩnh vực nông nghiệp, chăn nuôi và thực phẩm tại Việt Nam. Với hệ sinh thái khép kín từ trang trại đến bàn ăn, A Group cam kết mang đến sản phẩm chất lượng cao và an toàn cho người tiêu dùng.',
      services: [
        'Quản lý và điều hành toàn bộ hệ sinh thái',
        'Đầu tư phát triển công nghệ',
        'Xây dựng chuỗi giá trị bền vững',
        'Mở rộng thị trường quốc tế'
      ],
      highlights: [
        '7 thương hiệu thành viên',
        'Hệ sinh thái khép kín Farm to Fork',
        'Xuất khẩu sang nhiều quốc gia',
        'Đối tác chiến lược hàng đầu'
      ]
    },
    'APPE': {
      fullDescription: 'APPE JV chuyên sản xuất thức ăn chăn nuôi và thủy sản chất lượng cao. Với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm, APPE cam kết cung cấp sản phẩm đạt tiêu chuẩn quốc tế, giúp tối ưu hiệu quả chăn nuôi.',
      services: [
        'Thức ăn cho heo các giai đoạn',
        'Thức ăn cho gia cầm (gà, vịt, ngan)',
        'Thức ăn cho thủy sản',
        'Tư vấn kỹ thuật chăn nuôi'
      ],
      website: 'https://appejv.com',
      highlights: [
        'ISO 9001:2015 & HACCP',
        '50,000+ tấn/năm',
        '1,500+ khách hàng',
        'Xuất khẩu sang Lào'
      ]
    },
    'AFARM': {
      fullDescription: 'Công ty Cổ phần AFARM (MST: 0900301560) - thành viên của A Group, chuyên chăn nuôi heo, gia cầm và thủy sản công nghệ cao. Thành lập từ năm 2008, với trang trại hiện đại tại Khu công nghiệp Phố Nối A, Hưng Yên. AFARM áp dụng quy trình khép kín, công nghệ IoT và AI để tối ưu hiệu quả chăn nuôi.',
      services: [
        'Chăn nuôi heo công nghiệp quy mô lớn',
        'Chăn nuôi gia cầm (gà, vịt, ngan)',
        'Nuôi trồng thủy sản',
        'Cung cấp giống chất lượng cao',
        'Dịch vụ tư vấn trang trại'
      ],
      website: 'https://masothue.com/0900301560-cong-ty-co-phan-afarm',
      highlights: [
        'MST: 0900301560 - Thành lập 2008',
        'Địa chỉ: KCN Phố Nối A, Hưng Yên',
        'Công nghệ IoT & AI',
        'Quy trình khép kín',
        'Tiêu chuẩn VietGAP'
      ]
    },
    'AFOOD': {
      fullDescription: 'AFOOD chuyên chế biến và cung cấp thực phẩm an toàn từ nguồn nguyên liệu chất lượng cao. Với nhà máy hiện đại và quy trình kiểm soát nghiêm ngặt, AFOOD đảm bảo sản phẩm đạt tiêu chuẩn xuất khẩu.',
      services: [
        'Chế biến thịt heo sạch',
        'Chế biến thịt gia cầm',
        'Sản phẩm thực phẩm đông lạnh',
        'Xuất khẩu thực phẩm'
      ],
      highlights: [
        'Nhà máy đạt chuẩn HACCP',
        'Xuất khẩu quốc tế',
        'Chuỗi lạnh hiện đại',
        'An toàn thực phẩm 100%'
      ]
    },
    'AGRIL': {
      fullDescription: 'AGRIL là chuỗi nhà hàng cao cấp phục vụ các món ăn từ nguyên liệu sạch trong hệ sinh thái A Group. Mang đến trải nghiệm ẩm thực đẳng cấp với không gian sang trọng và dịch vụ chuyên nghiệp.',
      services: [
        'Nhà hàng buffet cao cấp',
        'Ẩm thực Á - Âu',
        'Tiệc cưới & sự kiện',
        'Dịch vụ catering'
      ],
      highlights: [
        'Chuỗi nhà hàng 5 sao',
        'Nguyên liệu từ hệ sinh thái',
        'Đầu bếp chuyên nghiệp',
        'Không gian sang trọng'
      ]
    },
    'APHAMA': {
      fullDescription: 'APHAMA (A Pharma) chuyên nghiên cứu, sản xuất và phân phối dược thú y, sinh học ứng dụng. Với đội ngũ chuyên gia và phòng lab hiện đại, APHAMA cung cấp giải pháp chăm sóc sức khỏe toàn diện cho vật nuôi, đảm bảo an toàn và hiệu quả cao.',
      services: [
        'Dược thú y chất lượng cao',
        'Sinh phẩm vi sinh',
        'Vitamin & khoáng chất',
        'Thuốc điều trị và phòng bệnh',
        'Tư vấn điều trị bệnh chuyên sâu'
      ],
      website: 'http://www.apharmadvm.com.vn/',
      highlights: [
        'Phòng lab chuẩn quốc tế',
        'Đội ngũ bác sĩ thú y giàu kinh nghiệm',
        'Sản phẩm đạt chuẩn GMP',
        'Nghiên cứu & phát triển liên tục'
      ]
    },
    'AVAC': {
      fullDescription: 'AVAC (A Vaccine) là công ty hàng đầu trong lĩnh vực sản xuất vaccine và sinh phẩm phòng bệnh cho vật nuôi tại Việt Nam. Với công nghệ sinh học tiên tiến và quy trình sản xuất đạt chuẩn quốc tế, AVAC góp phần bảo vệ sức khỏe đàn vật nuôi và phát triển ngành chăn nuôi bền vững.',
      services: [
        'Vaccine phòng bệnh cho gia súc, gia cầm',
        'Sinh phẩm miễn dịch',
        'Dịch vụ chẩn đoán bệnh',
        'Dịch vụ tiêm phòng chuyên nghiệp',
        'Tư vấn chương trình phòng bệnh'
      ],
      website: 'https://www.avac.com.vn/',
      highlights: [
        'Công nghệ sinh học tiên tiến',
        'Chuỗi lạnh đạt chuẩn quốc tế',
        'Hiệu quả phòng bệnh cao',
        'Đội ngũ chuyên gia hàng đầu Việt Nam'
      ]
    }
  }

  const handleCardClick = (brand: Brand) => {
    if (brand.isParent) return // Don't open modal for parent
    setSelectedBrand(brand)
  }

  const closeModal = () => {
    setSelectedBrand(null)
  }

  if (!selectedBrand) return null

  const details = brandDetails[selectedBrand.name]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn" style={{ position: 'relative', zIndex: 1 }}>
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label="Đóng"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <img 
                src={selectedBrand.logo} 
                alt={`${selectedBrand.name} Logo`}
                className="w-20 h-20 object-contain"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{selectedBrand.name}</h3>
              <p className="text-blue-100 text-lg">{selectedBrand.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Full Description */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Giới thiệu</h4>
            <p className="text-gray-700 leading-relaxed">{details?.fullDescription}</p>
          </div>

          {/* Services */}
          {details?.services && (
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Dịch vụ & Sản phẩm</h4>
              <div className="grid gap-3">
                {details.services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {details?.highlights && (
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Điểm nổi bật</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {details.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {details?.website && (
            <div className="pt-6 border-t border-gray-200">
              <a 
                href={details.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Truy cập website
              </a>
            </div>
          )}

          {/* Contact */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              Liên hệ: <a href="tel:+84351359520" className="text-blue-600 font-semibold hover:underline">035 135 9520</a>
            </p>
          </div>
        </div>
      </div>

      {/* Inject click handlers via script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('.ecosystem-card').forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
              window.dispatchEvent(new CustomEvent('openEcosystemModal', { detail: { index } }));
            });
          });
        `
      }} />
    </div>
  )
}
