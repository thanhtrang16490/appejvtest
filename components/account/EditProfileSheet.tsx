'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Pencil, Camera, Loader2, X } from 'lucide-react'
import { updateProfile } from '@/app/customer/account/actions'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface EditProfileSheetProps {
    currentName: string
    currentAddress: string
    currentAvatar?: string | null
    onSuccess?: () => void
}

export function EditProfileSheet({ currentName, currentAddress, currentAvatar, onSuccess }: EditProfileSheetProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatar || null)
    const [avatarPath, setAvatarPath] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
            toast.success('Tải ảnh lên thành công')
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi khi tải ảnh lên')
            setAvatarPreview(currentAvatar || null)
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveAvatar = () => {
        setAvatarPreview(null)
        setAvatarPath(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        
        // Add avatar URL to form data if changed
        if (avatarPath) {
            formData.set('avatar_url', avatarPath)
        }
        
        const result = await updateProfile(null, formData)
        setIsLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Cập nhật thông tin thành công')
            setOpen(false)
            // Call onSuccess callback to refetch data
            if (onSuccess) {
                onSuccess()
            } else {
                // Fallback to reload if no callback provided
                window.location.reload()
            }
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <Pencil className="h-4 w-4" />
                    Chỉnh sửa
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90%] md:h-auto md:side-right rounded-t-3xl md:rounded-none">
                <SheetHeader>
                    <SheetTitle className="text-xl">Chỉnh sửa thông tin</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin cá nhân của bạn
                    </SheetDescription>
                </SheetHeader>
                <form action={handleSubmit} className="grid gap-6 py-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-4 border-gray-100">
                                {avatarPreview ? (
                                    <AvatarImage src={avatarPreview} alt="Avatar" />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-[#175ead] to-[#2575be] text-white text-2xl">
                                        {currentName?.[0] || 'U'}
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
                                    className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="rounded-full"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                {avatarPreview ? 'Đổi ảnh' : 'Tải ảnh lên'}
                            </Button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-500 text-center">
                            JPG, PNG, WEBP (tối đa 2MB)
                        </p>
                    </div>

                    {/* Name Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Họ và tên</Label>
                        <Input 
                            id="name" 
                            name="name" 
                            defaultValue={currentName} 
                            required 
                            className="h-12 rounded-xl"
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    {/* Address Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="address" className="text-sm font-semibold">Địa chỉ</Label>
                        <Input 
                            id="address" 
                            name="address" 
                            defaultValue={currentAddress} 
                            className="h-12 rounded-xl"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    <SheetFooter className="gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            className="flex-1 rounded-xl"
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading || uploading}
                            className="flex-1 rounded-xl bg-gradient-to-r from-[#175ead] to-[#2575be]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
