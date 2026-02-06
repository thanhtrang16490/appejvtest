'use client'

import { useState } from 'react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
    Lock,
    Eye,
    EyeOff,
    Fingerprint,
    X,
    PhoneCall,
    RotateCcw,
    AlertCircle,
    UserCircle2
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorType, setErrorType] = useState<'none' | 'user_not_found' | 'wrong_password'>('none')
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            if (result.error.toLowerCase().includes('không tồn tại') || result.error.toLowerCase().includes('not found')) {
                setErrorType('user_not_found')
            } else {
                setErrorType('wrong_password')
            }
            setLoading(false)
        } else {
            toast.success('Đăng nhập thành công')
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Red Gradient Background */}
            <div className="absolute inset-0 bg-[#E12B2B] overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-[#B91C1C] rounded-full blur-[120px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#991B1B] rounded-full blur-[100px] opacity-40" />
            </div>

            <div className="relative z-10 w-full max-w-[400px] flex flex-col gap-8">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl">
                        <span className="text-4xl font-black text-white tracking-tighter italic">SLM</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-zinc-950/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                            <UserCircle2 className="w-8 h-8 text-white/40" />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-black text-white tracking-tight">Đăng nhập hệ thống</h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Vui lòng nhập thông tin của bạn</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 rounded-lg group-focus-within:bg-white/10 transition-colors">
                                <UserCircle2 className="w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email của bạn"
                                required
                                className="h-14 pl-14 bg-white/5 border-none text-white placeholder:text-white/20 focus-visible:ring-white/20 rounded-2xl text-lg font-medium transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 rounded-lg group-focus-within:bg-white/10 transition-colors">
                                <Lock className="w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mật khẩu"
                                required
                                className="h-14 pl-14 pr-12 bg-white/5 border-none text-white placeholder:text-white/20 focus-visible:ring-white/20 rounded-2xl text-lg font-medium transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                className="flex-1 h-14 bg-[#E12B2B] hover:bg-[#C52424] text-white text-lg font-black rounded-2xl shadow-lg active:scale-[0.98] transition-all"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-14 w-14 p-0 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl shrink-0"
                            >
                                <Fingerprint className="w-7 h-7" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <button type="button" className="text-xs font-bold text-white/40 hover:text-white transition-colors tracking-tight">
                                Quên mật khẩu?
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">© Phát triển bởi SLM Investment JSC.</p>
                </div>
            </div>

            {/* Error Modals */}
            <Dialog open={errorType !== 'none'} onOpenChange={(open) => !open && setErrorType('none')}>
                <DialogContent className="max-w-[340px] p-0 overflow-hidden border-none bg-white rounded-[2rem] shadow-2xl">
                    <div className="p-8 flex flex-col items-center text-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-100 rounded-3xl blur-xl" />
                            <div className="relative w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100">
                                {errorType === 'user_not_found' ? (
                                    <UserCircle2 className="w-8 h-8 text-red-500" />
                                ) : (
                                    <Lock className="w-8 h-8 text-red-500" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                                {errorType === 'user_not_found' ? 'Tên đăng nhập không tồn tại' : 'Mật khẩu bạn nhập không chính xác.'}
                            </h3>
                            <p className="text-[11px] font-medium text-zinc-400 px-4 leading-relaxed">
                                {errorType === 'user_not_found'
                                    ? 'Vui lòng kiểm tra lại hoặc liên hệ Liên hệ Hỗ trợ để Đăng ký tài khoản mới.'
                                    : 'Vui lòng Thử lại hoặc liên hệ Liên hệ Hỗ trợ để được cấp lại mật khẩu mới.'
                                }
                            </p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl text-xs font-black bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-zinc-100"
                                onClick={() => {/* Contact Support Logic */ }}
                            >
                                <PhoneCall className="w-3 h-3 mr-2" />
                                Liên hệ Hỗ trợ
                            </Button>
                            <Button
                                className="flex-1 h-12 rounded-xl text-xs font-black bg-[#E12B2B] hover:bg-[#C52424] text-white"
                                onClick={() => setErrorType('none')}
                            >
                                <RotateCcw className="w-3 h-3 mr-2" />
                                {errorType === 'user_not_found' ? 'Thử lại' : 'Thử lại'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
