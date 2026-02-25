import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function WarehouseOrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is warehouse
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile as any).role !== 'warehouse') {
    redirect('/auth/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Warehouse Orders</h1>
      <p className="text-gray-500 mt-2">Order fulfillment and management</p>
      
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Warehouse orders page - Coming soon</p>
      </div>
    </div>
  )
}
