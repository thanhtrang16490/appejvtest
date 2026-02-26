'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft, User, Mail, Phone, Shield, Calendar, Edit2, Check } from 'lucide-react'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'

interface UserProfile {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: string
  created_at: string
  manager_id?: string
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'admin':
      return { label: 'Admin', variant: 'danger' as const }
    case 'sale_admin':
      return { label: 'Sale Admin', variant: 'warning' as const }
    case 'sale':
      return { label: 'Sale', variant: 'info' as const }
    case 'warehouse':
      return { label: 'Kho', variant: 'default' as const }
    default:
      return { label: 'Customer', variant: 'default' as const }
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'admin': return 'Quản trị viên'
    case 'sale_admin': return 'Trưởng phòng'
    case 'sale': return 'Nhân viên bán hàng'
    case 'warehouse': return 'Kho'
    default: return 'Người dùng'
  }
}

export default function UserDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [saleAdmins, setSaleAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    full_name: '',
    phone: '',
    role: '',
    manager_id: '',
  })

  const isAdmin = user?.role === 'admin'
  const isSaleAdmin = user?.role === 'sale_admin'

  useEffect(() => {
    if (authLoading) return
    if (!user || (!isAdmin && !isSaleAdmin)) {
      router.push('/sales')
      return
    }
    fetchData()
  }, [user, authLoading, userId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch user profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(profileData)
      setEditedData({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        role: profileData.role || 'sale',
        manager_id: profileData.manager_id || '',
      })

      // Fetch sale admins for manager selection
      const { data: saleAdminsData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'sale_admin')
        .order('full_name')

      setSaleAdmins(saleAdminsData || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedData.full_name,
          phone: editedData.phone || null,
          role: editedData.role,
          manager_id: editedData.manager_id || null,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Đã cập nhật thông tin người dùng')
      setEditing(false)
      fetchData()
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error('Không thể cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    if (profile) {
      setEditedData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        role: profile.role || 'sale',
        manager_id: profile.manager_id || '',
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
          <p className="text-red-600">Không tìm thấy người dùng</p>
        </div>
      </SalesLayout>
    )
  }

  const roleBadge = getRoleBadge(profile.role)
  const roleLabel = getRoleLabel(profile.role)

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
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">
            Chi tiết người dùng
          </h1>
          <div className="w-10">
            {editing ? (
              <button
                onClick={handleSave}
                className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 rounded-full transition-colors"
              >
                <Check className="w-6 h-6 text-emerald-600" />
              </button>
            ) : (
              isAdmin && (
                <button
                  onClick={() => setEditing(true)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit2 className="w-6 h-6 text-[#175ead]" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#175ead] to-cyan-500"></div>

            <div className="flex items-start justify-between p-5 pb-3">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  profile.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                }`}
              >
                {profile.role === 'admin' ? (
                  <Shield className="w-10 h-10 text-red-600" />
                ) : (
                  <User className="w-10 h-10 text-[#175ead]" />
                )}
              </div>
              <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
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

                  <Select
                    label="Vai trò"
                    value={editedData.role}
                    onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                    options={[
                      { value: 'sale', label: 'Sale' },
                      { value: 'sale_admin', label: 'Sale Admin' },
                      { value: 'warehouse', label: 'Kho' },
                      ...(isAdmin ? [{ value: 'admin', label: 'Admin' }] : []),
                    ]}
                  />

                  {editedData.role === 'sale' && (
                    <Select
                      label="Quản lý"
                      value={editedData.manager_id}
                      onChange={(e) => setEditedData({ ...editedData, manager_id: e.target.value })}
                      options={[
                        { value: '', label: '-- Chưa gán --' },
                        ...saleAdmins.map((sa) => ({
                          value: sa.id,
                          label: `${sa.full_name} (${sa.email})`,
                        })),
                      ]}
                    />
                  )}
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
                    <p className="text-sm font-medium text-gray-900">{profile.phone || '---'}</p>
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
                    <p className="text-xs text-gray-600 mb-0.5">Ngày tạo</p>
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
