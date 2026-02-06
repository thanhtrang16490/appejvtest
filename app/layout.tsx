import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalBottomNav } from "@/components/layout/ConditionalBottomNav";
import { ConditionalSidebarLayout } from "@/components/layout/ConditionalSidebarLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { OrganizationStructuredData, WebsiteStructuredData } from "./structured-data";

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
    statusBarStyle: "default",
    title: "APPE JV",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [
      { url: "/appejv-logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
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
        url: "/appejv-logo.png",
        width: 1200,
        height: 630,
        alt: "APPE JV Việt Nam Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản",
    description: "Chuyên sản xuất và cung cấp thức ăn chăn nuôi chất lượng cao",
    images: ["/appejv-logo.png"],
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
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon-180.png" />
        <meta name="theme-color" content="#175ead" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="APPE JV" />
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={inter.className}>
        <Sidebar role={role} user={user} />
        <ConditionalSidebarLayout user={user} role={role}>
          <main className={cn("min-h-screen", isSalesUser ? "pb-16 md:pb-0" : "")}>
            {children}
          </main>
        </ConditionalSidebarLayout>
        <ConditionalBottomNav user={user} role={role} />
        <Toaster />
      </body>
    </html>
  );
}
