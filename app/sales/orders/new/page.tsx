import { createClient } from '@/lib/supabase/server'
import { NewOrderForm } from './NewOrderForm'
import { redirect } from 'next/navigation'

export default async function NewOrderPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = (profile as any)?.role
    if (role !== 'sale' && role !== 'admin') {
        redirect('/')
    }

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .order('name')

    // Fetch Customers
    const { data: customers } = await supabase
        .from('customers')
        .select('id, name')
        .order('name')

    return (
        <div className="p-6 pb-24 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight">Create New Order</h1>
                <p className="text-muted-foreground mt-1">Select a customer and add items to the basket.</p>
            </div>

            <NewOrderForm
                products={(products || []) as any}
                customers={(customers || []) as any}
            />
        </div>
    )
}
