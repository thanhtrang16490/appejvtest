import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalBottomNav } from "@/components/layout/ConditionalBottomNav";
import { ConditionalSidebarLayout } from "@/components/layout/ConditionalSidebarLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/providers/query-provider";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { OrganizationStructuredData, WebsiteStructuredData } from "./structured-data";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://appejv.app'),
  title: {
    default: "APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản chất lượng cao",
    template: "%s | APPE JV Việt Nam"
  },
  description: "APPE JV chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao cho heo, gia cầm và thủy sản. Thành lập từ 2008, ứng dụng công nghệ tiên tiến, xuất khẩu sang Lào và khu vực.",
  keywords: [
    "thức ăn chăn nuôi",
    "thức ăn heo",
    "thức ăn gia cầm",
    "thức ăn thủy sản",
    "APPE JV",
    "APPE Việt Nam",
    "pig feed",
    "poultry feed",
    "fish feed",
    "chăn nuôi",
    "thủy sản",
    "Hà Nam",
    "thức ăn chất lượng cao"
  ],
  authors: [{ name: "APPE JV Việt Nam" }],
  creator: "APPE JV Việt Nam",
  publisher: "APPE JV Việt Nam",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "APPE JV",
    startupImage: [
      {
        url: "/apple-icon-180.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/apple-icon-180.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/apple-icon-180.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon-180.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-180.png", sizes: "152x152", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-icon-180.png",
      },
    ],
  },
  themeColor: "#175ead",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://appejv.app",
    siteName: "APPE JV Việt Nam",
    title: "APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản chất lượng cao",
    description: "Chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao cho heo, gia cầm và thủy sản. Thành lập từ 2008.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "APPE JV Việt Nam Logo",
        type: "image/png",
      },
      {
        url: "/appejv-logo.png",
        width: 800,
        height: 800,
        alt: "APPE JV Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản",
    description: "Chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao",
    images: ["/og-image.png"],
    creator: "@appejv",
    site: "@appejv",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://appejv.app",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon-180.png" sizes="180x180" />
        <link rel="apple-touch-icon-precomposed" href="/apple-icon-180.png" />
        <link rel="mask-icon" href="/appejv-logo.svg" color="#175ead" />
        <meta name="theme-color" content="#175ead" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="APPE JV" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="APPE JV" />
        <meta name="msapplication-TileColor" content="#175ead" />
        <meta name="msapplication-TileImage" content="/icon-512.png" />
        
        {/* Zalo Open Graph Tags */}
        <meta property="zalo:app_id" content="YOUR_ZALO_APP_ID" />
        <meta property="zalo:title" content="APPE JV Việt Nam - Thức ăn chăn nuôi chất lượng cao" />
        <meta property="zalo:description" content="Chuyên sản xuất thức ăn heo, gia cầm, thủy sản. Liên hệ: 0351 3595 202/203" />
        <meta property="zalo:image" content="https://appejv.app/zalo-og-image.png" />
        <meta property="zalo:url" content="https://appejv.app" />
        
        {/* Additional Social Meta Tags */}
        <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
        <meta name="twitter:site" content="@appejv" />
        <meta name="twitter:creator" content="@appejv" />
        
        {/* WhatsApp / Telegram Preview */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}

async function LayoutContent({ children }: { children: React.ReactNode }) {
  // Get pathname to check if we're on auth pages
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Skip user/role fetching for auth pages to prevent hydration issues
  const isAuthPage = pathname.startsWith('/auth');
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'customer';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile && (profile as any).role) role = (profile as any).role;
  }

  // Check if we should show bottom nav (sales pages for sales users)
  const isSalesUser = user && ['sale', 'admin', 'sale_admin'].includes(role)

  return (
    <>
      <Sidebar role={role} user={user} />
      <ConditionalSidebarLayout user={user} role={role}>
        <main className={cn("min-h-screen", isSalesUser ? "pb-16 md:pb-0" : "")}>
          {children}
        </main>
      </ConditionalSidebarLayout>
      <ConditionalBottomNav user={user} role={role} />
    </>
  );
}
