'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils' // Need to implement this utility or inline it
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CartSheet() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const checkout = () => {
        setOpen(false)
        router.push('/customer/checkout')
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] flex flex-col sm:max-w-md sm:side-right">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button onClick={() => setOpen(false)} variant="outline">Continue Shopping</Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-auto py-4">
                            <div className="flex flex-col gap-4">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4">
                                        <div className="h-20 w-20 bg-muted/20 rounded-md overflow-hidden relative flex-shrink-0">
                                            {/* Image placeholder */}
                                            {item.product.image_url && <img src={item.product.image_url} className="object-cover h-full w-full" alt={item.product.name} />}
                                        </div>
                                        <div className="flex flex-col justify-between flex-1">
                                            <div>
                                                <h4 className="font-medium line-clamp-2 text-sm">{item.product.name}</h4>
                                                <p className="text-xs text-muted-foreground">{item.product.code}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">
                                                        ${((item.product.price || 0) * item.quantity).toLocaleString()}
                                                    </span>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeItem(item.product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-lg">${totalPrice().toLocaleString()}</span>
                            </div>
                            <Button className="w-full" size="lg" onClick={checkout}>
                                Proceed to Checkout
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
