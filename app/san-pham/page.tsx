'use client'

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Package, Filter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

type Product = Database['public']['Tables']['products']['Row']

// SEO metadata would be added in a separate metadata file for this page
// export const metadata = { ... }

export default function ProductCataloguePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [loading, setLoading] = useState(true)

    const categories = [
        { id: 'all', name: 'Tất cả', icon: '🏭' },
        { id: 'Pig Feed', name: 'Thức ăn Heo', icon: '🐷' },
        { id: 'Poultry Feed', name: 'Thức ăn Gia Cầm', icon: '🐔' },
        { id: 'Fish Feed', name: 'Thức ăn Thủy Sản', icon: '🐟' },
    ]

    useEffect(() => {
        fetchProducts()
    }, [searchQuery, activeCategory])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            let query = supabase.from('products').select('*')

            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`)
            }

            // Filter by category using id (which matches database values)
            if (activeCategory && activeCategory !== 'all') {
                query = query.eq('category', activeCategory)
            }

            const { data } = await query.order('name', { ascending: true })
            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <PublicHeader />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Danh Mục Sản Phẩm
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 mb-8">
                            Thức ăn chăn nuôi và thủy sản chất lượng cao từ APPE JV
                        </p>
                        
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-6 text-lg rounded-full border-0 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        {categories.map(category => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(category.id)}
                                className={cn(
                                    "rounded-full whitespace-nowrap font-medium transition-all",
                                    activeCategory === category.id 
                                        ? "bg-gradient-to-r from-[#175ead] to-[#2575be] text-white shadow-md" 
                                        : "bg-white text-gray-700 border-gray-300 hover:border-[#2575be]"
                                )}
                            >
                                <span className="mr-1">{category.icon}</span>
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="mb-6 text-gray-600">
                            Tìm thấy <span className="font-semibold text-[#175ead]">{products.length}</span> sản phẩm
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCatalogueCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-500 mb-2">Không tìm thấy sản phẩm</p>
                        <p className="text-gray-400">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="bg-gradient-to-r from-[#175ead] to-[#2575be] text-white py-12 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">Liên hệ tư vấn</h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn giải pháp dinh dưỡng tối ưu cho trang trại của bạn
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="tel:+84351359520" className="text-lg font-semibold hover:text-blue-200 transition-colors">
                            📞 +84 3513 595 202/203
                        </a>
                        <span className="hidden sm:inline text-blue-300">|</span>
                        <a href="mailto:info@appe.com.vn" className="text-lg font-semibold hover:text-blue-200 transition-colors">
                            ✉️ info@appe.com.vn
                        </a>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    )
}

function ProductCatalogueCard({ product }: { product: Product }) {
    return (
        <Link href={`/san-pham/${product.slug || product.id}`}>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#2575be] cursor-pointer">
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-12 w-12 md:h-20 md:w-20 text-gray-300" />
                        </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                        <span className="bg-white/95 backdrop-blur-sm text-[#175ead] px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold shadow-md">
                            {product.category || 'Sản phẩm'}
                        </span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-2 md:p-4">
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 line-clamp-2 group-hover:text-[#175ead] transition-colors">
                        {product.name}
                    </h3>
                </div>
            </Card>
        </Link>
    )
}
