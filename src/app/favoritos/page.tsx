import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

import { Header } from '@/components/layout/Header'
import { ProductCard } from '@/components/catalog/ProductCard'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { ChatSidebarWrapper } from './ChatSidebarWrapper'

// Helper type for the join result
interface FavoriteWithProduct {
    product_id: string
    products: {
        id: string
        name: string
        price: number
        image_url: string
        team: string
    } | null
}

export default async function FavoritosPage() {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    // Fetch favorites with product details
    const { data: rawFavorites } = await supabase
        .from('favorites')
        .select('product_id, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Cast and filter valid products (in case a product was deleted but favorite remained)
    // Using 'unknown' cast first to bypass deep type inference that might fail build
    const favorites = (rawFavorites as unknown as FavoriteWithProduct[])?.filter(f => f.products) || []

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Header user={user} />

            {/* Chat Sidebar */}
            <ChatSidebarWrapper
                userEmail={user.email || ''}
                userName={user.user_metadata?.name}
            />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 mr-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Meus Favoritos</h1>
                        </div>
                        <p className="text-zinc-500">Sua lista de desejos personalizada.</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full">
                        {favorites.length} salvos
                    </span>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((fav: any) => (
                            <ProductCard
                                key={fav.product_id}
                                product={fav.products!}
                                userId={user.id}
                                initialIsFavorite={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <Heart className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Nenhum favorito ainda</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mt-2 mb-6">Explore nossas camisas e salve as que você mais gostar aqui.</p>
                        <a href="/camisas" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                            Explorar Camisas
                        </a>
                    </div>
                )}
            </main>
        </div>
    )
}
