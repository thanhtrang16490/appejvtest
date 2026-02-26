'use client'

import AppHeader from '@/components/layout/AppHeader'
import BottomNav from '@/components/layout/BottomNav'
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-[#f0f9ff]">
        <AppHeader />
        <main className="pb-[60px]">
          {children}
        </main>
        <BottomNav />
      </div>
    </NotificationProvider>
  )
}
