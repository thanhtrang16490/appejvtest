'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Box,
  UserPlus,
  Users,
  BarChart3,
  Folder,
  Download,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Grid3X3,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

interface Profile {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: string
}

interface MenuItem {
  title: string
  description: string
  icon: any
  color: string
  bg: string
  href: string
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'admin': return 'Quản trị viên'
    case 'sale_admin': return 'Trưởng phòng'
    case 'sale': return 'Nhân viên bán hàng'
    default: return 'Nhân viên'
  }
}

function getAvatarColor(role?: string): string {
  switch (role) {
    case 'admin': return 'bg-purple-600'
    case 'sale_admin': return 'bg-[#175ead]'
    case 'sale': return 'bg-cyan-600'
    case 'warehouse': return 'bg-amber-600'
    default: return 'bg-gray-600'
  }
}

export default function MenuPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      try {
        await signOut()
        toast.success('Đã đăng xuất')
        router.push('/auth/login')
      } catch (error) {
        console.error('Logout error:', error)
        toast.error('Có lỗi khi đăng xuất')
      }
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isSaleAdmin = profile?.role === 'sale_admin'

  const menuItems: MenuItem[] = [
    {
      title: 'Quản lý kho hàng',
      description: 'Kiểm tra tồn kho và giá bán',
      icon: Box,
      color: '#f59e0b',
      bg: '#fef3c7',
      href: '/sales/inventory',
    },
  ]

  // Add customer assignment for sale_admin and admin
  if (isSaleAdmin || isAdmin) {
    menuItems.push({
      title: 'Gán khách hàng',
      description: 'Phân công khách hàng cho nhân viên',
      icon: UserPlus,
      color: '#10b981',
      bg: '#d1fae5',
      href: '/sales/customers/assign',
    })
  }

  const adminMenuItems: MenuItem[] = []

  if (isAdmin || isSaleAdmin) {
    // Add Team Management for sale_admin
    if (isSaleAdmin) {
      adminMenuItems.push({
        title: 'Quản lý Team',
        description: 'Xem và quản lý thành viên trong team',
        icon: Users,
        color: '#175ead',
        bg: '#dbeafe',
        href: '/sales/team',
      })
    }

    adminMenuItems.push(
      {
        title: 'Phân tích dữ liệu',
        description: 'Analytics và insights chi tiết',
        icon: BarChart3,
        color: '#8b5cf6',
        bg: '#f3e8ff',
        href: '/sales/analytics',
      },
      {
        title: 'Quản lý danh mục',
        description: 'Tạo và chỉnh sửa danh mục sản phẩm',
        icon: Folder,
        color: '#f59e0b',
        bg: '#fef3c7',
        href: '/sales/categories',
      },
      {
        title: 'Xuất dữ liệu',
        description: 'Export CSV/Excel cho báo cáo',
        icon: Download,
        color: '#10b981',
        bg: '#d1fae5',
        href: '/sales/export',
      },
      {
        title: 'Quản lý nhân sự',
        description: 'Quản lý tài khoản và phân quyền',
        icon: Shield,
        color: '#ef4444',
        bg: '#fee2e2',
        href: '/sales/users',
      }
    )
  }

  if (isAdmin) {
    adminMenuItems.push({
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình và tùy chỉnh hệ thống',
      icon: Settings,
      color: '#6b7280',
      bg: '#f3f4f6',
      href: '/sales/settings',
    })
  }

  const avatarColor = getAvatarColor(profile?.role)
  const initials = profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header with Logo */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f0f9ff]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative">
            <Image
              src="/appejv-logo.png"
              alt="APPE JV"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-bold text-gray-900">APPE JV</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Đóng"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-5">
        {/* Page Header */}
        <div className="mb-2">
          <h2 className="text-[28px] font-bold text-gray-900 mb-1">Menu</h2>
          <p className="text-sm text-gray-600 italic">Các tính năng bổ sung và công cụ quản trị</p>
        </div>

        {/* User Info Card */}
        <div className="bg-[rgba(23,94,173,0.05)] rounded-2xl p-4 flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${avatarColor}`}>
            <span className="text-white text-2xl font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-900 truncate">
              {profile?.full_name || 'Người dùng'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {profile?.email || profile?.phone}
            </p>
            <p className="text-[10px] font-bold text-[#175ead] uppercase tracking-wide mt-1">
              {getRoleLabel(profile?.role || '')}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-[#175ead]" />
                <h3 className="text-base font-bold text-gray-900">Tính năng bổ sung</h3>
              </div>
            </div>

            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center p-4 gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.bg }}
                      >
                        <item.icon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-600 truncate">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Admin Tools Section */}
        {(isAdmin || isSaleAdmin) && adminMenuItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#175ead]" />
                <h3 className="text-base font-bold text-gray-900">Công cụ quản trị</h3>
              </div>
              <div className="bg-[#dbeafe] px-3 py-1 rounded-xl">
                <span className="text-[10px] font-bold text-[#175ead] tracking-wide">
                  {isAdmin ? 'ADMIN' : 'SALE ADMIN'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {adminMenuItems.map((item, index) => (
                <Link key={`admin-${index}`} href={item.href}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center p-4 gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.bg }}
                      >
                        <item.icon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-600 truncate">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 rounded-xl py-4 flex items-center justify-center gap-2 transition-colors mt-3"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="text-base font-semibold text-white">Đăng xuất</span>
        </button>

        {/* App Version */}
        <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest opacity-50 mt-2 mb-5">
          SalesApp Workspace • v1.0.0
        </p>
      </div>
    </div>
  )
}
