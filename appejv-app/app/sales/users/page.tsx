'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft, Plus, Shield, User, Trash2, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Link from 'next/link'

interface Profile {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: string
  created_at: string
  manager_id?: string
  manager?: {
    id: string
    full_name: string
  }
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

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'sale',
  })
  const [creating, setCreating] = useState(false)

  const isAdmin = user?.role === 'admin'
  const isSaleAdmin = user?.role === 'sale_admin'

  useEffect(() => {
    if (authLoading) return
    if (!user || (!isAdmin && !isSaleAdmin)) {
      router.push('/sales')
      return
    }
    fetchData()
  }, [user, authLoading])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredProfiles(
        profiles.filter(
          (p) =>
            p.full_name?.toLowerCase().includes(query) ||
            p.email?.toLowerCase().includes(query) ||
            p.phone?.includes(query)
        )
      )
    } else {
      setFilteredProfiles(profiles)
    }
  }, [searchQuery, profiles])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch all profiles (exclude customers)
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'customer')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Add manager info
      const profilesWithManager = (profilesData || []).map((p) => ({
        ...p,
        manager: profilesData?.find((m) => m.id === p.manager_id),
      }))

      setProfiles(profilesWithManager)
      setFilteredProfiles(profilesWithManager)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      toast.error('Email không đúng định dạng')
      return
    }

    if (newUser.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (newUser.full_name.trim().length < 2) {
      toast.error('Họ tên phải có ít nhất 2 ký tự')
      return
    }

    if (newUser.phone) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(newUser.phone.replace(/\s/g, ''))) {
        toast.error('Số điện thoại phải có 10-11 chữ số')
        return
      }
    }

    try {
      setCreating(true)
      const supabase = createClient()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
      })

      if (authError) throw authError

      // Create profile manually
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: newUser.full_name.trim(),
          phone: newUser.phone?.trim() || null,
          role: newUser.role,
        })

        if (profileError) throw profileError

        toast.success('Đã tạo người dùng mới')
        setShowAddModal(false)
        setNewUser({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'sale',
        })
        fetchData()
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Không thể tạo người dùng')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === user?.id) {
      toast.error('Bạn không thể xóa chính mình')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase.from('profiles').delete().eq('id', userId)

      if (error) throw error

      toast.success('Đã xóa người dùng')
      fetchData()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error('Không thể xóa người dùng')
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
            Quản lý người dùng
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 flex items-center justify-center bg-[#175ead] hover:bg-[#134a8a] rounded-full transition-colors"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-sm text-gray-600">
              Tổng số người dùng: <span className="font-bold text-gray-900">{profiles.length}</span>
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
            />
          </div>

          {/* Users List */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProfiles.map((profile) => {
                const roleBadge = getRoleBadge(profile.role)

                return (
                  <Link key={profile.id} href={`/sales/users/${profile.id}`}>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-2 bg-[rgba(23,94,173,0.1)]"></div>

                      <div className="flex items-start justify-between p-4 pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              profile.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                            }`}
                          >
                            {profile.role === 'admin' ? (
                              <Shield className="w-6 h-6 text-red-600" />
                            ) : (
                              <User className="w-6 h-6 text-[#175ead]" />
                            )}
                          </div>
                        </div>
                        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                      </div>

                      <div className="px-4 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {profile.full_name || 'Chưa cập nhật'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
                        {profile.phone && (
                          <p className="text-sm text-gray-600">{profile.phone}</p>
                        )}
                        {profile.manager && (
                          <p className="text-xs text-gray-500 mt-2">
                            Quản lý: {profile.manager.full_name}
                          </p>
                        )}

                        {/* Delete button (admin only, can't delete self) */}
                        {isAdmin && profile.id !== user?.id && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleDeleteUser(profile.id, profile.full_name || profile.email || '')
                            }}
                            className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa người dùng
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Add User Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Tạo người dùng mới"
          size="md"
        >
          <ModalBody>
            <Input
              label="Email *"
              type="email"
              value={newUser.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="email@example.com"
            />

            <Input
              label="Mật khẩu *"
              type="password"
              value={newUser.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Tối thiểu 6 ký tự"
              helperText="Mật khẩu phải có ít nhất 6 ký tự"
            />

            <Input
              label="Họ và tên *"
              value={newUser.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, full_name: e.target.value })
              }
              placeholder="Nguyễn Văn A"
            />

            <Input
              label="Số điện thoại"
              type="tel"
              value={newUser.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              placeholder="0123456789"
            />

            <Select
              label="Vai trò *"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              options={[
                { value: 'sale', label: 'Sale' },
                { value: 'sale_admin', label: 'Sale Admin' },
                { value: 'warehouse', label: 'Kho' },
                ...(isAdmin ? [{ value: 'admin', label: 'Admin' }] : []),
              ]}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={creating}>
              Hủy
            </Button>
            <Button onClick={handleCreateUser} disabled={creating}>
              {creating ? 'Đang tạo...' : 'Tạo người dùng'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </SalesLayout>
  )
}
