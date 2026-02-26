'use client'

import { X } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface ProductSheetProps {
    products: any[]
    filteredProducts: any[]
    categories: { id: any; name: string; count: number }[]
    activeCategory: string
    sheetSearch: string
    onCategoryChange: (id: string) => void
    onSearchChange: (v: string) => void
    onAddToCart: (p: any) => void
    onClose: () => void
}

export function ProductSheet({ products, filteredProducts, categories, activeCategory, sheetSearch, onCategoryChange, onSearchChange, onAddToCart, onClose }: ProductSheetProps) {
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Chọn sản phẩm ({products.length})</span>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 h-10">
                        <span className="text-gray-400">🔍</span>
                        <input className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400" placeholder="Tìm sản phẩm..."
                            value={sheetSearch} onChange={e => onSearchChange(e.target.value)} />
                        {sheetSearch && <button onClick={() => onSearchChange('')}><X className="w-4 h-4 text-gray-400" /></button>}
                    </div>
                </div>
                <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b border-gray-100 scrollbar-hide">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => onCategoryChange(cat.id.toString())}
                            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0",
                                activeCategory === cat.id.toString() ? "bg-[#175ead] text-white" : "bg-gray-100 text-gray-600")}>
                            {cat.name} ({cat.count})
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-3 gap-3">
                        {filteredProducts.map(p => (
                            <button key={p.id} onClick={() => onAddToCart(p)} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#175ead]/30">
                                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden">
                                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} /> : <span className="text-xl font-bold text-[#175ead]">{p.name?.[0]}</span>}
                                </div>
                                <span className="text-xs font-semibold text-gray-900 text-center line-clamp-2">{p.name}</span>
                                <span className="text-xs font-bold text-[#175ead]">{formatCurrency(p.price)}</span>
                                <span className="text-[10px] text-gray-400">Còn: {p.stock}</span>
                            </button>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-3 py-12 text-center text-gray-400 text-sm">Không có sản phẩm</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
