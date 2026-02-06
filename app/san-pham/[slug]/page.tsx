'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { formatCurrency } from '@/lib/utils'

// Note: Dynamic metadata would require this to be a server component
// For now, we'll use client-side document title updates
// To add proper metadata, convert to server component and use generateMetadata

export default function ProductDetailPublicPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [slug])

    useEffect(() => {
        // Update document title when product loads
        if (product) {
            document.title = `${product.name} - APPE JV`
        }
    }, [product])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const supabase = createClient()

            const { data: productData } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single()

            setProduct(productData)
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <PublicHeader />
                <div className="container mx-auto px-4 py-20 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h1>
                    <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa</p>
                    <Link href="/san-pham">
                        <Button className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white">
                            Quay lại danh sách sản phẩm
                        </Button>
                    </Link>
                </div>
                <PublicFooter />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <PublicHeader />

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-[#175ead]">Trang chủ</Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/san-pham" className="text-gray-600 hover:text-[#175ead]">Sản phẩm</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Detail */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <Package className="h-24 w-24 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="inline-block bg-blue-100 text-[#175ead] px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                    {product.category || 'Sản phẩm'}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-gray-600">Mã sản phẩm: <span className="font-semibold">{product.code}</span></p>
                            </div>

                            <div className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white p-6 rounded-2xl">
                                <p className="text-sm opacity-90 mb-1">Giá bán</p>
                                <p className="text-3xl md:text-4xl font-bold">
                                    {formatCurrency(product.price)}
                                </p>
                                <p className="text-sm opacity-90 mt-1">Đơn vị: {product.unit || 'N/A'}</p>
                            </div>

                            <Card className="bg-white border-none shadow-md">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-4 text-gray-900">Liên hệ đặt hàng</h3>
                                    <div className="space-y-3">
                                        <a 
                                            href="tel:+84351359520" 
                                            className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                        >
                                            <span className="text-2xl">📞</span>
                                            <div>
                                                <p className="text-sm text-gray-600">Hotline</p>
                                                <p className="font-semibold text-emerald-700">+84 3513 595 202/203</p>
                                            </div>
                                        </a>
                                        <a 
                                            href="mailto:info@appe.com.vn" 
                                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                                        >
                                            <span className="text-2xl">✉️</span>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-semibold text-blue-700">info@appe.com.vn</p>
                                            </div>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Description and Specifications */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {product.description && (
                            <Card className="bg-white border-none shadow-md">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {product.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {product.specifications && (
                            <Card className="bg-white border-none shadow-md">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Thông số kỹ thuật</h2>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {product.specifications}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <Link href="/san-pham">
                            <Button variant="outline" className="rounded-full px-6">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Quay lại danh sách sản phẩm
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    )
}
