'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database.types'
import { useCartStore } from '@/lib/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

type Product = Database['public']['Tables']['products']['Row']

export function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem)

    return (
        <Card className="overflow-hidden flex flex-col justify-between h-full">
            <Link href={`/catalog/${product.id}`} className="block flex-1">
                <div className="relative aspect-square bg-muted/20 w-full">
                    {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">No Image</div>
                    )}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center font-bold text-destructive">
                            Out of Stock
                        </div>
                    )}
                </div>
                <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                        <span>{product.code}</span>
                        <span>{product.unit}</span>
                    </div>
                    <div className="font-bold mt-2 text-primary">
                        {formatCurrency(product.price)}
                    </div>
                </CardContent>
            </Link>
            <CardFooter className="p-3 pt-0">
                <Button
                    onClick={() => addItem(product)}
                    className="w-full h-8 text-xs"
                    disabled={product.stock <= 0}
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
