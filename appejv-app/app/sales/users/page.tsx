'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserPlus, Shield, User, Users } from 'lucide-react'
import { AddUserDialog } from './AddUserDialog'
import { DeleteUserButton } from './DeleteUserButton'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollHeader } from '@/hooks/useScrollHeader'

const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
        case 'admin': return <Badge variant="default" className="bg-rose-500 hover:bg-rose-600">Admin</Badge>
        case 'sale_admin': return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Sale Admin</Badge>
        case 'sale': return <Badge variant="secondary" className="bg-indigo-500 text-white hover:bg-indigo-600">Sale</Badge>
        case 'warehouse': return <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">Kho</Badge>
        default: return <Badge variant="outline">Customer</Badge>
    }
}

export default function UsersManagementPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [profiles, setProfiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { isHeaderVisible } = useScrollHeader()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data: { user: currentUser } } = await supabase.auth.getUser()

            if (!currentUser) {
                router.push('/auth/login')
                return
            }

            setUser(currentUser)

            const { data: profileData } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentUser.id)
                .single()

            const isAdmin = (profileData as any)?.role === 'admin'
            const isSaleAdmin = (profileData as any)?.role === 'sale_admin'

            if (!isAdmin && !isSaleAdmin) {
                router.push('/sales')
                return
            }

            setProfile(profileData)

            // Fetch all profiles
            let profilesQuery = supabase.from('profiles').select('*')

            if (isSaleAdmin) {
                // Sale Admin only sees their team
                profilesQuery = profilesQuery.eq('manager_id', currentUser.id)
            }

            const { data: profilesData } = await profilesQuery.order('created_at', { ascending: false })

            const profilesWithManager = (profilesData as any[] || []).map(p => ({
                ...p,
                manager: (profilesData as any[])?.find(m => m.id === p.manager_id)
            }))

            setProfiles(profilesWithManager)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!user || !profile) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
                    <Button onClick={() => router.push('/auth/login')}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        )
    }

    const isAdmin = (profile as any).role === 'admin'
    const saleAdmins = profiles.filter(p => p.role === 'sale_admin' || p.role === 'admin')

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-blue-50 to-cyan-50 transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                {/* Logo and AI Assistant Row */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV Logo" 
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>
            </div>

            {/* Sticky Title Section */}
            <div className={cn(
                "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-2 pt-2 transition-all duration-300",
                !isHeaderVisible ? "top-0" : "top-20"
            )}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                        <p className="text-sm text-gray-600">Quản lý quyền truy cập và vai trò trong hệ thống.</p>
                    </div>
                    <AddUserDialog saleAdmins={saleAdmins} onUserCreated={fetchData} />
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-44 pb-20">
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profiles?.map((p) => (
                            <Card key={p.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white group rounded-2xl">
                                <div className="h-2 bg-[#175ead]/10 group-hover:bg-[#175ead] transition-colors" />
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-gray-100 rounded-xl">
                                            {p.role === 'admin' ? <Shield className="w-6 h-6 text-rose-500" /> : <User className="w-6 h-6 text-[#175ead]" />}
                                        </div>
                                        <RoleBadge role={p.role} />
                                    </div>
                                    <CardTitle className="text-lg mt-4 truncate text-gray-900">{p.full_name || 'No Name'}</CardTitle>
                                    <CardDescription className="text-xs truncate font-mono opacity-60">ID: {p.id}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 pt-2">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Điện thoại:</span>
                                            <span className="font-medium text-gray-900">{p.phone || '---'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày tham gia:</span>
                                            <span className="font-medium text-gray-900">{new Date(p.created_at || '').toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        {p.manager && (
                                            <div className="flex justify-between items-center mt-2 p-2 bg-gray-50 rounded-lg">
                                                <span className="text-[10px] font-bold text-gray-600 uppercase">Quản lý:</span>
                                                <span className="text-[10px] font-bold text-gray-900">{p.manager.full_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <DeleteUserButton userId={p.id} currentUserId={user.id} onUserDeleted={fetchData} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {profiles?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Users className="w-12 h-12 mb-4 opacity-30" />
                            <p className="font-bold text-sm">Chưa có nhân viên nào trong nhóm.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
