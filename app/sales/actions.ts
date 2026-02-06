'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStock(productId: number, newStock: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Role check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin' && (profile as any)?.role !== 'sale_admin') return { error: 'Forbidden' }

    const { error } = await (supabase
        .from('products') as any)
        .update({ stock: newStock })
        .eq('id', productId)

    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    revalidatePath('/sales')
    return { success: true }
}

// CUSTOMER ACTIONS
export async function createCustomer(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('customers') as any).insert([data])
    if (error) return { error: error.message }

    revalidatePath('/sales/customers')
    return { success: true }
}

export async function updateCustomer(id: string, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('customers') as any).update(data).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath(`/sales/customers/${id}`)
    revalidatePath('/sales/customers')
    return { success: true }
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('customers') as any).delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/sales/customers')
    return { success: true }
}

// PRODUCT ACTIONS
export async function createProduct(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('products') as any).insert([data])
    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    return { success: true }
}

export async function updateProduct(id: number, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('products') as any).update(data).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    return { success: true }
}

export async function deleteProduct(id: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    return { success: true }
}
