import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Danh mục sản phẩm - Thức ăn chăn nuôi và thủy sản",
  description: "Khám phá danh mục sản phẩm thức ăn chăn nuôi chất lượng cao của APPE JV: thức ăn heo, gia cầm, thủy sản. Công thức dinh dưỡng tối ưu, ứng dụng công nghệ tiên tiến.",
  keywords: [
    "danh mục sản phẩm",
    "thức ăn heo",
    "thức ăn gia cầm", 
    "thức ăn thủy sản",
    "pig feed",
    "poultry feed",
    "fish feed",
    "sản phẩm chăn nuôi",
    "APPE JV"
  ],
  openGraph: {
    title: "Danh mục sản phẩm - APPE JV Việt Nam",
    description: "Khám phá danh mục sản phẩm thức ăn chăn nuôi chất lượng cao: thức ăn heo, gia cầm, thủy sản",
    url: "https://appejv.app/san-pham",
    type: "website",
    images: [
      {
        url: "/appejv-logo.png",
        width: 1200,
        height: 630,
        alt: "APPE JV Products",
      },
    ],
  },
  alternates: {
    canonical: "https://appejv.app/san-pham",
  },
}
