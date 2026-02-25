import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

async function getAdminStats() {
  const supabase = await createClient()

  // Fetch users count (exclude customers)
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('role', 'customer')

  // Fetch customers count
  const { count: customersCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  // Fetch products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Fetch orders count
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // Fetch pending orders count
  const { count: pendingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Fetch total revenue (completed orders)
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')

  const totalRevenue = revenueData?.reduce((sum, order: any) => sum + (order.total_amount || 0), 0) || 0

  return {
    totalUsers: usersCount || 0,
    totalCustomers: customersCount || 0,
    totalProducts: productsCount || 0,
    totalOrders: ordersCount || 0,
    totalRevenue,
    pendingOrders: pendingCount || 0,
  }
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboard stats={stats} />
    </Suspense>
  )
}
