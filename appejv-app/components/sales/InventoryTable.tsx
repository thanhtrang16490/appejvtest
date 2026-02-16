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

    return (
        <div className="space-y-6">
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

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredProducts.map((product) => {
                    const status = product.stock === 0 ? 'out' : product.stock < 20 ? 'low' : 'ok'
                    const statusColors = {
                        out: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-100' },
                        low: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-100' },
                        ok: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', badge: 'bg-emerald-100' }
                    }
                    const colors = statusColors[status]
                    
                    return (
                        <Card key={product.id} className={`border ${colors.border} shadow-sm overflow-hidden bg-white hover:shadow-md transition-all`}>
                            <CardContent className="p-4">
                                <div className="flex gap-3 mb-3">
                                    <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <Package className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base leading-tight mb-1">{product.name}</h3>
                                        {product.code && (
                                            <p className="text-xs text-gray-500">SKU: {product.code}</p>
                                        )}
                                        <p className="text-sm font-semibold text-amber-600 mt-1">
                                            {formatCurrency(product.price)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`px-3 py-1.5 rounded-lg ${colors.badge}`}>
                                            <p className={`text-sm font-bold ${colors.text}`}>
                                                {product.stock} {product.unit || 'cái'}
                                            </p>
                                        </div>
                                        <StockStatus stock={product.stock} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => window.location.href = `/sales/inventory/${product.id}`}
                                    >
                                        <ChevronRight className="w-4 h-4 mr-1" />
                                        Chi tiết
                                    </Button>
                                    {isAdmin && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-amber-200 text-amber-600 hover:bg-amber-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                openStockEditor(product)
                                            }}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Cập nhật
                                        </Button>
                                    )}
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
                            <TableHead className="py-4 font-bold text-xs uppercase tracking-wider pl-6">Mã</TableHead>
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
                                <TableRow key={product.id} className="hover:bg-amber-50/50 transition-colors border-gray-100">
                                    <TableCell className="font-mono text-xs pl-6 text-gray-600">{product.code}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                                                <Package className={`w-5 h-5 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {product.unit || 'đơn vị'}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StockStatus stock={product.stock} />
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-bold ${colors.text}`}>{product.stock} {product.unit || 'cái'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-amber-600">{formatCurrency(product.price)}</span>
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
