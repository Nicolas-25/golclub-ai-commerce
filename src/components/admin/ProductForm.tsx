'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface ProductFormProps {
    product?: {
        id: string
        name: string
        team: string
        season: string
        type: string
        price_cost: number
        price_sale: number
        price_international: number
        sizes_available: string[]
        stock_br: number
        is_active: boolean
        image_url?: string
    }
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: product?.name || '',
        team: product?.team || '',
        season: product?.season || '24/25',
        type: product?.type || 'home',
        price_cost: product?.price_cost || 0,
        price_sale: product?.price_sale || 0,
        price_international: product?.price_international || 0,
        sizes_available: product?.sizes_available?.join(', ') || 'P, M, G, GG',
        stock_br: product?.stock_br || 0,
        is_active: product?.is_active ?? true,
        image_url: product?.image_url || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                sizes_available: formData.sizes_available.split(',').map(s => s.trim()),
            }

            const url = product
                ? `/api/products/${product.id}`
                : '/api/products'

            const res = await fetch(url, {
                method: product ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Failed to save')

            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Erro ao salvar produto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {product ? 'Editar Produto' : 'Novo Produto'}
                        </h1>
                        <p className="text-muted-foreground">
                            {product ? 'Atualize as informações do produto' : 'Cadastre uma nova camisa'}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Nome</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Camisa Flamengo Home"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Time</label>
                                    <Input
                                        value={formData.team}
                                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                        placeholder="Flamengo"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Temporada</label>
                                    <Input
                                        value={formData.season}
                                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                        placeholder="24/25"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                                    >
                                        <option value="home">Home</option>
                                        <option value="away">Away</option>
                                        <option value="third">Third</option>
                                        <option value="special">Special</option>
                                        <option value="retro">Retro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">URL da Imagem</label>
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preços e Estoque</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Custo (R$)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price_cost}
                                        onChange={(e) => setFormData({ ...formData, price_cost: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Venda BR (R$)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price_sale}
                                        onChange={(e) => setFormData({ ...formData, price_sale: parseFloat(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Internacional (R$)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price_international}
                                        onChange={(e) => setFormData({ ...formData, price_international: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Tamanhos (separados por vírgula)</label>
                                    <Input
                                        value={formData.sizes_available}
                                        onChange={(e) => setFormData({ ...formData, sizes_available: e.target.value })}
                                        placeholder="P, M, G, GG"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Estoque BR</label>
                                    <Input
                                        type="number"
                                        value={formData.stock_br}
                                        onChange={(e) => setFormData({ ...formData, stock_br: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium">
                                    Produto ativo
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Salvando...' : 'Salvar Produto'}
                        </Button>
                        <Link href="/admin/products">
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    )
}
