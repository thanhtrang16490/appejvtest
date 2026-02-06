export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'APPE JV Việt Nam',
    alternateName: 'Công ty Cổ phần APPE JV Việt Nam',
    url: 'https://appejv.app',
    logo: 'https://appejv.app/appejv-logo.png',
    description: 'Chuyên sản xuất và cung cấp thức ăn chăn nuôi và thủy sản chất lượng cao',
    foundingDate: '2008',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Km 50 Quốc lộ 1A, Xã Tiên Tân',
      addressLocality: 'TP. Phủ Lý',
      addressRegion: 'Hà Nam',
      addressCountry: 'VN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+84-3513-595-202',
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: ['vi', 'en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+84-3513-595-203',
        contactType: 'sales',
        areaServed: 'VN',
        availableLanguage: ['vi', 'en'],
      },
    ],
    email: 'info@appe.com.vn',
    sameAs: [
      'https://appe.com.vn',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'APPE JV Việt Nam',
    url: 'https://appejv.app',
    description: 'Thức ăn chăn nuôi và thủy sản chất lượng cao',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://appejv.app/san-pham?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function ProductCatalogStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh mục sản phẩm APPE JV',
    description: 'Thức ăn chăn nuôi và thủy sản chất lượng cao',
    url: 'https://appejv.app/san-pham',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: 'Thức ăn cho heo (Pig Feed)',
          description: 'Công thức dinh dưỡng tối ưu cho từng giai đoạn phát triển',
          category: 'Pig Feed',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: 'Thức ăn cho gia cầm (Poultry Feed)',
          description: 'Dinh dưỡng cân bằng cho gà, vịt',
          category: 'Poultry Feed',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Product',
          name: 'Thức ăn cho thủy sản (Fish Feed)',
          description: 'Đáp ứng nhu cầu nuôi trồng thủy sản',
          category: 'Fish Feed',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
