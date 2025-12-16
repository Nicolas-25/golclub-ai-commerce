'use client'

import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useChatContext } from '@/contexts/ChatContext'

interface Product {
    id: string
    name: string
    price: number
    image_url: string
    team: string
}

interface ProductCardProps {
    product: Product
    userId?: string
    initialIsFavorite?: boolean
    width?: number
    height?: number
    onFavoriteToggle?: (isFavorite: boolean) => void
}

export function ProductCard({
    product,
    userId,
    initialIsFavorite = false,
    width = 300,
    height = 300,
    onFavoriteToggle
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const { selectProduct } = useChatContext()

    const handleChatWithProduct = () => {
        selectProduct({
            id: product.id,
            name: product.name,
            team: product.team,
            price_sale: product.price,
            image_url: product.image_url,
        })
        // Scroll to top where chat is
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Sync state if initial changes (e.g. parent re-fetch)
    useEffect(() => {
        setIsFavorite(initialIsFavorite)
    }, [initialIsFavorite])

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!userId) {
            // TODO: Show login toast/modal?
            alert('Faça login para favoritar!')
            return
        }

        if (isLoading) return

        setIsLoading(true)
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        try {
            if (isFavorite) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('product_id', product.id)

                if (error) throw error
                setIsFavorite(false)
                onFavoriteToggle?.(false)
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: userId, product_id: product.id })

                if (error) throw error
                setIsFavorite(true)
                onFavoriteToggle?.(true)
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-800">

            {/* Image Container */}
            <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-800">
                <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={isLoading}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors z-10"
                >
                    <Heart
                        className={cn(
                            "w-5 h-5 transition-colors",
                            isFavorite ? "fill-red-500 text-red-500" : "text-zinc-600 dark:text-zinc-300"
                        )}
                    />
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">{product.team}</p>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>
            </div>

            {/* Chat Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 via-white/90 to-transparent dark:from-black/90 dark:via-black/90">
                <Button
                    className="w-full font-bold shadow-lg"
                    size="sm"
                    onClick={handleChatWithProduct}
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    QUERO ESSA!
                </Button>
            </div>
        </div>
    )
}
