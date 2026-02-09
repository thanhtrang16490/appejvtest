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
    if (!user) redirect('/auth/login')

    // Fetch order with items and products
    const { data: orderData } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                products ( name, code, image_url, unit )
            )
        `)
        .eq('id', id)
        .single()

    // Security check: Ensure order belongs to current user
    const { data: customerData } = await supabase.from('customers').select('id').eq('phone', user.phone as string).single()

    const order = orderData as any
    const customer = customerData as any

    if (!order) return notFound()

    // Verify ownership
    if (!customer || order.customer_id !== customer.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-600">Bạn không có quyền xem đơn hàng này.</p>
                        <Link href="/customer/orders" className="mt-4 inline-block">
                            <Badge className="bg-[#175ead]">Quay lại</Badge>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý'
            case 'processing':
                return 'Đang xử lý'
            case 'shipping':
                return 'Đang giao'
            case 'completed':
                return 'Hoàn thành'
            case 'cancelled':
                return 'Đã hủy'
            default:
                return status
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default'
            case 'cancelled':
                return 'destructive'
            case 'processing':
            case 'shipping':
                return 'secondary'
            default:
                return 'outline'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-50/95 to-cyan-50/95 backdrop-blur-sm border-b border-gray-200">
                <div className="flex items-center gap-3 p-4">
                    <Link href="/customer/orders" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-4">
                {/* Order Info Card */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                    <CardHeader className="p-4 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg text-gray-900">Đơn hàng #{order.id}</CardTitle>
                                <CardDescription className="text-sm text-gray-500 mt-1">
                                    {new Date(order.created_at).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusVariant(order.status)} className="text-xs">
                                {getStatusLabel(order.status)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 text-sm">Sản phẩm</h3>
                            {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                        {item.products?.image_url ? (
                                            <img 
                                                src={item.products.image_url} 
                                                alt={item.products.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                                {item.products?.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {item.products?.name || 'Sản phẩm không xác định'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {item.products?.code} • {item.quantity} {item.products?.unit || 'cái'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formatCurrency(item.price_at_order)} × {item.quantity}
                                        </p>
                                    </div>
                                    
                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            {formatCurrency(item.price_at_order * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Card */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="text-gray-900">{formatCurrency(order.total_amount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="text-gray-900">Miễn phí</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Tổng cộng</span>
                                <span className="font-bold text-xl text-[#175ead]">
                                    {formatCurrency(order.total_amount)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
