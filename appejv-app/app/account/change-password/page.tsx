'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate new password
        const passwordError = validatePassword(newPassword)
        if (passwordError) {
            toast.error(passwordError)
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp')
            return
        }

        if (currentPassword === newPassword) {
            toast.error('Mật khẩu mới phải khác mật khẩu hiện tại')
            return
        }

        setLoading(true)

        try {
            // First, verify current password by trying to sign in
            const { data: userData } = await supabase.auth.getUser()
            if (!userData.user?.email) {
                toast.error('Không tìm thấy thông tin người dùng')
                return
            }

            // Try to sign in with current password to verify it
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userData.user.email,
                password: currentPassword,
            })

            if (signInError) {
                toast.error('Mật khẩu hiện tại không đúng')
                return
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (updateError) {
                toast.error('Không thể cập nhật mật khẩu: ' + updateError.message)
                return
            }

            toast.success('Đổi mật khẩu thành công!')
            
            // Clear form
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')

            // Redirect to account page after 2 seconds
            setTimeout(() => {
                router.push('/account')
            }, 2000)
        } catch (error: any) {
            console.error('Change password error:', error)
            toast.error('Có lỗi xảy ra khi đổi mật khẩu')
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = newPassword.length === 0 ? 0 :
        newPassword.length < 8 ? 1 :
        !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) ? 2 :
        !/[0-9]/.test(newPassword) ? 3 : 4

    const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh']

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 p-4">
            <div className="max-w-2xl mx-auto pt-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                </button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full flex items-center justify-center">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Đổi mật khẩu</CardTitle>
                                <CardDescription>
                                    Cập nhật mật khẩu của bạn để bảo mật tài khoản
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        className="h-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                        className="h-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {newPassword && (
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
                                        <div className={`flex items-center gap-2 text-xs ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Ít nhất 8 ký tự</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Có chữ hoa</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Có chữ thường</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Có số</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu mới
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
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">Mật khẩu không khớp</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                    className="flex-1 bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#0d4a8f] hover:to-[#175ead]"
                                >
                                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                </Button>
                            </div>
                        </form>

                        {/* Security Tips */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-2">💡 Mẹo bảo mật:</p>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Sử dụng mật khẩu mạnh và duy nhất</li>
                                <li>Không chia sẻ mật khẩu với ai</li>
                                <li>Đổi mật khẩu định kỳ (3-6 tháng)</li>
                                <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
