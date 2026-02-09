import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    try {
        // 1. Get Sale Agent ID (sale@demo.com)
        const { data: saleUsers } = await supabaseAdmin.from('profiles').select('id').eq('role', 'sale').limit(1)
        const saleAgentId = saleUsers?.[0]?.id

        if (!saleAgentId) {
            return NextResponse.json({ error: 'Sale agent not found. Please seed users first.' }, { status: 400 })
        }

        // 2. Seed Products
        const products = [
            { code: 'P001', name: 'Premium Coffee Beans', price: 250000, stock: 50, category: 'Coffee', unit: 'kg' },
            { code: 'P002', name: 'Arabica Special', price: 350000, stock: 30, category: 'Coffee', unit: 'kg' },
            { code: 'P003', name: 'Green Tea Matcha', price: 180000, stock: 100, category: 'Tea', unit: 'pack' },
            { code: 'P004', name: 'Paper Cups (Large)', price: 2000, stock: 5000, category: 'Supplies', unit: 'pcs' },
            { code: 'P005', name: 'Oat Milk 1L', price: 85000, stock: 24, category: 'Supplies', unit: 'liter' },
            { code: 'P006', name: 'Robusta Bold', price: 200000, stock: 80, category: 'Coffee', unit: 'kg' },
            { code: 'P007', name: 'Earl Grey Tea', price: 120000, stock: 40, category: 'Tea', unit: 'box' },
            { code: 'P008', name: 'Bamboo Straws', price: 1500, stock: 1000, category: 'Supplies', unit: 'pcs' },
            { code: 'P009', name: 'Caramel Syrup', price: 220000, stock: 12, category: 'Syrup', unit: 'bottle' },
            { code: 'P010', name: 'Vanilla Syrup', price: 220000, stock: 15, category: 'Syrup', unit: 'bottle' },
        ]

        const { data: seededProducts, error: prodError } = await supabaseAdmin.from('products').upsert(products, { onConflict: 'code' }).select()
        if (prodError) throw prodError

        // 3. Seed Customers
        const customers = [
            { code: 'C001', name: 'Morning Glow Cafe', address: '123 District 1, HCMC', phone: '0901234567', assigned_sale: saleAgentId },
            { code: 'C002', name: 'The Urban Hub', address: '456 District 3, HCMC', phone: '0907654321', assigned_sale: saleAgentId },
            { code: 'C003', name: 'Sunset Library', address: '789 District 7, HCMC', phone: '0909998887', assigned_sale: saleAgentId },
            { code: 'C004', name: 'Petal & Brew', address: '101 District 2, HCMC', phone: '0912233445', assigned_sale: saleAgentId },
            { code: 'C005', name: 'Velocity Coworking', address: '202 Binh Thanh, HCMC', phone: '0988776655', assigned_sale: saleAgentId },
        ]

        const { data: seededCustomers, error: custError } = await supabaseAdmin.from('customers').upsert(customers, { onConflict: 'code' }).select()
        if (custError) throw custError

        // 4. Seed Orders (Historical)
        const sampleOrders = []
        const sampleOrderItems = []

        const now = new Date()
        const statuses = ['completed', 'processing', 'pending']

        for (let i = 0; i < 25; i++) {
            const customer = seededCustomers[Math.floor(Math.random() * seededCustomers.length)]
            const status = statuses[Math.floor(Math.random() * statuses.length)]

            // Random date in last 90 days
            const orderDate = new Date()
            orderDate.setDate(now.getDate() - Math.floor(Math.random() * 90))

            // Random items (1-3 per order)
            const numItems = Math.floor(Math.random() * 3) + 1
            let orderTotal = 0
            const itemsForThisOrder = []

            for (let j = 0; j < numItems; j++) {
                const product = seededProducts[Math.floor(Math.random() * seededProducts.length)]
                const qty = Math.floor(Math.random() * 5) + 1
                const price = (product as any).price
                orderTotal += price * qty
                itemsForThisOrder.push({
                    product_id: (product as any).id,
                    quantity: qty,
                    price_at_order: price
                })
            }

            sampleOrders.push({
                customer_id: (customer as any).id,
                sale_id: saleAgentId,
                status: status,
                total_amount: orderTotal,
                created_at: orderDate.toISOString()
            })

            sampleOrderItems.push(itemsForThisOrder)
        }

        // Insert Orders one by one to get IDs for items (bulk insert doesn't return ordered IDs reliably for mapping in simple JS)
        const finalResults = []
        for (let i = 0; i < sampleOrders.length; i++) {
            const { data: order, error: oErr } = await supabaseAdmin.from('orders').insert(sampleOrders[i]).select().single()
            if (oErr) continue

            const itemsWithId = sampleOrderItems[i].map(item => ({ ...item, order_id: order.id }))
            await supabaseAdmin.from('order_items').insert(itemsWithId)
            finalResults.push(order.id)
        }

        return NextResponse.json({
            success: true,
            products: seededProducts.length,
            customers: seededCustomers.length,
            orders: finalResults.length
        })

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
