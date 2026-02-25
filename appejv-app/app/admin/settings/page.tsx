'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Save, Building2, DollarSign, Bell, ShoppingCart } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    companyName: 'APPE JV',
    companyEmail: 'info@appejv.app',
    companyPhone: '0351 3595 202',
    companyAddress: 'Km 50 Quốc lộ 1A, Xã Tiên Tân, Phủ Lý, Hà Nam, Việt Nam',
    taxRate: 10,
    currency: 'VNĐ',
    lowStockThreshold: 20,
    enableNotifications: true,
    enableEmailAlerts: false,
    autoApproveOrders: false,
    requireCustomerApproval: true,
  })

  const handleSave = async () => {
    try {
      setSaving(true)
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Cài đặt đã được lưu')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Không thể lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-gray-500 mt-1">Quản lý cấu hình hệ thống</p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-600" />
            Thông tin công ty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Tên công ty</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone">Số điện thoại</Label>
            <Input
              id="companyPhone"
              value={settings.companyPhone}
              onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress">Địa chỉ</Label>
            <Textarea
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            Cài đặt kinh doanh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Thuế VAT (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Đơn vị tiền tệ</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Ngưỡng cảnh báo tồn kho</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Thông báo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bật thông báo</Label>
              <p className="text-sm text-gray-500">Nhận thông báo trong ứng dụng</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked: boolean) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cảnh báo qua email</Label>
              <p className="text-sm text-gray-500">Gửi email khi có sự kiện quan trọng</p>
            </div>
            <Switch
              checked={settings.enableEmailAlerts}
              onCheckedChange={(checked: boolean) => setSettings({ ...settings, enableEmailAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            Đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tự động duyệt đơn</Label>
              <p className="text-sm text-gray-500">Đơn hàng được duyệt tự động</p>
            </div>
            <Switch
              checked={settings.autoApproveOrders}
              onCheckedChange={(checked: boolean) => setSettings({ ...settings, autoApproveOrders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Yêu cầu xác nhận khách hàng</Label>
              <p className="text-sm text-gray-500">Khách hàng phải xác nhận đơn hàng</p>
            </div>
            <Switch
              checked={settings.requireCustomerApproval}
              onCheckedChange={(checked: boolean) => setSettings({ ...settings, requireCustomerApproval: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700"
          size="lg"
        >
          {saving ? (
            'Đang lưu...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
