'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

type UserRole = 'sale' | 'sale_admin' | 'admin' | 'customer'

export default function AddUserDialog({ open, onOpenChange, onSuccess }: AddUserDialogProps) {
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'sale' as UserRole,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.email || !formData.password || !formData.full_name) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không đúng định dạng')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (formData.full_name.trim().length < 2) {
      toast.error('Họ tên phải có ít nhất 2 ký tự')
      return
    }

    if (formData.phone) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        toast.error('Số điện thoại phải có 10-11 chữ số')
        return
      }
    }

    try {
      setCreating(true)
      const supabase = createClient()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (authError) throw authError

      // Create profile manually
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            full_name: formData.full_name.trim(),
            phone: formData.phone?.trim() || null,
            role: formData.role,
          }] as any)

        if (profileError) throw profileError

        toast.success('Đã tạo người dùng mới')
        setFormData({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'sale',
        })
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Không thể tạo người dùng')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Tạo tài khoản mới cho nhân viên hoặc quản lý
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={creating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={creating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên *</Label>
            <Input
              id="full_name"
              placeholder="Nguyễn Văn A"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={creating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0123456789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={creating}
            />
          </div>

          <div className="space-y-2">
            <Label>Vai trò *</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'customer', label: 'Khách hàng', color: 'border-green-300 hover:bg-green-50' },
                { value: 'sale', label: 'Sale', color: 'border-blue-300 hover:bg-blue-50' },
                { value: 'sale_admin', label: 'Sale Admin', color: 'border-amber-300 hover:bg-amber-50' },
                { value: 'admin', label: 'Admin', color: 'border-red-300 hover:bg-red-50' },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value as UserRole })}
                  disabled={creating}
                  className={`
                    px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors
                    ${formData.role === role.value 
                      ? 'border-current bg-current/10' 
                      : `${role.color} border-gray-200`
                    }
                    ${creating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={creating} className="bg-red-600 hover:bg-red-700">
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo người dùng'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
