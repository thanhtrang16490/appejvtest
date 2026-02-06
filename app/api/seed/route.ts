import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

function determineCategory(name: string): string {
    const lower = name.toLowerCase()
    if (lower.includes('lợn') || lower.includes('heo')) return 'Lợn'
    if (lower.includes('gà')) return 'Gà'
    if (lower.includes('vịt') || lower.includes('ngan') || lower.includes('ngỗng')) return 'Thủy Cầm'
    if (lower.includes('bò') || lower.includes('trâu')) return 'Gia Súc'
    if (lower.includes('cá') || lower.includes('tôm')) return 'Thủy Sản'
    return 'Khác'
}

export async function GET() {
    const supabase = await createClient()

    try {
        const dataDir = path.join(process.cwd(), 'data_sample')

        // 1. Products
        const productsCsv = fs.readFileSync(path.join(dataDir, 'clean_products.csv'), 'utf-8')
        const products = parse(productsCsv, {
            columns: true,
            skip_empty_lines: true
        })

        const formattedProducts = products.map((p: any) => ({
            code: p['Mã hàng'],
            name: p['Tên mặt hàng'],
            unit: p['Đvt'],
            stock: parseInt(p['ton_kho'].replace(/,/g, '')) || 0,
            price: Math.floor(Math.random() * 100) * 1000 + 10000,
            category: determineCategory(p['Tên mặt hàng'])
        }))

        const { error: productsError } = await supabase.from('products').upsert(formattedProducts as any, { onConflict: 'code' })
        if (productsError) console.error('Products error:', productsError)

        // 2. Customers
        const customersCsv = fs.readFileSync(path.join(dataDir, 'clean_customers.csv'), 'utf-8')
        const customers = parse(customersCsv, {
            columns: true,
            skip_empty_lines: true
        })

        const formattedCustomers = customers.map((c: any) => ({
            code: c['Mã khách'],
            name: c['Tên khách hàng'],
            address: c['Địa chỉ'],
            phone: c['SĐT'],
            assigned_sale: c['Nv bán hàng']
        }))

        const { error: customersError } = await supabase.from('customers').upsert(formattedCustomers as any, { onConflict: 'code' })
        if (customersError) console.error('Customers error:', customersError)

        return NextResponse.json({
            success: true,
            products: formattedProducts.length,
            customers: formattedCustomers.length,
            errors: { products: productsError, customers: customersError }
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
