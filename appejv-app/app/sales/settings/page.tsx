'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  ChevronLeft, 
  Building2, 
  DollarSign, 
  Bell, 
  Shield,
  Save,
  RefreshCw
} from 'lucide-react'

interface CompanySettings {
  company_name: string
  company_address: string
  company_phone: string
  company_email: string
  tax_rate: number
  currency: string
  low_stock_threshold: number
}

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: 'APPE JV',
    company_address: '',
    company_phone: '',
    company_email: '',
    tax_rate: 10,
    currency: 'VND',
    low_stock_threshold: 10
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user!.id)
        .single()

      if (!profileData || profileData.role !== 'admin') {
        toast.error('Bạn không có quyền truy cập trang này')
        router.push('/sales')
        return
      }

      setProfile(profileData)
      
      // Load settings from localStorage (in production, this would be from database)
      const savedSettings = localStorage.getItem('company_settings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // In production, save to database
      // For now, save to localStorage
      localStorage.setItem('company_settings', JSON.stringify(settings))
      
      toast.success('Đã lưu cài đặt thành công')
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast.error('Không thể lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    const defaultSettings: CompanySettings = {
      company_name: 'APPE JV',
      company_address: '',
      company_phone: '',
      company_email: '',
      tax_rate: 10,
      currency: 'VND',
      low_stock_threshold: 10
    }
    setSettings(defaultSettings)
    toast.info('Đã khôi phục cài đặt mặc định')
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
    <div className="min-h-screen bg-[#f0f9ff] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#f0f9ff] border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Cài đặt hệ thống</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Company Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#175ead]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Thông tin công ty</h2>
              <p className="text-xs text-gray-500">Cấu hình thông tin doanh nghiệp</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên công ty
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
                placeholder="Nhập tên công ty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                value={settings.company_address}
                onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
                placeholder="Nhập địa chỉ công ty"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={settings.company_phone}
                  onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.company_email}
                  onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
                  placeholder="contact@company.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Cài đặt kinh doanh</h2>
              <p className="text-xs text-gray-500">Thuế, tiền tệ và các tham số</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thuế VAT (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.tax_rate}
                  onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tiền tệ
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
                >
                  <option value="VND">VND (₫)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Cảnh báo tồn kho</h2>
              <p className="text-xs text-gray-500">Ngưỡng cảnh báo hàng sắp hết</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngưỡng tồn kho thấp
            </label>
            <input
              type="number"
              min="0"
              value={settings.low_stock_threshold}
              onChange={(e) => setSettings({ ...settings, low_stock_threshold: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] text-sm"
              placeholder="10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống sẽ cảnh báo khi số lượng tồn kho thấp hơn giá trị này
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Thông tin hệ thống</h2>
              <p className="text-xs text-gray-500">Phiên bản và trạng thái</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Phiên bản</span>
              <span className="text-sm font-semibold text-gray-900">1.1.0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Framework</span>
              <span className="text-sm font-semibold text-gray-900">Next.js 15</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-semibold text-gray-900">Supabase</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Trạng thái</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Hoạt động
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#175ead] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#134a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu cài đặt
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-900">
            <strong>Lưu ý:</strong> Các cài đặt này áp dụng cho toàn bộ hệ thống. 
            Chỉ admin mới có quyền thay đổi. Một số thay đổi có thể yêu cầu khởi động lại ứng dụng.
          </p>
        </div>
      </div>
    </div>
  )
}
