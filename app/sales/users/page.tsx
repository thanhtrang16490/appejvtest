import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, Shield, User, Users } from 'lucide-react'
import { AddUserDialog } from './AddUserDialog'
import { DeleteUserButton } from './DeleteUserButton'

const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
        case 'admin': return <Badge variant="default" className="bg-rose-500 hover:bg-rose-600">Admin</Badge>
        case 'sale_admin': return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Sale Admin</Badge>
        case 'sale': return <Badge variant="secondary" className="bg-indigo-500 text-white hover:bg-indigo-600">Sale</Badge>
        default: return <Badge variant="outline">Customer</Badge>
    }
}

export default async function UsersManagementPage() {
    const supabase = await createClient()

    // Auth & Role Check
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) redirect('/auth/login')

    const { data: profileData } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    const profile = profileData as any
    const isAdmin = profile?.role === 'admin'
    const isSaleAdmin = profile?.role === 'sale_admin'

    if (!isAdmin && !isSaleAdmin) redirect('/sales')

    // Fetch all profiles
    let profilesQuery = supabase.from('profiles').select('*')

    if (isSaleAdmin) {
        // Sale Admin only sees their team
        profilesQuery = profilesQuery.eq('manager_id', currentUser.id)
    }

    const { data: profilesData } = await profilesQuery.order('created_at', { ascending: false })

    const profiles = (profilesData as any[] || []).map(p => ({
        ...p,
        manager: (profilesData as any[])?.find(m => m.id === p.manager_id)
    }))

    const saleAdmins = profiles.filter(p => p.role === 'sale_admin' || p.role === 'admin')

    return (
        <div className="p-4 md:p-8 flex flex-col gap-6 pb-24 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Quản lý người dùng</h1>
                    <p className="text-muted-foreground">Quản lý quyền truy cập và vai trò trong hệ thống.</p>
                </div>

                <AddUserDialog saleAdmins={saleAdmins} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles?.map((p) => (
                    <Card key={p.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white group">
                        <div className="h-2 bg-primary/10 group-hover:bg-primary transition-colors" />
                        <CardHeader className="p-6 pb-2">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-muted rounded-xl">
                                    {p.role === 'admin' ? <Shield className="w-6 h-6 text-rose-500" /> : <User className="w-6 h-6 text-primary" />}
                                </div>
                                <RoleBadge role={p.role} />
                            </div>
                            <CardTitle className="text-lg mt-4 truncate">{p.full_name || 'No Name'}</CardTitle>
                            <CardDescription className="text-xs truncate font-mono opacity-60">ID: {p.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Điện thoại:</span>
                                    <span className="font-medium">{p.phone || '---'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ngày tham gia:</span>
                                    <span className="font-medium">{new Date(p.created_at || '').toLocaleDateString()}</span>
                                </div>
                                {p.manager && (
                                    <div className="flex justify-between items-center mt-2 p-2 bg-muted/50 rounded-lg">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Quản lý:</span>
                                        <span className="text-[10px] font-black">{p.manager.full_name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex gap-2">
                                <DeleteUserButton userId={p.id} currentUserId={currentUser.id} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {profiles?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Users className="w-12 h-12 mb-4 opacity-10" />
                    <p className="font-bold text-sm">Chưa có nhân viên nào trong nhóm.</p>
                </div>
            )}
        </div>
    )
}
