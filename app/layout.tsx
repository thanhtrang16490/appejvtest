import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalBottomNav } from "@/components/layout/ConditionalBottomNav";
import { ConditionalSidebarLayout } from "@/components/layout/ConditionalSidebarLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APPE JV - Quản lý bán hàng",
  description: "Hệ thống quản lý bán hàng và đơn hàng APPE JV Việt Nam",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "APPE JV",
  },
  formatDetection: {
    telephone: false,
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
