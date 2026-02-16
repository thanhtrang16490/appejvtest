'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createUser } from './actions'
import { Loader2 } from 'lucide-react'

export function UserForm({ onSuccess, saleAdmins }: { onSuccess: () => void, saleAdmins: any[] }) {
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState('customer')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await createUser(formData)

        setLoading(false)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Đã tạo người dùng thành công')
            onSuccess()
                ; (e.target as HTMLFormElement).reset()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Label htmlFor="email">Email đăng nhập</Label>
                <Input id="email" name="email" type="email" required placeholder="example@email.com" className="h-12 rounded-2xl px-4 font-bold" />
            </div>
            <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" name="password" type="password" required minLength={6} placeholder="Tối thiểu 6 ký tự" className="h-12 rounded-2xl px-4 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" name="fullName" required placeholder="Nguyễn Văn A" className="h-12 rounded-2xl px-4 font-bold" />
                </div>
                <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" required placeholder="090..." className="h-12 rounded-2xl px-4 font-bold" />
                </div>
            </div>
            <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Label htmlFor="role">Vai trò</Label>
                <select
                    id="role"
                    name="role"
                    required
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-bold"
                >
                    <option value="customer">Khách hàng</option>
                    <option value="sale">Nhân viên Sale</option>
                    <option value="sale_admin">Sale Admin (Quản lý)</option>
                    <option value="warehouse">Nhân viên Kho</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                </select>
            </div>

            {selectedRole === 'sale' && (
                <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <Label htmlFor="manager_id">Quản lý trực tiếp</Label>
                    <select
                        id="manager_id"
                        name="manager_id"
                        className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-bold"
                    >
                        <option value="">Không có quản lý</option>
                        {saleAdmins.map(admin => (
                            <option key={admin.id} value={admin.id}>{admin.full_name} ({admin.role})</option>
                        ))}
                    </select>
                </div>
            )}
            <Button type="submit" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-4" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Tạo tài khoản'}
            </Button>
        </form>
    )
}
