'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: number, newStatus: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await (await supabase).auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Role check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = (profile as any)?.role
    if (role !== 'sale' && role !== 'admin') {
        return { error: 'Forbidden' }
    }

    const { error } = await (supabase
        .from('orders') as any)
        .update({ status: newStatus })
        .eq('id', orderId)

    if (error) return { error: error.message }

    revalidatePath('/sales/orders')
    revalidatePath('/orders') // Revalidate customer view too
    return { success: true }
}

export async function updatePaymentStatus(orderId: number, status: 'paid' | 'unpaid') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = (profile as any)?.role
    if (role !== 'sale' && role !== 'admin' && role !== 'sale_admin') {
        return { error: 'Forbidden' }
    }

    const { error } = await (supabase
        .from('orders') as any)
        .update({ payment_status: status })
        .eq('id', orderId)

    if (error) return { error: error.message }

    revalidatePath(`/sales/orders/${orderId}`)
    revalidatePath('/sales/orders')
    revalidatePath('/sales/customers')
    return { success: true }
}
export async function createOrder(data: { customerId: number, items: { productId: number, quantity: number, price: number }[], total: number }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Role check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = (profile as any)?.role
    if (role !== 'sale' && role !== 'admin') {
        return { success: false, error: 'Forbidden' }
    }

    // 1. Create Order
    const { data: order, error: orderError } = await (supabase
        .from('orders') as any)
        .insert({
            customer_id: data.customerId,
            total_amount: data.total,
            status: 'pending',
            payment_status: 'unpaid',
            sale_id: user.id
        })
        .select()
        .single()

    if (orderError) return { success: false, error: orderError.message }

    // 2. Create Order Items
    const orderItems = data.items.map(item => ({
        order_id: (order as any).id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_order: item.price
    }))

    const { error: itemsError } = await (supabase
        .from('order_items') as any)
        .insert(orderItems)

    if (itemsError) {
        // Simple cleanup
        await (supabase.from('orders') as any).delete().eq('id', (order as any).id)
        return { success: false, error: itemsError.message }
    }

    revalidatePath('/sales/orders')
    revalidatePath('/sales/reports')
    return { success: true, orderId: (order as any).id }
}
