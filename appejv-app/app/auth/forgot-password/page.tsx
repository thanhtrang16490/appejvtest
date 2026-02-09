'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, Mail, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [tempPassword, setTempPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Mật khẩu tạm thời đã được tạo!')
                setEmailSent(true)
                
                // In development, password is returned for testing
                if (data.temporary_password) {
                    setTempPassword(data.temporary_password)
                }
            } else {
                toast.error(data.error || 'Có lỗi xảy ra')
            }
        } catch (error: any) {
            console.error('Forgot password error:', error)
            toast.error('Không thể kết nối đến server')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tempPassword)
        toast.success('Đã copy mật khẩu!')
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
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        {!emailSent ? (
                            <>
                                {/* Icon */}
                                <div className="w-16 h-16 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-8 h-8 text-white" />
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#175ead] to-[#2575be] bg-clip-text text-transparent">
                                    Quên mật khẩu?
                                </h1>
                                <p className="text-center text-gray-600 mb-8">
                                    Nhập email để nhận mật khẩu tạm thời
                                </p>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="h-12"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full h-12 bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#0d4a8f] hover:to-[#175ead] text-white font-semibold rounded-xl"
                                    >
                                        {loading ? 'Đang xử lý...' : 'Lấy mật khẩu tạm thời'}
                                    </Button>
                                </form>

                                {/* Back to Login */}
                                <div className="mt-6">
                                    <button
                                        onClick={() => router.push('/auth/login')}
                                        className="flex items-center justify-center gap-2 w-full text-sm text-gray-600 hover:text-primary"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Quay lại đăng nhập
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Success Icon */}
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>

                                {/* Success Message */}
                                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
                                    Mật khẩu tạm thời đã được tạo!
                                </h1>
                                
                                {tempPassword ? (
                                    <>
                                        <p className="text-center text-gray-600 mb-6">
                                            Sử dụng mật khẩu dưới đây để đăng nhập
                                        </p>

                                        {/* Temporary Password Display */}
                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                                            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                                                Mật khẩu tạm thời của bạn:
                                            </p>
                                            <div className="flex items-center gap-2 bg-white rounded-lg p-4 border border-blue-300">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={tempPassword}
                                                    readOnly
                                                    className="flex-1 text-center text-lg font-mono font-bold border-0 focus-visible:ring-0"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <Eye className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={copyToClipboard}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Copy className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Instructions */}
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-yellow-800 font-medium mb-2">
                                                ⚠️ Lưu ý quan trọng:
                                            </p>
                                            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                                                <li>Đăng nhập bằng mật khẩu tạm thời này</li>
                                                <li>Đổi mật khẩu ngay sau khi đăng nhập</li>
                                                <li>Không chia sẻ mật khẩu này với ai</li>
                                            </ul>
                                        </div>

                                        {/* Login Button */}
                                        <Button
                                            onClick={() => router.push('/auth/login')}
                                            className="w-full h-12 bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#0d4a8f] hover:to-[#175ead] text-white font-semibold rounded-xl"
                                        >
                                            Đăng nhập ngay
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-center text-gray-600 mb-4">
                                            Mật khẩu tạm thời đã được gửi qua email
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-blue-800 text-center">
                                                Vui lòng kiểm tra email để nhận mật khẩu tạm thời.
                                            </p>
                                            <p className="text-sm text-blue-800 text-center mt-2">
                                                Hoặc liên hệ quản trị viên:
                                            </p>
                                            <p className="text-sm font-semibold text-blue-900 text-center mt-2">
                                                📞 +84 3513 595 202
                                            </p>
                                            <p className="text-sm font-semibold text-blue-900 text-center">
                                                📧 info@appe.com.vn
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => router.push('/auth/login')}
                                            className="w-full h-12 bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#0d4a8f] hover:to-[#175ead] text-white font-semibold rounded-xl"
                                        >
                                            Quay lại đăng nhập
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
