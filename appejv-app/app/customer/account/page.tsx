'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  LogOut,
  Bell,
  Shield
} from 'lucide-react'

export default function CustomerAccountPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      setProfile(profileData)

      // Fetch customer
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user!.id)
        .single()

      setCustomer(customerData)
      setFormData({
        full_name: customerData?.full_name || '',
        phone: customerData?.phone || '',
        address: customerData?.address || ''
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const supabase = createClient()

      // Update customer
      const { error } = await supabase
        .from('customers')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address
        })
        .eq('id', customer.id)

      if (error) throw error

      // Update profile
      await supabase
        .from('profiles')
        .update({ full_name: formData.full_name })
        .eq('id', user!.id)

      setCustomer({ ...customer, ...formData })
      setEditing(false)
      toast.success('Đã cập nhật thông tin')
    } catch (error: any) {
      console.error('Error saving:', error)
      toast.error('Không thể lưu thông tin')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await signOut()
      router.push('/auth/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#175ead] to-[#0891b2] text-white p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold">{customer?.full_name || 'Khách hàng'}</h1>
          <p className="text-sm opacity-90">{profile?.email}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Thông tin cá nhân</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-[#175ead] text-sm font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      full_name: customer?.full_name || '',
                      phone: customer?.phone || '',
                      address: customer?.address || ''
                    })
                  }}
                  className="flex items-center gap-1 text-gray-600 text-sm font-semibold"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 text-emerald-600 text-sm font-semibold disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Họ tên</p>
                {editing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{customer?.full_name || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900">{customer?.email || profile?.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{customer?.phone || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                {editing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead]"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{customer?.address || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-sm font-semibold text-gray-900">Cài đặt thông báo</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-sm font-semibold text-gray-900">Bảo mật</span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>

        {/* App Info */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>APPE JV Customer Portal</p>
          <p>Version 1.1.0</p>
        </div>
      </div>
    </div>
  )
}
