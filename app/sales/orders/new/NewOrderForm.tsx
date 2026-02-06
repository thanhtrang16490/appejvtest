'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createOrder } from '../actions'

type Product = {
    id: number
    name: string
    price: number
    stock: number
}

type Customer = {
    id: number
    name: string
}

type OrderItem = {
    productId: number
    name: string
    price: number
    quantity: number
}

export function NewOrderForm({ products, customers }: { products: Product[], customers: Customer[] }) {
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('')
    const [searchTerm, setSearchTerm] = useState('')
    const [items, setItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addItem = (product: Product) => {
        const existing = items.find(i => i.productId === product.id)
        if (existing) {
            setItems(items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        } else {
            setItems([...items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }])
        }
        toast.success(`Added ${product.name}`)
    }

    const removeItem = (productId: number) => {
        setItems(items.filter(i => i.productId !== productId))
    }

    const updateQuantity = (productId: number, delta: number) => {
        setItems(items.map(i => {
            if (i.productId === productId) {
                const newQty = Math.max(1, i.quantity + delta)
                return { ...i, quantity: newQty }
            }
            return i
        }))
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleSubmit = async () => {
        if (!selectedCustomerId) {
            toast.error('Please select a customer')
            return
        }
        if (items.length === 0) {
            toast.error('Please add at least one item')
            return
        }

        setLoading(true)
        try {
            const result = await createOrder({
                customerId: Number(selectedCustomerId),
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
                total
            })

            if (result.success) {
                toast.success('Order created successfully')
                router.push('/sales/orders')
            } else {
                toast.error(result.error || 'Failed to create order')
            }
        } catch (e) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">1. Select Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : '')}
                        >
                            <option value="">Choose a customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">2. Add Products</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 max-h-[400px] overflow-auto pr-2">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(product.price)} • Stock: {product.stock}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => addItem(product)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="sticky top-6">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Order Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4 mb-6 min-h-[100px]">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded-md">
                                            <button className="px-2 py-1 hover:bg-muted" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                                            <span className="px-3 border-x text-xs">{item.quantity}</span>
                                            <button className="px-2 py-1 hover:bg-muted" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                                        </div>
                                        <button className="text-destructive hover:bg-destructive/10 p-1.5 rounded" onClick={() => removeItem(item.productId)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <p className="text-muted-foreground text-center py-6 text-sm italic">No items added yet.</p>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black">
                                <span>Total</span>
                                <span className="text-primary">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-6 h-12 text-lg font-bold shadow-lg shadow-primary/20" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Creating Order...' : 'Place Order'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
