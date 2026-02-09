export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "APPE JV Việt Nam",
    "alternateName": "APPE Joint Venture Vietnam",
    "url": "https://appejv.app",
    "logo": "https://appejv.app/appejv-logo.png",
    "description": "Công ty chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao cho heo, gia cầm và thủy sản",
    "foundingDate": "2008",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Khu công nghiệp Đồng Văn II",
      "addressLocality": "Duy Tiên",
      "addressRegion": "Hà Nam",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-351-3595-202",
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": ["vi", "en"]
    },
    "sameAs": [
      "https://www.facebook.com/appejv",
      "https://www.linkedin.com/company/appejv"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "APPE JV Việt Nam",
    "url": "https://appejv.app",
    "description": "Chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao",
    "publisher": {
      "@type": "Organization",
      "name": "APPE JV Việt Nam",
      "logo": {
        "@type": "ImageObject",
        "url": "https://appejv.app/appejv-logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://appejv.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
