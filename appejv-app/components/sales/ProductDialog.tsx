'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createProduct, updateProduct } from '@/app/sales/actions'
import { toast } from 'sonner'
import { Loader2, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface Product {
    id?: number
    name: string
    code: string
    price: number
    stock: number
    unit: string
    category: string
    category_id?: number
    description?: string
    specifications?: string
    image_url?: string
}

interface ProductDialogProps {
    product?: Product
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ProductDialog({ product, isOpen, onOpenChange, onSuccess }: ProductDialogProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null)
    const [imagePath, setImagePath] = useState<string | null>(null)
    const [categories, setCategories] = useState<any[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState<Partial<Product>>(product || {
        name: '',
        code: '',
        price: 0,
        stock: 0,
        unit: 'Cái',
        category: 'Chung',
        category_id: undefined,
        description: '',
        specifications: '',
        image_url: ''
    })

    const isEdit = !!product?.id

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
        }
    }, [isOpen])

    const fetchCategories = async () => {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('display_order')
            
            setCategories(data || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB')
            return
        }

        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload directly to Supabase from client
        setUploading(true)
        try {
            const supabase = createClient()

            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `products/${fileName}`

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            setImagePath(filePath)
            setFormData(prev => ({ ...prev, image_url: publicUrl }))
            toast.success('Tải ảnh lên thành công')
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi khi tải ảnh lên')
            setImagePreview(product?.image_url || null)
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = async () => {
        if (imagePath) {
            try {
                const supabase = createClient()
                await supabase.storage.from('product-images').remove([imagePath])
            } catch (error) {
                console.error('Error deleting image:', error)
            }
        }
        setImagePreview(null)
        setImagePath(null)
        setFormData(prev => ({ ...prev, image_url: '' }))
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
            <DialogContent className="rounded-[2rem] max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Hình ảnh sản phẩm</Label>
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100">
                                    <Image
                                        src={imagePreview}
                                        alt="Product preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#175ead] transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                            <span className="text-sm text-gray-500">Click để tải ảnh lên</span>
                                            <span className="text-xs text-gray-400">JPG, PNG, WEBP (max 5MB)</span>
                                        </>
                                    )}
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                        </div>
                    </div>

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
                            <select
                                value={formData.category_id || ''}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 px-4 text-sm"
                            >
                                <option value="">Chọn danh mục...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Mô tả sản phẩm</Label>
                        <Textarea
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả chi tiết về sản phẩm..."
                            rows={3}
                            className="rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 resize-none"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Thông số kỹ thuật</Label>
                        <Textarea
                            value={formData.specifications || ''}
                            onChange={e => setFormData({ ...formData, specifications: e.target.value })}
                            placeholder="Thông số kỹ thuật, thành phần, hướng dẫn sử dụng..."
                            rows={3}
                            className="rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 resize-none"
                        />
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
