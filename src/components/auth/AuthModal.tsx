'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    initialType?: 'login' | 'register'
    onSuccess?: (user: { email: string; name?: string }) => void
}

export function AuthModal({ isOpen, onClose, initialType = 'login', onSuccess }: AuthModalProps) {
    const [type, setType] = useState<'login' | 'register'>(initialType)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao processar')
            }

            onSuccess?.({ email: formData.email, name: formData.name })
            onClose()
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>

                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {type === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                {type === 'login'
                                    ? 'Entre para acessar ofertas exclusivas'
                                    : 'Cadastre-se e ganhe 10% na primeira compra'
                                }
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {type === 'register' && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10 pr-10"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 text-center">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Processando...' : type === 'login' ? 'Entrar' : 'Cadastrar'}
                            </Button>
                        </form>

                        {/* Toggle type */}
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            {type === 'login' ? (
                                <>
                                    Não tem conta?{' '}
                                    <button
                                        onClick={() => setType('register')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Cadastre-se
                                    </button>
                                </>
                            ) : (
                                <>
                                    Já tem conta?{' '}
                                    <button
                                        onClick={() => setType('login')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Entrar
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
