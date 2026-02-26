'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft, User, Mail, Phone, Shield, Calendar, Edit2, Check, X } from 'lucide-react'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

interface Profile {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: string
  created_at: string
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'admin': return 'Quản trị viên'
    case 'sale_admin': return 'Trưởng phòng'
    case 'sale': return 'Nhân viên bán hàng'
    case 'warehouse': return 'Kho'
    case 'customer': return 'Khách hàng'
    default: return 'Người dùng'
  }
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case 'admin': return 'danger'
    case 'sale_admin': return 'info'
    case 'sale': return 'success'
    case 'warehouse': return 'warning'
    default: return 'default'
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

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    full_name: '',
    phone: '',
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchProfile()
  }, [user, authLoading])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error

      const fullProfile: Profile = {
        id: authUser.id,
        email: authUser.email,
        phone: authUser.phone,
        full_name: profileData?.full_name,
        role: profileData?.role || 'customer',
        created_at: authUser.created_at,
      }

      setProfile(fullProfile)
      setEditedData({
        full_name: fullProfile.full_name || '',
        phone: fullProfile.phone || '',
      })
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error('Không thể tải thông tin cá nhân')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editedData.full_name,
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Update auth.users phone if changed
      if (editedData.phone !== profile?.phone) {
        const { error: authError } = await supabase.auth.updateUser({
          phone: editedData.phone,
        })
        if (authError) throw authError
      }

      toast.success('Đã cập nhật thông tin cá nhân')
      setEditing(false)
      await refreshUser()
      fetchProfile()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Không thể cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    if (profile) {
      setEditedData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      })
    }
  }

  if (authLoading || loading) {
    return (
      <SalesLayout>
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </SalesLayout>
    )
  }

  if (!profile) {
    return (
      <SalesLayout>
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
          <p className="text-red-600">Không thể tải thông tin cá nhân</p>
        </div>
      </SalesLayout>
    )
  }

  const avatarColor = getAvatarColor(profile.role)
  const initials = getInitials(profile.full_name, profile.email)
  const roleLabel = getRoleLabel(profile.role)
  const roleBadgeVariant = getRoleBadgeVariant(profile.role)

  return (
    <SalesLayout>
      <div className="min-h-screen bg-[#f0f9ff]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f0f9ff] border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Thông tin cá nhân</h1>
          <div className="w-10">
            {editing ? (
              <button
                onClick={handleSave}
                className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 rounded-full transition-colors"
              >
                <Check className="w-6 h-6 text-emerald-600" />
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 rounded-full transition-colors"
              >
                <Edit2 className="w-6 h-6 text-[#175ead]" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#175ead] to-cyan-500"></div>
            
            <div className="flex items-start justify-between p-5 pb-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${avatarColor}`}>
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
              <Badge variant={roleBadgeVariant as any}>{roleLabel}</Badge>
            </div>

            <div className="px-5 pb-5">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    label="Họ và tên"
                    value={editedData.full_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditedData({ ...editedData, full_name: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                  />
                  
                  <Input
                    label="Số điện thoại"
                    value={editedData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditedData({ ...editedData, phone: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                    type="tel"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.full_name || 'Chưa cập nhật'}
                  </h2>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Info Section */}
          {!editing && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin chi tiết</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {profile.email || '---'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Số điện thoại</p>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.phone || '---'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Vai trò</p>
                    <p className="text-sm font-medium text-gray-900">{roleLabel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">Ngày tham gia</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Button when editing */}
          {editing && (
            <button
              onClick={handleCancel}
              className="w-full py-3.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </SalesLayout>
  )
}
