import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import UsersList from '@/components/admin/UsersList'

async function getUsersData() {
  const supabase = await createClient()

  // Fetch all profiles (exclude customers)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .neq('role', 'customer')
    .order('created_at', { ascending: false })

  // Add manager info
  const profilesWithManager = (profiles || []).map((p: any) => ({
    ...p,
    manager: profiles?.find((m: any) => m.id === p.manager_id)
  }))

  return profilesWithManager
}

function UsersListSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function UsersPage() {
  const users = await getUsersData()

  return (
    <Suspense fallback={<UsersListSkeleton />}>
      <UsersList users={users} />
    </Suspense>
  )
}
