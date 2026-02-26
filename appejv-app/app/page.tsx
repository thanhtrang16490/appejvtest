'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Route based on role
    switch (user.role) {
      case 'admin':
        router.push('/admin')
        break
      case 'sale_admin':
      case 'sale':
        router.push('/sales')
        break
      case 'warehouse':
        router.push('/warehouse')
        break
      case 'customer':
        router.push('/customer')
        break
      default:
        router.push('/auth/login')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}
