'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ProductCardProps {
    product: Record<string, unknown>
    onBuy?: (productId: string, size: string) => void
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    const name = product.name as string || 'Camisa'
    const team = product.team as string || ''
    const imageUrl = product.image_url as string || 'https://placehold.co/400x500/7C3AED/white?text=Camisa'
    const priceSale = product.price_sale as number || 0
    const priceInternational = product.price_international as number || 0
    const sizesAvailable = product.sizes_available as string[] || ['P', 'M', 'G', 'GG']
    const stockBr = product.stock_br as number || 0
    const id = product.id as string || ''

    const hasStock = stockBr > 0
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(hasStock ? priceSale : priceInternational)

    const handleBuy = () => {
        if (selectedSize && onBuy) {
            onBuy(id, selectedSize)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden bg-card border-border max-w-[320px]">
                {/* Product Image */}
                <div className="relative aspect-[4/5] bg-secondary">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                    />

                    {/* Stock Badge */}
                    <div className={cn(
                        "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold",
                        hasStock
                            ? "bg-emerald-500/90 text-white"
                            : "bg-amber-500/90 text-white"
                    )}>
                        {hasStock ? '🇧🇷 Pronta Entrega' : '✈️ Encomenda'}
                    </div>
                </div>

                <CardContent className="p-4 space-y-4">
                    {/* Product Info */}
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{team}</p>
                        <h3 className="font-semibold text-foreground">{name}</h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gradient-brand">
                            {formattedPrice}
                        </span>
                        {!hasStock && (
                            <span className="text-xs text-muted-foreground">
                                + frete internacional
                            </span>
                        )}
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Selecione o tamanho:</p>
                        <div className="flex gap-2">
                            {sizesAvailable.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "w-10 h-10 rounded-lg border text-sm font-medium transition-all",
                                        selectedSize === size
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "bg-secondary border-border text-foreground hover:border-primary"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                        onClick={handleBuy}
                        disabled={!selectedSize}
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                    >
                        {selectedSize ? (
                            <>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Comprar Agora
                            </>
                        ) : (
                            'Escolha um tamanho'
                        )}
                    </Button>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-emerald-500" />
                            Pix
                        </span>
                        <span className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-emerald-500" />
                            Frete Grátis*
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
