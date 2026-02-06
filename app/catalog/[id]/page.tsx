import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/catalog/AddToCartButton'

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = params

    // Fetch product
    // Note: id in URL is string, but in DB it is number.
    // If id is not a number, it might fail or return nothing.
    // Let's assume URL id is the numeric ID.
    const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    // If not found by ID, try Code?
    // Actually our DB ID is number.

    const product = productData as any

    if (!product) return notFound()

    return (
        <div className="p-4 flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-2">
                <Link href="/catalog" className="p-2 -ml-2 hover:bg-muted rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-xl font-bold truncate">{product.name}</h1>
            </div>

            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <p className="text-muted-foreground">{product.code}</p>
                    </div>
                    <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </Badge>
                </div>

                <div className="text-3xl font-bold text-primary">
                    {formatCurrency(product.price)}
                    {product.unit && <span className="text-lg text-muted-foreground font-normal"> / {product.unit}</span>}
                </div>

                <div className="py-4 border-t border-b">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground text-sm">
                        High quality {product.name} available for order.
                        Safe and reliable {product.unit || 'product'}.
                    </p>
                </div>
            </div>

            {/* Fixed bottom bar for action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t pb-8 md:pb-4 flex justify-between items-center z-10">
                <div className="text-lg font-bold">
                    {formatCurrency(product.price)}
                </div>
                <div className="w-1/2">
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    )
}
