'use client'

import { motion } from 'framer-motion'
import { Check, Plane, Package, Clock, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OfferComparisonProps {
    product: {
        name: string
        team: string
        price_sale: number
        price_international: number
        stock_br: number
    }
    onSelect?: (option: 'br' | 'international') => void
}

export function OfferComparison({ product, onSelect }: OfferComparisonProps) {
    const hasBRStock = product.stock_br > 0
    const savings = product.price_sale - product.price_international

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md space-y-3"
        >
            <h3 className="text-sm font-medium text-muted-foreground text-center">
                Escolha sua opção:
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {/* BR Option */}
                <div
                    className={cn(
                        "relative rounded-xl border-2 p-4 transition-all",
                        hasBRStock
                            ? "border-emerald-500 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10"
                            : "border-border bg-secondary/50 opacity-60"
                    )}
                    onClick={() => hasBRStock && onSelect?.('br')}
                >
                    {hasBRStock && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            Recomendado
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                        <Package className="h-5 w-5 text-emerald-500" />
                        <span className="font-semibold text-sm">🇧🇷 Brasil</span>
                    </div>

                    <div className="text-2xl font-bold mb-2">
                        R$ {product.price_sale.toFixed(2).replace('.', ',')}
                    </div>

                    <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Truck className="h-3.5 w-3.5" />
                            <span>Frete Grátis</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>3-5 dias úteis</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500">
                            <Check className="h-3.5 w-3.5" />
                            <span>{hasBRStock ? `${product.stock_br} em estoque` : 'Sem estoque'}</span>
                        </div>
                    </div>

                    {hasBRStock && (
                        <Button
                            size="sm"
                            className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => onSelect?.('br')}
                        >
                            Comprar
                        </Button>
                    )}
                </div>

                {/* International Option */}
                <div
                    className="relative rounded-xl border-2 border-amber-500/50 bg-amber-500/5 p-4 cursor-pointer hover:bg-amber-500/10 transition-all"
                    onClick={() => onSelect?.('international')}
                >
                    {savings > 0 && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            -R${savings.toFixed(0)}
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                        <Plane className="h-5 w-5 text-amber-500" />
                        <span className="font-semibold text-sm">✈️ Internacional</span>
                    </div>

                    <div className="text-2xl font-bold mb-2">
                        R$ {product.price_international.toFixed(2).replace('.', ',')}
                    </div>

                    <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Truck className="h-3.5 w-3.5" />
                            <span>+ Frete ~R$30</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>15-25 dias</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-500">
                            <Check className="h-3.5 w-3.5" />
                            <span>Sempre disponível</span>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                        onClick={() => onSelect?.('international')}
                    >
                        Encomendar
                    </Button>
                </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
                {hasBRStock
                    ? "Pronta entrega = entrega mais rápida e sem taxas"
                    : "Internacional = direto da fábrica com melhor preço"}
            </p>
        </motion.div>
    )
}
