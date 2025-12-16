import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

import { Header } from '@/components/layout/Header'
import { redirect } from 'next/navigation'
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    'pending': { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    'paid': { label: 'Pago', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'separating': { label: 'Em Separação', color: 'bg-blue-100 text-blue-800', icon: Package },
    'shipping': { label: 'A Caminho', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    'delivered': { label: 'Entregue', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    'cancelled': { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default async function PedidosPage() {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    // Fetch orders with items
    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Header user={user} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Package className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Meus Pedidos</h1>
                </div>

                <div className="space-y-6">
                    {orders && orders.length > 0 ? (
                        orders.map((order: any) => {
                            const status = statusMap[order.status] || statusMap['pending']
                            const StatusIcon = status.icon

                            return (
                                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Pedido #{order.id.slice(0, 8)}</p>
                                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className={`flex items-center gap-1 px-3 py-1 ${status.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </Badge>
                                            <p className="font-bold text-lg">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.order_items.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="h-16 w-16 bg-zinc-100 rounded-md overflow-hidden relative shrink-0">
                                                        {item.products?.image_url ? (
                                                            <Image
                                                                src={item.products.image_url}
                                                                alt={item.products.name || 'Produto'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                                <Package className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.products?.name || 'Produto indisponível'}</h4>
                                                        <p className="text-sm text-zinc-500">Tam: {item.size} • Qtd: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-medium text-sm">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price_at_purchase)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="bg-zinc-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="h-10 w-10 text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Você ainda não tem pedidos</h3>
                            <p className="text-zinc-500 max-w-sm mx-auto mt-2 mb-6">Que tal escolher sua primeira camisa agora?</p>
                            <a href="/camisas" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                                Ir para a Loja
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
