'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { ChevronLeft, X, Plus, Minus, Grid3x3, FileText, CheckCircle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QuantityModal, SuccessModal } from '@/components/sales/SellingModals'
import { ProductSheet } from '@/components/sales/ProductSheet'
import { QuickSearch } from '@/components/sales/QuickSearch'

export default function SellingPage() {
    const [user, setUser] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [customers, setCustomers] = useState<any[]>([])
    const [cart, setCart] = useState<any[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [customerSearch, setCustomerSearch] = useState('')
    const [quickSearch, setQuickSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [sheetSearch, setSheetSearch] = useState('')
    const [showProductSheet, setShowProductSheet] = useState(false)
    const [showQuantityModal, setShowQuantityModal] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [tempQty, setTempQty] = useState('')
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [createdOrderId, setCreatedOrderId] = useState<any>(null)
    const [orderNotes, setOrderNotes] = useState('')
    const [isCreatingOrder, setIsCreatingOrder] = useState(false)
    const [loading, setLoading] = useState(true)
    const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
    const toastId = useRef(0)
    const router = useRouter()

    useEffect(() => { fetchData() }, [])

    const addToast = useCallback((msg: string) => {
        const id = toastId.current++
        setToasts(p => [...p, { id, msg }])
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2500)
    }, [])

    const fetchData = async () => {
        try {
            const sb = createClient()
            const { data: { user } } = await sb.auth.getUser()
            if (!user) { router.push('/auth/login'); return }
            setUser(user)
            const { data: pd } = await sb.from('profiles').select('role').eq('id', user.id).single()
            if (!pd || !['sale', 'admin', 'sale_admin'].includes((pd as any).role)) { router.push('/'); return }
            const [{ data: prods }, { data: cats }, { data: custs }] = await Promise.all([
                sb.from('products').select('*').gt('stock', 0).order('name'),
                sb.from('categories').select('*').order('name'),
                sb.from('customers').select('id, name, phone, code').order('name'),
            ])
            setProducts(prods || [])
            setCategories(cats || [])
            setCustomers(custs || [])
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const addToCart = useCallback((product: any) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === product.id)
            if (ex) { addToast(`Tăng SL: "${product.name}"`); return prev.map(i => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i) }
            addToast(`Thêm: "${product.name}"`)
            return [...prev, { ...product, quantity: 1 }]
        })
    }, [addToast])

    const updateQty = useCallback((id: number, delta: number) => {
        setCart(prev => prev.map(i => { if (i.id !== id) return i; const nq = i.quantity + delta; if (nq <= 0) return null; return { ...i, quantity: Math.min(nq, i.stock) } }).filter(Boolean) as any[])
    }, [])

    const handleQtyEdit = (item: any) => { setEditingItem(item); setTempQty(item.quantity.toString()); setShowQuantityModal(true) }

    const handleQtySubmit = () => {
        if (!editingItem) return
        const q = parseInt(tempQty)
        if (!isNaN(q) && q > 0) setCart(prev => prev.map(i => i.id === editingItem.id ? { ...i, quantity: Math.min(q, i.stock) } : i))
        setShowQuantityModal(false); setEditingItem(null); setTempQty('')
    }

    const handleDeleteItem = () => {
        if (!editingItem) return
        setCart(prev => prev.filter(i => i.id !== editingItem.id))
        setShowQuantityModal(false); setEditingItem(null)
    }

    const getTotal = () => cart.reduce((s, i) => s + i.price * i.quantity, 0)

    const handleCompleteOrder = async () => {
        if (cart.length === 0) return
        try {
            setIsCreatingOrder(true)
            const sb = createClient()
            const { data: od, error: oErr } = await (sb as any).from('orders').insert([{
                customer_id: selectedCustomer?.id || null, sale_id: user.id, status: 'draft',
                total_amount: getTotal(), ...(orderNotes.trim() ? { notes: orderNotes.trim() } : {}),
            }]).select().single()
            if (oErr) throw oErr
            const { error: iErr } = await (sb as any).from('order_items').insert(
                cart.map(i => ({ order_id: od.id, product_id: i.id, quantity: i.quantity, price_at_order: i.price }))
            )
            if (iErr) throw iErr
            setCreatedOrderId(od.id); setShowSuccessModal(true)
        } catch (e: any) { addToast('Lỗi: ' + (e.message || 'Không thể tạo đơn')) } finally { setIsCreatingOrder(false) }
    }

    const resetOrder = () => { setCart([]); setSelectedCustomer(null); setOrderNotes(''); setCreatedOrderId(null) }

    const filteredProducts = useMemo(() => {
        let f = products
        if (activeCategory !== 'all') f = f.filter(p => p.category_id === parseInt(activeCategory))
        if (sheetSearch.trim()) { const q = sheetSearch.toLowerCase(); f = f.filter(p => p.name?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q)) }
        return f
    }, [products, activeCategory, sheetSearch])

    const quickResults = useMemo(() => {
        if (quickSearch.trim().length < 2) return []
        const q = quickSearch.toLowerCase()
        return products.filter(p => (p.name?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q)) && p.stock > 0).slice(0, 5)
    }, [products, quickSearch])

    const filteredCustomers = useMemo(() => {
        if (customerSearch.trim().length < 2) return []
        const q = customerSearch.toLowerCase()
        return customers.filter(c => c.name?.toLowerCase().includes(q) || c.phone?.includes(q)).slice(0, 8)
    }, [customers, customerSearch])

    const catsWithCount = useMemo(() => [
        { id: 'all', name: 'Tất cả', count: products.length },
        ...categories.map(c => ({ ...c, count: products.filter(p => p.category_id === c.id).length })).filter(c => c.count > 0)
    ], [categories, products])

    if (loading) return <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center"><div className="text-gray-500">Đang tải...</div></div>

    return (
        <div className="min-h-screen bg-[#f0f9ff] relative">
            {/* Toasts */}
            <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="bg-emerald-500 text-white rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{t.msg}</span>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#f0f9ff] flex items-center justify-between p-4">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Bán hàng</h1>
                <button onClick={handleCompleteOrder} disabled={cart.length === 0 || isCreatingOrder}
                    className={cn("text-sm font-semibold px-3 py-1.5 rounded-lg", cart.length === 0 || isCreatingOrder ? "text-gray-400" : "text-[#175ead]")}>
                    {isCreatingOrder ? 'Đang tạo...' : 'Xong'}
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-32 flex flex-col gap-3">
                {/* Customer Selector */}
                <div className="relative">
                    {selectedCustomer ? (
                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#175ead] font-bold text-sm">{selectedCustomer.name?.[0]?.toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{selectedCustomer.name}</p>
                                <p className="text-xs text-gray-500">{selectedCustomer.phone || selectedCustomer.code}</p>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)}><X className="w-4 h-4 text-gray-400" /></button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Input placeholder="Tìm khách hàng..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="bg-white rounded-xl border-gray-200 h-11" />
                            {filteredCustomers.length > 0 && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setCustomerSearch('')} />
                                    <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl z-40 max-h-56 overflow-y-auto border border-gray-100">
                                        {filteredCustomers.map((c: any) => (
                                            <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerSearch('') }}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[#175ead] font-bold text-xs">{c.name?.[0]?.toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                                                    <p className="text-xs text-gray-500">{c.code} • {c.phone || 'N/A'}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Cart or Empty State */}
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Grid3x3 className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-2">Đơn này bạn bán hàng gì?</p>
                        <p className="text-sm text-gray-500">Nhấn nút bên dưới để chọn sản phẩm</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cart.map(item => (
                            <button key={item.id} onClick={() => handleQtyEdit(item)} className="bg-white rounded-xl p-4 shadow-sm text-left w-full">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0 pr-3">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{formatCurrency(item.price)} / cái</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"><Minus className="w-3 h-3 text-gray-600" /></button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"><Plus className="w-3 h-3 text-gray-600" /></button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Còn: {item.stock}</span>
                                    <span className="text-sm font-bold text-[#175ead]">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            </button>
                        ))}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-semibold text-gray-700">Ghi chú đơn hàng</span>
                            </div>
                            <textarea className="w-full text-sm bg-gray-50 rounded-lg border border-gray-200 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#175ead]/30"
                                placeholder="Thêm ghi chú (tùy chọn)..." value={orderNotes} onChange={e => setOrderNotes(e.target.value)} rows={3} maxLength={500} />
                            {orderNotes.length > 0 && <p className="text-xs text-gray-400 text-right mt-1">{orderNotes.length}/500</p>}
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                            <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(getTotal())}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Quick Search Bar */}
            <QuickSearch
                value={quickSearch}
                onChange={setQuickSearch}
                results={quickResults}
                onAddToCart={addToCart}
                onOpenSheet={() => setShowProductSheet(true)}
            />

            {/* Modals */}
            {showProductSheet && (
                <ProductSheet
                    products={products}
                    filteredProducts={filteredProducts}
                    categories={catsWithCount}
                    activeCategory={activeCategory}
                    sheetSearch={sheetSearch}
                    onCategoryChange={setActiveCategory}
                    onSearchChange={setSheetSearch}
                    onAddToCart={addToCart}
                    onClose={() => setShowProductSheet(false)}
                />
            )}
            {showQuantityModal && (
                <QuantityModal
                    item={editingItem}
                    tempQty={tempQty}
                    onTempQtyChange={setTempQty}
                    onSubmit={handleQtySubmit}
                    onDelete={handleDeleteItem}
                    onClose={() => { setShowQuantityModal(false); setEditingItem(null) }}
                />
            )}
            {showSuccessModal && (
                <SuccessModal
                    orderId={createdOrderId}
                    total={getTotal()}
                    onCreateAnother={() => { setShowSuccessModal(false); resetOrder() }}
                    onViewOrders={() => { setShowSuccessModal(false); resetOrder(); router.push('/sales/orders') }}
                />
            )}
        </div>
    )
}
