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
  title: "Sales Order App",
  description: "Mobile-first Sales Order Management System",
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
    <html lang="en">
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
