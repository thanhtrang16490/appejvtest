'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Database } from '@/types/database.types'
import { updateStock, deleteProduct } from '@/app/sales/actions'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, AlertCircle, Package, Edit, Trash2, Plus } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { ProductDialog } from './ProductDialog'
import { Button } from '@/components/ui/button'

type Product = Database['public']['Tables']['products']['Row']

export function InventoryTable({ initialProducts, isAdmin = false }: { initialProducts: Product[], isAdmin?: boolean }) {
    const [products, setProducts] = useState(initialProducts)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)

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
        
        return matchesSearch && matchesCategory
    })

    const categories = ['all', 'Lợn', 'Gà', 'Thủy Cầm', 'Gia Súc', 'Thủy Sản', 'Khác']

    const handleStockUpdate = async (id: number, val: string) => {
        const newStock = parseInt(val)
        if (isNaN(newStock)) return

        const result = await updateStock(id, newStock)
        if (result.error) {
            toast.error('Failed to update stock')
        } else {
            toast.success('Stock updated')
        }
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
        if (stock < 10) {
            return (
                <Badge variant="destructive" className="gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    Sắp hết hàng
                </Badge>
            )
        }
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">Còn hàng</Badge>
    }

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
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="border-none shadow-md overflow-hidden bg-white">
                        <div className={cn("h-1 w-full", product.stock < 10 ? "bg-destructive" : "bg-emerald-500/20")} />
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {product.code}
                                        </span>
                                        <StockStatus stock={product.stock} />
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight truncate">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatCurrency(product.price)} / {product.unit || 'đơn vị'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {isAdmin && (
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon-xs" onClick={() => setEditingProduct(product)}>
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon-xs" className="text-destructive" onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    )}
                                    <div className="p-2 bg-muted rounded-xl self-end">
                                        <Package className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-dashed">
                                <span className="text-sm font-medium">Số lượng tồn kho</span>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        defaultValue={product.stock}
                                        className="h-10 w-24 text-center font-bold bg-muted/50 border-none rounded-xl"
                                        onBlur={(e) => handleStockUpdate(product.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleStockUpdate(product.id, e.currentTarget.value)
                                                e.currentTarget.blur()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block rounded-2xl border-none shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="py-4 font-black text-[10px] uppercase tracking-wider pl-6">Mã</TableHead>
                            <TableHead className="py-4 font-black text-[10px] uppercase tracking-wider">Tên sản phẩm</TableHead>
                            <TableHead className="py-4 font-black text-[10px] uppercase tracking-wider">Trạng thái</TableHead>
                            <TableHead className="py-4 font-black text-[10px] uppercase tracking-wider">Tồn kho</TableHead>
                            <TableHead className="py-4 font-black text-[10px] uppercase tracking-wider pr-6 text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id} className="hover:bg-muted/30 transition-colors border-muted/50">
                                <TableCell className="font-mono text-xs pl-6">{product.code}</TableCell>
                                <TableCell>
                                    <div className="font-bold">{product.name}</div>
                                    <div className="text-[10px] text-muted-foreground opacity-70">
                                        {formatCurrency(product.price)} / {product.unit}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StockStatus stock={product.stock} />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        defaultValue={product.stock}
                                        className="h-9 w-24 text-center font-medium bg-muted/50 border-none focus-visible:ring-primary/20 rounded-lg"
                                        onBlur={(e) => handleStockUpdate(product.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleStockUpdate(product.id, e.currentTarget.value)
                                                e.currentTarget.blur()
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="pr-6">
                                    <div className="flex justify-end gap-1">
                                        {isAdmin && (
                                            <>
                                                <Button variant="ghost" size="icon-sm" onClick={() => setEditingProduct(product)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground bg-white rounded-2xl shadow-sm italic">
                    <Package className="w-12 h-12 mb-4 opacity-10" />
                    <p>Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
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
