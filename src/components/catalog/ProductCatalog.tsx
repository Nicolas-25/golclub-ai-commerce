'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Product {
    id: string
    name: string
    team: string
    price_sale: number
    price_international: number
    stock_br: number
    image_url?: string
    sizes_available?: string[]
}

interface ProductCatalogProps {
    onClose?: () => void
    onSelectProduct?: (product: Product) => void
    teamFilter?: string
}

export function ProductCatalog({ onClose, onSelectProduct, teamFilter }: ProductCatalogProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedTeam, setSelectedTeam] = useState(teamFilter || '')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.team.toLowerCase().includes(search.toLowerCase())
        const matchesTeam = !selectedTeam || p.team.toLowerCase().includes(selectedTeam.toLowerCase())
        return matchesSearch && matchesTeam
    })

    const teams = [...new Set(products.map(p => p.team))]

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Catálogo de Produtos</h2>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="p-4 space-y-3 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar camisas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={selectedTeam === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTeam('')}
                    >
                        Todos
                    </Button>
                    {teams.map((team) => (
                        <Button
                            key={team}
                            variant={selectedTeam === team ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTeam(team)}
                        >
                            {team}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Nenhum produto encontrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => onSelectProduct?.(product)}
                            >
                                <div className="aspect-square bg-secondary relative">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                            ⚽
                                        </div>
                                    )}
                                    {product.stock_br > 0 && (
                                        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            Pronta Entrega
                                        </span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">{product.team}</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="font-bold text-primary">
                                            R$ {product.price_sale?.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
