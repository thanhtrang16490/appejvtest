'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createCustomer, updateCustomer } from '@/app/sales/actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Camera, X } from 'lucide-react'

interface Customer {
    id?: string
    name: string
    code: string
    phone: string
    address: string
    assigned_sale?: string
    avatar_url?: string | null
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
    const [uploading, setUploading] = useState(false)
    const [salesUsers, setSalesUsers] = useState<any[]>([])
    const [avatarPreview, setAvatarPreview] = useState<string | null>(customer?.avatar_url || null)
    const [avatarPath, setAvatarPath] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState<Partial<Customer>>(customer || {
        name: '',
        code: '',
        phone: '',
        address: '',
        assigned_sale: '',
        avatar_url: null
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
            setAvatarPreview(customer.avatar_url || null)
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

    const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)')
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 2MB')
            return
        }

        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload directly to Supabase from client
        setUploading(true)
        try {
            const supabase = createClient()

            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarPath(publicUrl)
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
            toast.success('Tải ảnh lên thành công')
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi khi tải ảnh lên')
            setAvatarPreview(customer?.avatar_url || null)
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveAvatar = () => {
        setAvatarPreview(null)
        setAvatarPath(null)
        setFormData(prev => ({ ...prev, avatar_url: null }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSubmit = {
                ...formData,
                avatar_url: avatarPath || formData.avatar_url
            }

            const result = isEdit
                ? await updateCustomer(customer.id!, dataToSubmit)
                : await createCustomer(dataToSubmit)

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
            <DialogContent className="rounded-[2rem] max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">{isEdit ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3 pb-2">
                        <div className="relative">
                            <Avatar className="w-20 h-20 border-4 border-gray-100">
                                {avatarPreview ? (
                                    <AvatarImage src={avatarPreview} alt="Avatar" />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-[#175ead] to-[#2575be] text-white text-xl">
                                        {formData.name?.[0] || 'K'}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                            {avatarPreview && !uploading && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="rounded-full text-xs"
                        >
                            <Camera className="w-3 h-3 mr-1" />
                            {avatarPreview ? 'Đổi ảnh' : 'Tải ảnh'}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />
                    </div>

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
                            disabled={loading || uploading}
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
