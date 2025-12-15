import { createClient } from '@/lib/supabase/server'
import { Package, Users, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getStats() {
    const supabase = await createClient()

    const [productsRes, leadsRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('leads').select('id', { count: 'exact' }),
    ])

    return {
        products: productsRes.count || 0,
        leads: leadsRes.count || 0,
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral da GolClub</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Produtos Ativos
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.products}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Leads Capturados
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.leads}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Conversões
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Em breve</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Receita
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Em breve</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
