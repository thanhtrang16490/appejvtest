'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Package, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HeaderMenu } from '@/components/layout/HeaderMenu'
import { NotificationModal } from '@/components/layout/NotificationModal'
import { ProductDialog } from '@/components/sales/ProductDialog'
import { useScrollHeader } from '@/hooks/useScrollHeader'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const { isHeaderVisible } = useScrollHeader()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [product, setProduct] = useState<any>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [id])

    const fetchData = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth/login')
                return
            }

            setUser(user)

            const { data: profileData } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (!profileData || !['sale', 'admin', 'sale_admin'].includes((profileData as any).role)) {
                router.push('/')
                return
            }

            setProfile(profileData)

            // Fetch product with cache busting
            const { data: productData } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .is('deleted_at', null)
                .single()

            // Force update state to trigger re-render
            setProduct(null)
            setTimeout(() => {
                setProduct(productData)
            }, 0)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        )
    }

    if (!product || !user || !profile) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Không tìm thấy sản phẩm</div>
            </div>
        )
    }

    const isAdmin = (profile as any).role === 'admin'

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-blue-50 to-cyan-50 transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <img 
                            src="/appejv-logo.png" 
                            alt="APPE JV Logo" 
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <NotificationModal user={user} role={(profile as any).role} />
                        <HeaderMenu user={user} role={(profile as any).role} />
                    </div>
                </div>
            </div>

            {/* Sticky Title Section */}
            <div className={cn(
                "sticky left-0 right-0 z-40 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 pb-3 pt-2 transition-all duration-300",
                !isHeaderVisible ? "top-0" : "top-20"
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/sales/inventory">
                            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h1>
                            <p className="text-sm text-gray-600">Thông tin và quản lý sản phẩm</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button
                            onClick={() => setIsEditOpen(true)}
                            className="bg-[#175ead] hover:bg-blue-600 rounded-full w-10 h-10 p-0"
                        >
                            <Edit className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-44 pb-20">
                <div className="p-4 space-y-4">
                    {/* Product Image */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardContent className="p-4">
                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                {product.image_url ? (
                                    <Image
                                        src={`${product.image_url}?t=${Date.now()}`}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                        key={product.image_url}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Package className="h-20 w-20 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Info */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardHeader className="p-4 pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                                        {product.name}
                                    </CardTitle>
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                        {product.code}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">Danh mục</p>
                                    <p className="font-semibold text-gray-900">{product.category || 'Chưa phân loại'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-1">Đơn vị</p>
                                    <p className="font-semibold text-gray-900">{product.unit || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Giá bán</p>
                                <p className="text-2xl font-bold text-[#175ead]">
                                    {new Intl.NumberFormat('vi-VN').format(product.price)} VNĐ
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Tồn kho</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {product.stock} {product.unit || 'đơn vị'}
                                    </p>
                                    <Badge className={cn(
                                        "text-xs",
                                        product.stock > 20 
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : product.stock > 0
                                            ? "bg-amber-100 text-amber-700 border-amber-200"
                                            : "bg-rose-100 text-rose-700 border-rose-200"
                                    )}>
                                        {product.stock > 20 ? 'Còn nhiều' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    {(product.description || product.specifications) && (
                        <>
                            {product.description && (
                                <Card className="bg-white rounded-2xl shadow-sm border-0">
                                    <CardHeader className="p-4 pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-700">Mô tả sản phẩm</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.description}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {product.specifications && (
                                <Card className="bg-white rounded-2xl shadow-sm border-0">
                                    <CardHeader className="p-4 pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-700">Thông số kỹ thuật</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.specifications}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {/* System Info */}
                    <Card className="bg-white rounded-2xl shadow-sm border-0">
                        <CardHeader className="p-4 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-700">Thông tin hệ thống</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Ngày tạo</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {new Date(product.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-sm text-gray-600">ID sản phẩm</span>
                                <span className="text-sm font-medium text-gray-900">#{product.id}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Dialog */}
            {isAdmin && (
                <ProductDialog
                    product={product}
                    isOpen={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    onSuccess={fetchData}
                />
            )}
        </div>
    )
}
