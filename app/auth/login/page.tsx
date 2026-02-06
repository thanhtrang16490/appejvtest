'use client'

import { useState } from 'react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { HelpCircle, Eye, EyeOff, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(event.currentTarget)
            const result = await login(formData)

            if (result?.error) {
                toast.error(result.error)
                setLoading(false)
            } else if (result?.success) {
                toast.success('Đăng nhập thành công')
                
                // Redirect based on role
                if (['sale', 'admin', 'sale_admin'].includes(result.role)) {
                    router.push('/sales')
                } else {
                    router.push('/customer/dashboard')
                }
            }
        } catch (error: any) {
            toast.error('Có lỗi xảy ra khi đăng nhập')
            setLoading(false)
        }
    }

    const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `https://appejv.app/auth/reset-password`,
            })

            if (error) throw error

            toast.success('Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.')
            setIsForgotPassword(false)
            setResetEmail('')
        } catch (error: any) {
            toast.error(error.message || 'Gửi email thất bại')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        router.back()
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img 
                        src="/appejv-logo.png" 
                        alt="APPE JV Logo" 
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#175ead] to-[#2575be] bg-clip-text text-transparent">
                        APPE JV
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors">
                        <HelpCircle className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Hỗ trợ</span>
                    </button>
                    <button 
                        onClick={handleClose}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Đóng</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 pt-12">
                <div className="w-full max-w-md">
                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isForgotPassword ? 'Quên mật khẩu?' : 'Bạn là nhân viên '}
                        </h1>
                        <p className="text-gray-600">
                            {isForgotPassword 
                                ? 'Nhập email để nhận link khôi phục mật khẩu'
                                : 'Hãy nhập thông tin để đăng nhập hệ thống'}
                        </p>
                    </div>

                    {/* Login/ForgotPassword Form */}
                    {isForgotPassword ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <Input
                                    id="reset-email"
                                    name="reset-email"
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    required
                                    className="h-14 px-4 bg-white border border-gray-200 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#175ead] focus-visible:border-transparent"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#5B9FED] hover:bg-[#4A8FDD] text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(false)
                                        setResetEmail('')
                                    }}
                                    className="text-gray-600"
                                >
                                    <span className="text-[#5B9FED] font-semibold hover:underline">
                                        ← Quay lại đăng nhập
                                    </span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="Nhập email hoặc số điện thoại"
                                required
                                className="h-14 px-4 bg-white border border-gray-200 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#175ead] focus-visible:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                required
                                className="h-14 px-4 pr-12 bg-white border border-gray-200 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#175ead] focus-visible:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#5B9FED] hover:bg-[#4A8FDD] text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setIsForgotPassword(true)}
                                className="text-sm text-gray-500 hover:text-[#5B9FED]"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    </form>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>Một sản phẩm của</span>
                    <div className="flex items-center gap-2">
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV" 
                            className="w-5 h-5 object-contain"
                        />
                        <span className="font-semibold text-gray-700">APPE JV</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
