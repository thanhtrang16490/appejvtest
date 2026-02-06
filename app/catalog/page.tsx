'use client'

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface CatalogPageProps {
    searchParams: { q?: string; category?: string }
}

export default function CatalogPage() {
    const [products, setProducts] = useState<Database['public']['Tables']['products']['Row'][]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [loading, setLoading] = useState(true)

    const categories = ['All', 'Lợn', 'Gà', 'Thủy Cầm', 'Gia Súc', 'Thủy Sản', 'Khác']

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 50) {
                    setIsHeaderVisible(false)
                } else {
                    setIsHeaderVisible(true)
                }
                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader)
            return () => {
                window.removeEventListener('scroll', controlHeader)
            }
        }
    }, [lastScrollY])

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

            if (activeCategory && activeCategory !== 'All') {
                query = query.eq('category', activeCategory)
            }

            const { data } = await query
            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setSearchQuery(formData.get('q') as string || '')
    }

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
            {/* Fixed Header */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-50 to-blue-50 transition-transform duration-300",
                isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                {/* Logo and AI Assistant Row */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">APPE JV</span>
                    </div>
                    <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-4 py-2 text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Trợ lý AI
                    </Button>
                </div>
            </div>

            {/* Fixed Search and Category Filter */}
            <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-br from-purple-50 to-blue-50 px-4 pb-2">
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">Danh mục sản phẩm</h1>
                    
                    {/* Search */}
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="q"
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full bg-white pl-8 rounded-full border-gray-200"
                            />
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "rounded-full whitespace-nowrap text-sm font-medium",
                                    activeCategory === category 
                                        ? "bg-blue-500 text-white" 
                                        : "bg-white text-gray-600 border-gray-200"
                                )}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content with top padding */}
            <div className="pt-48 pb-20">
                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Đang tải...</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-gray-500 mt-8">
                                    Không tìm thấy sản phẩm nào.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
