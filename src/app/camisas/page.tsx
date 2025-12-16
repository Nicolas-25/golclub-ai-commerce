import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

import { Header } from '@/components/layout/Header'
import { ProductCard } from '@/components/catalog/ProductCard'
import { redirect } from 'next/navigation'
import { ChatSidebarWrapper } from './ChatSidebarWrapper'

export default async function CamisasPage() {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    // Fetch products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    // Fetch user favorites
    const { data: favorites } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id)

    const favoriteIds = new Set(favorites?.map((f: any) => f.product_id))

    return (
        <div className="min-h-screen bg-white">
            <Header user={user} />

            {/* Chat Sidebar */}
            <ChatSidebarWrapper
                userEmail={user.email || ''}
                userName={user.user_metadata?.name}
            />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pr-[420px]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900">Todas as Camisas</h1>
                        <p className="text-zinc-500 mt-1">Explore nossa coleção completa de mantos.</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {products?.length || 0} produtos
                    </span>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product: any) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                userId={user.id}
                                initialIsFavorite={favoriteIds.has(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-zinc-500">Nenhum produto encontrado.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
