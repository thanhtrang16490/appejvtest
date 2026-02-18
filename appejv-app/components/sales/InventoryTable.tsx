'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Database } from '@/types/database.types'
import { updateStock, deleteProduct } from '@/app/sales/actions'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, AlertCircle, Package, Edit, Trash2, Plus, ChevronRight } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { ProductDialog } from './ProductDialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Product = Database['public']['Tables']['products']['Row']

export function InventoryTable({ initialProducts, isAdmin = false }: { initialProducts: Product[], isAdmin?: boolean }) {
    const [products, setProducts] = useState(initialProducts)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingStock, setEditingStock] = useState<{ product: Product, newStock: string } | null>(null)

    // Update products when initialProducts change
    useEffect(() => {
        setProducts(initialProducts)
    }, [initialProducts])

    // Listen for add product event from parent
    useEffect(() => {
        const handleOpenAdd = () => setIsAddOpen(true)
        window.addEventListener('openAddProduct', handleOpenAdd)
        return () => window.removeEventListener('openAddProduct', handleOpenAdd)
    }, [])

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.code.toLowerCase().includes(search.toLowerCase())
        
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
        
        const matchesStock = stockFilter === 'all' || 
            (stockFilter === 'low' && p.stock > 0 && p.stock < 20) ||
            (stockFilter === 'out' && p.stock === 0)
        
        return matchesSearch && matchesCategory && matchesStock
    })

    const categories = ['all', 'Lợn', 'Gà', 'Thủy Cầm', 'Gia Súc', 'Thủy Sản', 'Khác']

    const handleStockUpdate = async (id: number, val: string) => {
        const newStock = parseInt(val)
        if (isNaN(newStock) || newStock < 0) {
            toast.error('Vui lòng nhập số lượng hợp lệ')
            return
        }

        const result = await updateStock(id, newStock)
        if (result.error) {
            toast.error('Không thể cập nhật tồn kho')
        } else {
            toast.success('Đã cập nhật tồn kho')
            // Update local state
            setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p))
            setEditingStock(null)
        }
    }

    const openStockEditor = (product: Product) => {
        setEditingStock({ product, newStock: product.stock.toString() })
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return

        const result = await deleteProduct(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Đã xóa sản phẩm')
            setProducts(products.filter(p => p.id !== id))
        }
    }

    const StockStatus = ({ stock }: { stock: number }) => {
        if (stock === 0) {
            return (
                <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Hết hàng
                </Badge>
            )
        }
        if (stock < 20) {
            return (
                <Badge className="gap-1 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none">
                    <AlertCircle className="w-3 h-3" />
                    Sắp hết
                </Badge>
            )
        }
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">Còn hàng</Badge>
    }

    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 20).length
    const outOfStockCount = products.filter(p => p.stock === 0).length
    const inStockCount = products.filter(p => p.stock >= 20).length

    return (
        <div className="space-y-4">
            {/* Stock Summary */}
            {!search && stockFilter === 'all' && categoryFilter === 'all' && (
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
                        <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600">Còn hàng</p>
                            <p className="text-base font-bold text-gray-900">{inStockCount}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
                        <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600">Sắp hết</p>
                            <p className="text-base font-bold text-gray-900">{lowStockCount}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
                        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600">Hết hàng</p>
                            <p className="text-base font-bold text-gray-900">{outOfStockCount}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="relative group flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc mã..."
                        className="pl-10 h-12 bg-white border-none shadow-sm focus-visible:ring-primary/20 transition-all rounded-2xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={categoryFilter === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategoryFilter(category)}
                            className={cn(
                                "rounded-full whitespace-nowrap text-sm font-medium",
                                categoryFilter === category 
                                    ? "bg-[#175ead] text-white" 
                                    : "bg-white text-gray-600 border-gray-200"
                            )}
                        >
                            {category === 'all' ? 'Tất cả' : category}
                        </Button>
                    ))}
                </div>

                {/* Stock Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                        variant={stockFilter === 'all' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStockFilter('all')}
                        className={cn(
                            "rounded-full whitespace-nowrap text-sm font-medium",
                            stockFilter === 'all' 
                                ? "bg-[#175ead] text-white" 
                                : "bg-white text-gray-600 border-gray-200"
                        )}
                    >
                        Tất cả ({products.length})
                    </Button>
                    <Button
                        variant={stockFilter === 'low' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStockFilter('low')}
                        className={cn(
                            "rounded-full whitespace-nowrap text-sm font-medium",
                            stockFilter === 'low' 
                                ? "bg-amber-500 text-white hover:bg-amber-600" 
                                : "bg-white text-gray-600 border-gray-200"
                        )}
                    >
                        Sắp hết ({lowStockCount})
                    </Button>
                    <Button
                        variant={stockFilter === 'out' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStockFilter('out')}
                        className={cn(
                            "rounded-full whitespace-nowrap text-sm font-medium",
                            stockFilter === 'out' 
                                ? "bg-red-500 text-white hover:bg-red-600" 
                                : "bg-white text-gray-600 border-gray-200"
                        )}
                    >
                        Hết hàng ({outOfStockCount})
                    </Button>
                </div>
            </div>

            {/* Mobile View: Product Grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
                {filteredProducts.map((product) => {
                    const status = product.stock === 0 ? 'out' : product.stock < 20 ? 'low' : 'ok'
                    const statusConfig = {
                        out: { label: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-100' },
                        low: { label: 'Sắp hết', color: 'text-amber-600', bg: 'bg-amber-100' },
                        ok: { label: 'Còn hàng', color: 'text-emerald-600', bg: 'bg-emerald-100' }
                    }
                    const config = statusConfig[status]
                    
                    return (
                        <Card 
                            key={product.id} 
                            className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer"
                            onClick={() => window.location.href = `/sales/inventory/${product.id}`}
                        >
                            {/* Product Image/Icon */}
                            <div className="relative w-full aspect-square bg-blue-50 flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                    <img 
                                        src={product.image_url} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-10 h-10 text-[#175ead]" />
                                )}
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg ${config.bg}`}>
                                    <span className={`text-[10px] font-semibold ${config.color}`}>
                                        {config.label}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-3">
                                <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
                                    {product.name}
                                </h3>
                                {product.code && (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                                        {product.code}
                                    </p>
                                )}
                                {product.category && (
                                    <p className="text-[11px] text-gray-600 mb-2 truncate">
                                        {product.category}
                                    </p>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <div>
                                        <p className="text-[10px] text-gray-600">Giá</p>
                                        <p className="text-sm font-bold text-[#175ead]">
                                            {formatCurrency(product.price)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-600">Kho</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {product.stock}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block rounded-2xl border-none shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider pl-6">Ảnh</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider">Tên sản phẩm</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider">Trạng thái</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider">Tồn kho</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider">Giá</TableHead>
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider pr-6 text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => {
                            const status = product.stock === 0 ? 'out' : product.stock < 20 ? 'low' : 'ok'
                            const statusColors = {
                                out: { bg: 'bg-red-50', text: 'text-red-600' },
                                low: { bg: 'bg-amber-50', text: 'text-amber-600' },
                                ok: { bg: 'bg-emerald-50', text: 'text-emerald-600' }
                            }
                            const colors = statusColors[status]
                            
                            return (
                                <TableRow key={product.id} className="hover:bg-blue-50/50 transition-colors border-gray-100">
                                    <TableCell className="pl-6">
                                        <div className="w-16 h-16 bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center">
                                            {product.image_url ? (
                                                <img 
                                                    src={product.image_url} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-8 h-8 text-[#175ead]" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-bold text-gray-900">{product.name}</div>
                                            {product.code && (
                                                <div className="text-xs text-gray-500 font-mono">
                                                    {product.code}
                                                </div>
                                            )}
                                            {product.category && (
                                                <div className="text-xs text-gray-500">
                                                    {product.category}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StockStatus stock={product.stock} />
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-bold ${colors.text}`}>{product.stock} {product.unit || 'cái'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-[#175ead]">{formatCurrency(product.price)}</span>
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {isAdmin && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-amber-200 text-amber-600 hover:bg-amber-50"
                                                    onClick={() => openStockEditor(product)}
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Cập nhật
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.location.href = `/sales/inventory/${product.id}`}
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground bg-white rounded-2xl shadow-sm italic">
                    <Package className="w-12 h-12 mb-4 opacity-10" />
                    <p>Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
                </div>
            )}

            {/* Stock Edit Modal */}
            {editingStock && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingStock(null)}>
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Cập nhật tồn kho</h3>
                            <Button variant="ghost" size="sm" onClick={() => setEditingStock(null)}>
                                ✕
                            </Button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">{editingStock.product.name}</p>
                            <p className="text-sm text-gray-600">Tồn kho hiện tại: {editingStock.product.stock} {editingStock.product.unit}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng mới
                            </label>
                            <Input
                                type="number"
                                value={editingStock.newStock}
                                onChange={(e) => setEditingStock({ ...editingStock, newStock: e.target.value })}
                                placeholder="Nhập số lượng"
                                className="text-lg"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setEditingStock(null)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className="flex-1 bg-amber-500 hover:bg-amber-600"
                                onClick={() => handleStockUpdate(editingStock.product.id, editingStock.newStock)}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ProductDialog
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSuccess={() => window.location.reload()}
            />
            {editingProduct && (
                <ProductDialog
                    product={editingProduct as any}
                    isOpen={!!editingProduct}
                    onOpenChange={(open) => !open && setEditingProduct(null)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    )
}
