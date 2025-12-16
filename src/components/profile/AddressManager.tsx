'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Plus, Trash2, Edit, MapPin, Loader2 } from 'lucide-react'

interface Address {
    id: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
    is_default: boolean
}

const ESTADOS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function AddressManager({ userId }: { userId: string }) {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    const [formData, setFormData] = useState({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: ''
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchAddresses = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error
            setAddresses(data || [])
        } catch (error) {
            console.error('Error fetching addresses:', error)
        } finally {
            setIsLoading(false)
        }
    }, [supabase, userId])

    useEffect(() => {
        fetchAddresses()
    }, [fetchAddresses])

    const handleOpenDialog = (address?: Address) => {
        if (address) {
            setEditingAddress(address)
            setFormData({
                street: address.street,
                number: address.number,
                complement: address.complement || '',
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                zip_code: address.zip_code
            })
        } else {
            setEditingAddress(null)
            setFormData({
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                zip_code: ''
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (editingAddress) {
                const { error } = await supabase
                    .from('addresses')
                    .update({ ...formData })
                    .eq('id', editingAddress.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('addresses')
                    .insert([{ ...formData, user_id: userId }])

                if (error) throw error
            }

            await fetchAddresses()
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Error saving address:', error)
            alert('Erro ao salvar endereço')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este endereço?')) return
        try {
            const { error } = await supabase.from('addresses').delete().eq('id', id)
            if (error) throw error
            setAddresses(addresses.filter(a => a.id !== id))
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir')
        }
    }

    if (isLoading) return <div className="text-center py-4 text-zinc-500">Carregando endereços...</div>

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Endereços
                    </CardTitle>
                    <CardDescription>Gerencie seus endereços de entrega</CardDescription>
                </div>
                <Button size="sm" onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo
                </Button>
            </CardHeader>
            <CardContent>
                {addresses.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-lg">
                        <MapPin className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500">Nenhum endereço cadastrado</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg bg-zinc-50/50">
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">
                                        {address.street}, {address.number}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {address.neighborhood} - {address.city}/{address.state}
                                    </p>
                                    <p className="text-xs text-zinc-500">CEP: {address.zip_code}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-primary" onClick={() => handleOpenDialog(address)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-red-600" onClick={() => handleDelete(address.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Editar Endereço' : 'Novo Endereço'}</DialogTitle>
                        <DialogDescription>
                            Preencha os dados do endereço de entrega.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>CEP</Label>
                                <Input
                                    value={formData.zip_code}
                                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                    placeholder="00000-000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                >
                                    <option value="">Selecione</option>
                                    {ESTADOS.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Cidade</Label>
                            <Input
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bairro</Label>
                            <Input
                                value={formData.neighborhood}
                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3 space-y-2">
                                <Label>Rua</Label>
                                <Input
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Número</Label>
                                <Input
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Complemento (Opcional)</Label>
                            <Input
                                value={formData.complement}
                                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
