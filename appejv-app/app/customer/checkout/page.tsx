'use client'

import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'

// ...

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient() as SupabaseClient<Database>

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p>Your cart is empty</p>
                <Button onClick={() => router.push('/catalog')}>Go to Catalog</Button>
            </div>
        )
    }

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const address = formData.get('address') as string
        const phone = formData.get('phone') as string
        // Note: Ideally we fetch customer ID from session.

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error('Please login to checkout')
            router.push('/auth/login')
            return
        }

        // 1. Create Order
        // Get customer profile id?
        // Assuming public.customers table maps to profiles or we use user.id directly if customers table is linked
        // However schema has `customers` with Int ID and `profiles` with UUID.
        // And `orders` has `customer_id` (int) FK to `customers`.
        // This implies we need to find the `customer` record for this `user`.
        // I'll assume for now we look up customer by phone or just use a dummy mapping for the prototype if not strictly linked yet.
        // Let's assume we find customer by phone or creates one?
        // For this prototype, I will query `customers` by phone.

        const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', phone) // or use user meta
            .single()

        let customerId = (customerData as any)?.id

        if (!customerId) {
            // If no customer found, maybe create one?
            // Or toast error.
            // For demo, let's just create one or error.
            const { data } = await supabase.from('customers').insert({
                code: 'CUST-' + Date.now(),
                name: 'Guest ' + phone,
                phone: phone,
                address: address
            } as any).select().single()

            customerId = (data as any)?.id
        }

        if (!customerId) {
            toast.error('Could not identify customer.')
            setLoading(false)
            return
        }

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: customerId,
                status: 'pending',
                total_amount: totalPrice(),
                // sale_id is null for direct customer order
            } as any)
            .select()
            .single()

        const order = orderData as any

        if (orderError || !order) {
            toast.error('Failed to create order: ' + orderError?.message)
            setLoading(false)
            return
        }

        // 2. Create Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price_at_order: item.product.price || 0
        }))

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems as any)

        if (itemsError) {
            toast.error('Failed to create order items')
            setLoading(false)
            return
        }

        toast.success('Order placed successfully!')
        clearCart()
        router.push('/customer/orders') // Go to my orders
    }

    return (
        <div className="p-4 flex flex-col gap-6 pb-20 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold">Checkout</h1>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {items.map(item => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>{formatCurrency((item.product.price || 0) * item.quantity)}</span>
                            </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(totalPrice())}</span>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handlePlaceOrder}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Delivery Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="address">Delivery Address</Label>
                                <Input id="address" name="address" required placeholder="123 Main St" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Contact Phone</Label>
                                <Input id="phone" name="phone" type="tel" required placeholder="0909000000" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Placing Order...' : 'Confirm Order'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}
