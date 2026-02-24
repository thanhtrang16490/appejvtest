export interface HomePageTranslations {
  seo: {
    title: string
    description: string
  }
  hero: {
    badge: string
    heading: string
    subheading: string
    benefits: string[]
    cta: {
      primary: string
      secondary: string
    }
    trustIndicators: {
      iso: string
      years: string
      customers: string
      export: string
    }
    scrollText: string
  }
  stats: {
    established: string
    customers: string
    production: string
    satisfaction: string
  }
  vision: {
    title: string
    description: string
  }
  mission: {
    title: string
    description: string
  }
  video: {
    title: string
    subtitle: string
  }
  ecosystem: {
    title: string
    subtitle: string
    farmToFork: string
  }
  features: {
    title: string
    subtitle: string
    items: Array<{
      title: string
      description: string
    }>
  }
  products: {
    title: string
    subtitle: string
    categories: Array<{
      name: string
      title: string
      subtitle: string
      description: string
      features: string[]
    }>
  }
}

export const translations: Record<'vi' | 'en' | 'cn', HomePageTranslations> = {
  vi: {
    seo: {
      title: "APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản chất lượng cao",
      description: "APPE JV chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao cho heo, gia cầm và thủy sản. Thành lập từ 2008, ứng dụng công nghệ tiên tiến, xuất khẩu sang Đông Nam Á và Châu Âu."
    },
    hero: {
      badge: "Thương hiệu uy tín 16+ năm • ISO 9001:2015",
      heading: "Tăng 30% Hiệu Quả Chăn Nuôi Của Bạn",
      subheading: "Với Thức Ăn Công Nghệ Cao Từ APPE JV",
      benefits: [
        "Tăng trọng nhanh hơn",
        "Giảm chi phí thức ăn",
        "Vật nuôi khỏe mạnh"
      ],
      cta: {
        primary: "Xem sản phẩm & giá ngay",
        secondary: "Tư vấn miễn phí 24/7"
      },
      trustIndicators: {
        iso: "Chứng nhận quốc tế",
        years: "Kinh nghiệm",
        customers: "Khách hàng",
        export: "Đông Nam Á & Châu Âu"
      },
      scrollText: "Khám phá thêm"
    },
    stats: {
      established: "Năm thành lập",
      customers: "Khách hàng tin dùng",
      production: "Tấn sản phẩm/năm",
      satisfaction: "% Khách hàng hài lòng"
    },
    vision: {
      title: "Tầm nhìn",
      description: "Trở thành doanh nghiệp uy tín trong lĩnh vực sản xuất thức ăn chăn nuôi và thủy sản tại Việt Nam và khu vực"
    },
    mission: {
      title: "Sứ mệnh",
      description: "Cung cấp sản phẩm chất lượng cao, ổn định, ứng dụng công nghệ tiên tiến và đồng hành cùng khách hàng phát triển bền vững"
    },
    video: {
      title: "Khám phá APPE JV",
      subtitle: "Hành trình và cam kết của chúng tôi trong việc cung cấp thức ăn chăn nuôi chất lượng cao"
    },
    ecosystem: {
      title: "Hệ sinh thái A Group",
      subtitle: "APPE là thành viên của hệ sinh thái A Group - tập đoàn hàng đầu trong lĩnh vực nông nghiệp, chăn nuôi và thực phẩm tại Việt Nam",
      farmToFork: "Cùng nhau xây dựng chuỗi giá trị nông nghiệp bền vững từ trang trại đến bàn ăn"
    },
    features: {
      title: "Tại sao chọn APPE?",
      subtitle: "Chúng tôi mang đến giải pháp toàn diện cho ngành chăn nuôi với công nghệ hiện đại",
      items: [
        {
          title: "Chất lượng cao",
          description: "Sản phẩm đạt tiêu chuẩn quốc tế, đảm bảo an toàn và hiệu quả"
        },
        {
          title: "Công nghệ tiên tiến",
          description: "Ứng dụng công nghệ và tiêu chuẩn sản xuất hiện đại"
        },
        {
          title: "Đồng hành bền vững",
          description: "Cam kết phát triển bền vững cùng khách hàng và đối tác"
        },
        {
          title: "Xuất khẩu quốc tế",
          description: "Sản phẩm được xuất khẩu sang Đông Nam Á và Châu Âu"
        }
      ]
    },
    products: {
      title: "Danh mục sản phẩm",
      subtitle: "Dòng sản phẩm thức ăn chăn nuôi và thủy sản chất lượng cao, đảm bảo dinh dưỡng tối ưu cho từng giai đoạn phát triển",
      categories: [
        {
          name: "Pig Feed",
          title: "Thức ăn cho heo",
          subtitle: "THỨC ĂN HEO CAO CẤP",
          description: "Công thức dinh dưỡng tối ưu cho từng giai đoạn phát triển, hỗ trợ tăng trưởng và sức đề kháng tối đa",
          features: [
            "Protein 18-20% từ nguồn chất lượng cao",
            "Vitamin và khoáng chất cân bằng",
            "Hỗ trợ tiêu hóa và tăng trọng nhanh",
            "An toàn tuyệt đối, không chất cấm"
          ]
        },
        {
          name: "Poultry Feed",
          title: "Thức ăn cho gia cầm",
          subtitle: "THỨC ĂN GIA CẦM CHUYÊN NGHIỆP",
          description: "Dinh dưỡng cân bằng cho gà, vịt, giúp vật nuôi khỏe mạnh và phát triển đồng đều, năng suất cao",
          features: [
            "Năng lượng tối ưu cho từng giai đoạn",
            "Tăng cường sức đề kháng tự nhiên",
            "Cải thiện chất lượng trứng và thịt",
            "Giảm tỷ lệ chết, tăng hiệu quả kinh tế"
          ]
        },
        {
          name: "Fish Feed",
          title: "Thức ăn cho thủy sản",
          subtitle: "THỨC ĂN THỦY SẢN XUẤT KHẨU",
          description: "Đáp ứng nhu cầu nuôi trồng thủy sản trong nước và xuất khẩu sang Đông Nam Á, Châu Âu với tiêu chuẩn quốc tế",
          features: [
            "Công thức đặc biệt cho từng loại cá",
            "Tỷ lệ chuyển đổi thức ăn (FCR) tối ưu",
            "Không gây ô nhiễm môi trường nước",
            "Xuất khẩu sang Đông Nam Á và Châu Âu"
          ]
        }
      ]
    }
  },
  en: {
    seo: {
      title: "APPE JV Vietnam - High-Quality Livestock and Aquaculture Feed",
      description: "APPE JV specializes in manufacturing and supplying high-quality animal feed for pigs, poultry, and aquaculture. Established in 2008, applying advanced technology, exporting to Southeast Asia and Europe."
    },
    hero: {
      badge: "Trusted Brand 16+ Years • ISO 9001:2015",
      heading: "Increase Your Farming Efficiency by 30%",
      subheading: "With High-Tech Feed from APPE JV",
      benefits: [
        "Faster weight gain",
        "Reduced feed costs",
        "Healthier livestock"
      ],
      cta: {
        primary: "View Products & Prices",
        secondary: "Free Consultation 24/7"
      },
      trustIndicators: {
        iso: "International Certification",
        years: "Years Experience",
        customers: "Customers",
        export: "Southeast Asia & Europe"
      },
      scrollText: "Discover More"
    },
    stats: {
      established: "Year Established",
      customers: "Trusted Customers",
      production: "Tons Production/Year",
      satisfaction: "% Customer Satisfaction"
    },
    vision: {
      title: "Vision",
      description: "To become a reputable enterprise in the field of livestock and aquaculture feed production in Vietnam and the region"
    },
    mission: {
      title: "Mission",
      description: "Provide high-quality, stable products, apply advanced technology and accompany customers for sustainable development"
    },
    video: {
      title: "Discover APPE JV",
      subtitle: "Our journey and commitment to providing high-quality livestock feed"
    },
    ecosystem: {
      title: "A Group Ecosystem",
      subtitle: "APPE is a member of the A Group ecosystem - a leading corporation in agriculture, livestock and food in Vietnam",
      farmToFork: "Together building a sustainable agricultural value chain from farm to fork"
    },
    features: {
      title: "Why Choose APPE?",
      subtitle: "We bring comprehensive solutions to the livestock industry with modern technology",
      items: [
        {
          title: "High Quality",
          description: "Products meet international standards, ensuring safety and effectiveness"
        },
        {
          title: "Advanced Technology",
          description: "Application of modern technology and production standards"
        },
        {
          title: "Sustainable Partnership",
          description: "Commitment to sustainable development with customers and partners"
        },
        {
          title: "International Export",
          description: "Products exported to Southeast Asia and Europe"
        }
      ]
    },
    products: {
      title: "Product Categories",
      subtitle: "High-quality livestock and aquaculture feed products, ensuring optimal nutrition for each development stage",
      categories: [
        {
          name: "Pig Feed",
          title: "Pig Feed",
          subtitle: "PREMIUM PIG FEED",
          description: "Optimal nutritional formula for each development stage, supporting maximum growth and resistance",
          features: [
            "18-20% protein from high-quality sources",
            "Balanced vitamins and minerals",
            "Supports digestion and rapid weight gain",
            "Absolutely safe, no banned substances"
          ]
        },
        {
          name: "Poultry Feed",
          title: "Poultry Feed",
          subtitle: "PROFESSIONAL POULTRY FEED",
          description: "Balanced nutrition for chickens and ducks, helping livestock stay healthy and develop uniformly with high productivity",
          features: [
            "Optimal energy for each stage",
            "Enhance natural resistance",
            "Improve egg and meat quality",
            "Reduce mortality, increase economic efficiency"
          ]
        },
        {
          name: "Fish Feed",
          title: "Aquaculture Feed",
          subtitle: "EXPORT AQUACULTURE FEED",
          description: "Meeting domestic aquaculture needs and exports to Southeast Asia, Europe with international standards",
          features: [
            "Special formula for each fish species",
            "Optimal feed conversion ratio (FCR)",
            "Does not pollute water environment",
            "Exported to Southeast Asia and Europe"
          ]
        }
      ]
    }
  },
  cn: {
    seo: {
      title: "APPE JV越南 - 高质量畜牧和水产饲料",
      description: "APPE JV专业生产和供应高质量的猪、家禽和水产饲料。成立于2008年，应用先进技术，出口到东南亚和欧洲。"
    },
    hero: {
      badge: "信誉品牌16+年 • ISO 9001:2015",
      heading: "提高您的养殖效率30%",
      subheading: "使用APPE JV的高科技饲料",
      benefits: [
        "更快增重",
        "降低饲料成本",
        "更健康的牲畜"
      ],
      cta: {
        primary: "查看产品和价格",
        secondary: "24/7免费咨询"
      },
      trustIndicators: {
        iso: "国际认证",
        years: "年经验",
        customers: "客户",
        export: "东南亚和欧洲"
      },
      scrollText: "了解更多"
    },
    stats: {
      established: "成立年份",
      customers: "信赖客户",
      production: "吨产量/年",
      satisfaction: "% 客户满意度"
    },
    vision: {
      title: "愿景",
      description: "成为越南和地区畜牧和水产饲料生产领域的信誉企业"
    },
    mission: {
      title: "使命",
      description: "提供高质量、稳定的产品，应用先进技术，与客户共同可持续发展"
    },
    video: {
      title: "探索APPE JV",
      subtitle: "我们提供高质量畜牧饲料的旅程和承诺"
    },
    ecosystem: {
      title: "A Group生态系统",
      subtitle: "APPE是A Group生态系统的成员 - 越南农业、畜牧和食品领域的领先集团",
      farmToFork: "共同建设从农场到餐桌的可持续农业价值链"
    },
    features: {
      title: "为什么选择APPE？",
      subtitle: "我们为畜牧业提供现代技术的综合解决方案",
      items: [
        {
          title: "高质量",
          description: "产品符合国际标准，确保安全和有效"
        },
        {
          title: "先进技术",
          description: "应用现代技术和生产标准"
        },
        {
          title: "可持续合作",
          description: "承诺与客户和合作伙伴可持续发展"
        },
        {
          title: "国际出口",
          description: "产品出口到东南亚和欧洲"
        }
      ]
    },
    products: {
      title: "产品类别",
      subtitle: "高质量的畜牧和水产饲料产品，确保每个发展阶段的最佳营养",
      categories: [
        {
          name: "Pig Feed",
          title: "猪饲料",
          subtitle: "高级猪饲料",
          description: "每个发展阶段的最佳营养配方，支持最大生长和抵抗力",
          features: [
            "来自高质量来源的18-20%蛋白质",
            "平衡的维生素和矿物质",
            "支持消化和快速增重",
            "绝对安全，无禁用物质"
          ]
        },
        {
          name: "Poultry Feed",
          title: "家禽饲料",
          subtitle: "专业家禽饲料",
          description: "鸡鸭的平衡营养，帮助牲畜保持健康，均匀发展，高生产力",
          features: [
            "每个阶段的最佳能量",
            "增强自然抵抗力",
            "改善蛋和肉的质量",
            "降低死亡率，提高经济效益"
          ]
        },
        {
          name: "Fish Feed",
          title: "水产饲料",
          subtitle: "出口水产饲料",
          description: "满足国内水产养殖需求和出口到东南亚、欧洲的国际标准",
          features: [
            "每种鱼类的特殊配方",
            "最佳饲料转化率(FCR)",
            "不污染水环境",
            "出口到东南亚和欧洲"
          ]
        }
      ]
    }
  }
}
