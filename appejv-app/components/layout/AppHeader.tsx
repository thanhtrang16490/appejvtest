'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { cn } from '@/lib/utils'
import { Menu, Phone, Bell } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AppHeaderProps {
  showNotification?: boolean
  menuHref?: string
  showAvatar?: boolean
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return 'U'
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

export default function AppHeader({
  showNotification = true,
  menuHref = '/sales/menu',
  showAvatar = true,
}: AppHeaderProps) {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const router = useRouter()

  const initials = getInitials(user?.full_name, user?.email)
  const avatarColor = getAvatarColor(user?.role)

  const handlePhonePress = () => {
    window.location.href = 'tel:0123456789'
  }

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#f0f9ff] border-b border-[#e0f2fe]">
      {/* Logo + App name */}
      <div className="flex items-center gap-2 flex-1">
        <div className="w-9 h-9 relative flex-shrink-0">
          <Image
            src="/appejv-logo.png"
            alt="APPE JV"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 leading-tight">APPE JV</h1>
          {user?.full_name && (
            <p className="text-[11px] text-gray-600 leading-tight truncate">
              Xin chào, {user.full_name.split(' ').pop()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Hotline */}
        <button
          onClick={handlePhonePress}
          className="w-9 h-9 flex items-center justify-center bg-emerald-100 rounded-full flex-shrink-0 hover:bg-emerald-200 transition-colors"
          aria-label="Gọi hotline"
        >
          <Phone className="w-[18px] h-[18px] text-emerald-600" />
        </button>

        {/* Notification */}
        {showNotification && (
          <button
            onClick={() => router.push('/sales/notifications')}
            className="w-9 h-9 flex items-center justify-center relative flex-shrink-0 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {/* Badge for unread notifications */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1">
                <span className="text-[10px] font-bold text-white leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </button>
        )}

        {/* User Avatar → opens menu */}
        {showAvatar ? (
          <Link href={menuHref}>
            <button
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity',
                avatarColor
              )}
              aria-label="Mở menu người dùng"
            >
              <span className="text-white text-[13px] font-bold tracking-wider">
                {initials}
              </span>
            </button>
          </Link>
        ) : (
          <Link href={menuHref}>
            <button
              className="w-9 h-9 flex items-center justify-center flex-shrink-0 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
