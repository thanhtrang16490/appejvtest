'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/app/sales/actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Product {
    id?: number
    name: string
    code: string
    price: number
    stock: number
    unit: string
    category: string
}

interface ProductDialogProps {
    product?: Product
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ProductDialog({ product, isOpen, onOpenChange, onSuccess }: ProductDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Product>>(product || {
        name: '',
        code: '',
        price: 0,
        stock: 0,
        unit: 'Cái',
        category: 'Chung'
    })

    const isEdit = !!product?.id

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSubmit = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            }

            const result = isEdit
                ? await updateProduct(product.id!, dataToSubmit)
                : await createProduct(dataToSubmit)

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
                    <DialogTitle className="text-2xl font-black">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Tên sản phẩm</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Sản phẩm X"
                                required
                                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Mã sản phẩm</Label>
                            <Input
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                placeholder="SP001"
                                required
                                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Giá bán (VNĐ)</Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Đơn vị</Label>
                            <Input
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="Cái, Kg..."
                                required
                                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Số lượng tồn</Label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                required
                                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Danh mục</Label>
                            <Input
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Gia dụng..."
                                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
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
