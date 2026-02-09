'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export default function ResetPasswordPage() {
    const [mounted, setMounted] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isValidToken, setIsValidToken] = useState(false)
    const [checking, setChecking] = useState(true)
    const [token, setToken] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        setMounted(true)
        const tokenParam = searchParams.get('token')
        if (tokenParam) {
            setToken(tokenParam)
            verifyToken(tokenParam)
        } else {
            toast.error('Token không hợp lệ')
            setTimeout(() => router.push('/auth/login'), 2000)
        }
    }, [searchParams])

    const verifyToken = async (tokenValue: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/verify-reset-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: tokenValue }),
            })

            const data = await response.json()

            if (response.ok && data.valid) {
                setIsValidToken(true)
            } else {
                toast.error('Token không hợp lệ hoặc đã hết hạn')
                setTimeout(() => router.push('/auth/login'), 2000)
            }
        } catch (error) {
            console.error('Verify token error:', error)
            toast.error('Không thể xác thực token')
            setTimeout(() => router.push('/auth/login'), 2000)
        } finally {
            setChecking(false)
        }
    }

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 8) {
            return 'Mật khẩu phải có ít nhất 8 ký tự'
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Mật khẩu phải có ít nhất 1 chữ hoa'
        }
        if (!/[a-z]/.test(pwd)) {
            return 'Mật khẩu phải có ít nhất 1 chữ thường'
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Mật khẩu phải có ít nhất 1 số'
        }
        return null
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        // Validate passwords
        const passwordError = validatePassword(password)
        if (passwordError) {
            toast.error(passwordError)
            return
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp')
            return
        }

        setLoading(true)

        try {
            // Reset password via API
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    password: password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Đặt lại mật khẩu thành công!')
                
                // Sign out any existing session
                const supabase = createClient()
                await supabase.auth.signOut()
                
                setTimeout(() => {
                    router.push('/auth/login?message=password_reset_success')
                }, 1500)
            } else {
                toast.error(data.error || 'Có lỗi xảy ra khi đặt lại mật khẩu')
            }
        } catch (error: any) {
            console.error('Reset password error:', error)
            toast.error('Không thể kết nối đến server')
        } finally {
            setLoading(false)
        }
    }

    if (checking) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang xác thực...</p>
                </div>
            </div>
        )
    }

    if (!isValidToken || !mounted) {
        return null
    }

    const passwordStrength = password.length === 0 ? 0 :
        password.length < 8 ? 1 :
        !/[A-Z]/.test(password) || !/[a-z]/.test(password) ? 2 :
        !/[0-9]/.test(password) ? 3 : 4

    const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh']

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
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-white" />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#175ead] to-[#2575be] bg-clip-text text-transparent">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-center text-gray-600 mb-8">
                            Nhập mật khẩu mới cho tài khoản của bạn
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                        className="h-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                                        level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${
                                            passwordStrength === 4 ? 'text-green-600' :
                                            passwordStrength === 3 ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                            Độ mạnh: {strengthLabels[passwordStrength]}
                                        </p>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                <div className="mt-3 space-y-1">
                                    <p className="text-xs text-gray-600 font-medium">Yêu cầu mật khẩu:</p>
                                    <div className="space-y-1">
                                        <div className={`flex items-center gap-2 text-xs ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Ít nhất 8 ký tự</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Có chữ hoa</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Có chữ thường</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Có số</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới"
                                        className="h-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">Mật khẩu không khớp</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                className="w-full h-12 bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#0d4a8f] hover:to-[#175ead] text-white font-semibold rounded-xl"
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                            </Button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="text-sm text-gray-600 hover:text-primary"
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
