import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = params

    // Auth check
    const { data: { user } } = await (await supabase).auth.getUser()
    if (!user) redirect('/auth/customer-login')

    // Fetch order with items and products
    const { data: orderData } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                products ( name, code, image_url )
            )
        `)
        .eq('id', id)
        .single()

    // Security check: Ensure order belongs to current user
    // We need to look up the customer record for this user first
    const { data: customerData } = await supabase.from('customers').select('id').eq('phone', user.phone as string).single()

    const order = orderData as any
    const customer = customerData as any

    if (!order) return notFound()

    // Verify ownership
    if (!customer || order.customer_id !== customer.id) {
        return <div className="p-4">Unauthorized to view this order.</div>
    }

    return (
        <div className="p-4 flex flex-col gap-6 pb-20">
            <div className="flex items-center gap-2">
                <Link href="/customer/orders" className="p-2 -ml-2 hover:bg-muted rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            <Card>
                <CardHeader className="p-4 pb-2 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <CardDescription>
                                {new Date(order.created_at).toLocaleString()}
                            </CardDescription>
                        </div>
                        <Badge variant={
                            order.status === 'completed' ? 'default' :
                                order.status === 'cancelled' ? 'destructive' :
                                    'secondary'
                        }>
                            {order.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-4">
                        {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{item.products?.name || 'Unknown Item'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.products?.code} x {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{formatCurrency(item.price_at_order * item.quantity)}</p>
                                    <p className="text-xs text-muted-foreground">{formatCurrency(item.price_at_order)} / ea</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-between items-center bg-muted/20 -mx-4 -mb-4 p-4">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-lg text-primary">{formatCurrency(order.total_amount)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
