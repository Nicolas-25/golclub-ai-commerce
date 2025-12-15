import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getProducts() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
    return products || []
}

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Produtos</h1>
                    <p className="text-muted-foreground">Gerencie o catálogo de camisas</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Produto
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-4 font-medium text-muted-foreground">Produto</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Time</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Preço</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Estoque BR</th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-border hover:bg-secondary/50">
                                        <td className="p-4">
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-sm text-muted-foreground">{product.season}</div>
                                        </td>
                                        <td className="p-4">{product.team}</td>
                                        <td className="p-4">
                                            <div className="font-medium">R$ {product.price_sale}</div>
                                            {product.price_international && (
                                                <div className="text-sm text-muted-foreground">
                                                    Int: R$ {product.price_international}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={product.stock_br > 0 ? 'text-emerald-500' : 'text-amber-500'}>
                                                {product.stock_br} un
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${product.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {product.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            Nenhum produto cadastrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
