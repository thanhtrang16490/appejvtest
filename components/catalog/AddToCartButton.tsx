'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export function AddToCartButton({ product }: { product: any }) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem(product)
        toast.success(`Added ${product.name} to cart`)
    }

    return (
        <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
        >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
        </Button>
    )
}
