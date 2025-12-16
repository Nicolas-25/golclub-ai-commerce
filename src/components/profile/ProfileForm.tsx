'use client'

import { AddressManager } from './AddressManager'


import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Trash2, MapPin, User as UserIcon, Settings, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
    user: {
        id: string
        email: string
        name?: string
        avatar_url?: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    const handleDeleteAccount = async () => {
        if (!confirm('TEM CERTEZA? Essa ação não pode ser desfeita. Todos os seus dados serão apagados para sempre.')) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/delete-account', {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao excluir conta')
            }

            // Logout user completely
            await handleLogout()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Erro ao processar solicitação')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header / Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary text-white text-3xl">
                        {user.name?.charAt(0).toUpperCase() || <UserIcon />}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{user.name || 'Usuário Sem Nome'}</h2>
                    <p className="text-zinc-500">{user.email}</p>
                    <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Conta Ativa
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-primary" />
                            Dados Pessoais
                        </CardTitle>
                        <CardDescription>Suas informações de identificação</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome Completo</Label>
                            <Input value={user.name || ''} readOnly className="bg-zinc-50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={user.email} readOnly className="bg-zinc-50" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Editar (Em breve)</Button>
                    </CardFooter>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Preferências
                        </CardTitle>
                        <CardDescription>Personalize sua experiência</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Modo Escuro</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alternar entre tema claro e escuro
                                </p>
                            </div>
                            <Switch
                                checked={mounted ? theme === 'dark' : false}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-red-100 dark:border-red-900/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Settings className="h-5 w-5" />
                            Zona de Perigo
                        </CardTitle>
                        <CardDescription>Ações irreversíveis para sua conta</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-zinc-500">
                            Deseja sair da sua conta ou excluir permanentemente seus dados?
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button variant="outline" onClick={handleLogout} className="w-full">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair da Conta
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isLoading ? 'Excluindo...' : 'Excluir Minha Conta'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Address Management */}
            <AddressManager userId={user.id} />
        </div>
    )
}
