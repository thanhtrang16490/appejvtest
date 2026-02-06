'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCustomer, updateCustomer } from '@/app/sales/actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Customer {
    id?: string
    name: string
    code: string
    phone: string
    address: string
    assigned_sale?: string
}

interface CustomerDialogProps {
    customer?: Customer
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    isAdmin?: boolean
}

export function CustomerDialog({ customer, isOpen, onOpenChange, onSuccess, isAdmin = false }: CustomerDialogProps) {
    const [loading, setLoading] = useState(false)
    const [salesUsers, setSalesUsers] = useState<any[]>([])
    const [formData, setFormData] = useState<Partial<Customer>>(customer || {
        name: '',
        code: '',
        phone: '',
        address: '',
        assigned_sale: ''
    })

    const isEdit = !!customer?.id

    useEffect(() => {
        if (isAdmin && isOpen) {
            fetchSalesUsers()
        }
    }, [isAdmin, isOpen])

    useEffect(() => {
        if (customer) {
            setFormData(customer)
        }
    }, [customer])

    const fetchSalesUsers = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .in('role', ['sale', 'sale_admin', 'admin'])
            .order('full_name')
        
        setSalesUsers(data || [])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = isEdit
                ? await updateCustomer(customer.id!, formData)
                : await createCustomer(formData)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công')
                onOpenChange(false)
                onSuccess?.()
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[2rem] max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">{isEdit ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-60">Tên khách hàng</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nguyễn Văn A"
                            required
                            className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest opacity-60">Mã khách hàng</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                            placeholder="KH001"
                            required
                            className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest opacity-60">Số điện thoại</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="090..."
                            className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest opacity-60">Địa chỉ</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Đường..."
                            className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                        />
                    </div>
                    
                    {isAdmin && (
                        <div className="space-y-2">
                            <Label htmlFor="assigned_sale" className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                User phụ trách
                            </Label>
                            <select
                                id="assigned_sale"
                                value={formData.assigned_sale || ''}
                                onChange={e => setFormData({ ...formData, assigned_sale: e.target.value })}
                                className="w-full h-12 rounded-2xl bg-muted/30 border-none px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">-- Chọn user phụ trách --</option>
                                {salesUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.full_name || 'Không có tên'} ({user.role === 'admin' ? 'Admin' : user.role === 'sale_admin' ? 'Sale Admin' : 'Sale'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <DialogFooter className="pt-4 flex !flex-row gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-2xl font-bold"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-2xl font-bold bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? 'Cập nhật' : 'Thêm mới')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
