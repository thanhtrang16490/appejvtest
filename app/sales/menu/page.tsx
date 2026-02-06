import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { logout } from '@/app/auth/actions'
import {
    BarChart3,
    Users as UsersIcon,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck,
    LayoutDashboard,
    Package,
    NotebookText
} from 'lucide-react'

export default async function MenuPage() {
    const supabase = await createClient()

    // Fetch user and profile in parallel
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const profile = profileData as any
    const isAdmin = profile?.role === 'admin'
    const isSaleAdmin = profile?.role === 'sale_admin'

    const menuItems = [
        {
            title: 'Báo cáo & Phân tích',
            description: 'Xem xu hướng bán hàng, doanh thu và tỷ trọng sản phẩm.',
            href: '/sales/reports',
            icon: BarChart3,
            color: 'text-[#175ead]',
            bg: 'bg-blue-50'
        },
        ...((isAdmin || isSaleAdmin) ? [{
            title: 'Quản lý nhân sự',
            description: 'Quản lý tài khoản nhân viên và phân quyền.',
            href: '/sales/users',
            icon: ShieldCheck,
            color: 'text-rose-500',
            bg: 'bg-rose-50'
        }] : []),
        {
            title: 'Quản lý kho hàng',
            description: 'Kiểm tra tồn kho và thông tin giá bán.',
            href: '/sales/inventory',
            icon: Package,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
        {
            title: 'Danh bạ khách hàng',
            description: 'Xem và quản lý tệp khách hàng được giao.',
            href: '/sales/customers',
            icon: UsersIcon,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50'
        }
    ]

    return (
        <div className="p-4 md:p-8 pb-24 flex flex-col gap-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Trung tâm quản lý</h1>
                <p className="text-muted-foreground font-medium italic">Công cụ hỗ trợ kinh doanh chuyên nghiệp.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Card className="hover:shadow-lg transition-all active:scale-[0.98] border-none shadow-md overflow-hidden group">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg leading-none mb-1">{item.title}</h3>
                                    <p className="text-muted-foreground text-xs line-clamp-1">{item.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t flex flex-col gap-6">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user.email}</p>
                        <p className="text-[10px] uppercase tracking-wider font-black text-primary opacity-70">
                            {profile?.role || 'User'}
                        </p>
                    </div>
                    <form action={logout}>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </form>
                </div>

                <div className="text-[10px] text-muted-foreground text-center font-bold tracking-widest uppercase opacity-30">
                    SalesApp Workspace • v1.2.0
                </div>
            </div>
        </div>
    )
}
