'use client'

import { X, Plus, Search } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface QuickSearchProps {
    value: string
    onChange: (v: string) => void
    results: any[]
    onAddToCart: (p: any) => void
    onOpenSheet: () => void
}

export function QuickSearch({ value, onChange, results, onAddToCart, onOpenSheet }: QuickSearchProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
            <div className="flex items-end gap-3">
                <button onClick={onOpenSheet} className="w-14 h-14 bg-[#175ead] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Search className="w-6 h-6 text-white" />
                </button>
                <div className="flex-1 relative">
                    <div className="flex items-center gap-2 h-14 bg-gray-100 rounded-xl px-4">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                            placeholder="Tìm sản phẩm nhanh..."
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            onBlur={() => setTimeout(() => onChange(''), 300)}
                        />
                        {value && <button onClick={() => onChange('')}><X className="w-4 h-4 text-gray-400" /></button>}
                    </div>
                    {value.trim().length >= 2 && (
                        <div className="absolute bottom-16 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 max-h-72 overflow-y-auto z-40">
                            {results.length > 0 ? results.map((p: any) => (
                                <button key={p.id} onMouseDown={() => onAddToCart(p)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-[#175ead]">{p.name?.[0]}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                                        <p className="text-xs text-gray-500">{formatCurrency(p.price)} • Còn: {p.stock}</p>
                                    </div>
                                    <Plus className="w-5 h-5 text-[#175ead] flex-shrink-0" />
                                </button>
                            )) : (
                                <div className="p-4 text-center text-sm text-gray-400">Không tìm thấy sản phẩm</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
