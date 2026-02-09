import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem {
    product: Product
    quantity: number
}

interface CartState {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const { items } = get()
                const existingItem = items.find((item) => item.product.id === product.id)

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    set({ items: [...items, { product, quantity: 1 }] })
                }
                toast.success('Added to cart')
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.product.id !== productId) })
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }
                set({
                    items: get().items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                })
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + (item.quantity * 0), 0) // Price is not in product schema inprompt? Wait.
            // Schema: products: id, code, name, unit, stock, image_url.
            // Wait, there is no price in the prompt's `products` table schema!
            // `order_items` has `price_at_order`.
            // `orders` has `total_amount`.
            // Where is the price? Usually products have a price.
            // The prompt says: "products: ... stock (int), image_url". No price!
            // Maybe price is dynamic or I missed it.
            // "order_items: ... price_at_order".
            // I must assume products have a price, or it's fetched separately?
            // Or maybe I should add `price` to `products` type and schema assumption?
            // The user prompt: "products: id (bigint), code (text), name (text), unit (text), stock (int - editable by Sales), image_url."
            // No price column listed.
            // This is strange for a sales app. Maybe "Orders" are created by Sales who set the price?
            // But "Customer Portal -> Cart" implies customers buy things. They need to know the price.
            // I will ADD `price` to the `Product` interface and assume the column exists or will be added.
            // Or I'll use a hardcoded price or 0 for now and ask user.
            // I'll add `price` to the type definition locally or just cast it.
            // Let's modify `types/database.types.ts` to include price, assuming it was an oversight.
        }),
        {
            name: 'cart-storage',
        }
    )
)

// Helper to handle toast (can't import toast comfortably inside vanilla store creation if strictly client, but strictly it works if client side)
import { toast } from 'sonner'
