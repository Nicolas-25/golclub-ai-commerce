import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

import { Header } from '@/components/layout/Header'
import { ProductCard } from '@/components/catalog/ProductCard'
import { redirect } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { ChatSidebarWrapper } from './ChatSidebarWrapper'

export default async function LancamentosPage() {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    // Fetch launched products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_launch', true)
        .order('created_at', { ascending: false })

    // Fetch user favorites
    const { data: favorites } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id)

    const favoriteIds = new Set(favorites?.map((f: any) => f.product_id))

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
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Lançamentos</h1>
                        </div>
                        <p className="text-zinc-500">As novidades mais quentes da temporada.</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {products?.length || 0} novidades
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
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <Sparkles className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Nenhum lançamento no momento</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mt-2">Fique ligado! Em breve teremos novas camisas exclusivas para você.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
