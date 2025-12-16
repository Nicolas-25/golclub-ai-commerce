'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'

type ModalView = 'login' | 'register' | 'forgot-password' | 'check-email'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    initialType?: 'login' | 'register'
    onSuccess?: (user: { email: string; name?: string }) => void
}

export function AuthModal({ isOpen, onClose, initialType = 'login', onSuccess }: AuthModalProps) {
    const [view, setView] = useState<ModalView>(initialType)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao fazer login')
            }

            onSuccess?.({ email: formData.email, name: data.user?.user_metadata?.name })
            onClose()
            window.location.reload()
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao cadastrar')
            }

            setView('check-email')
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao enviar email')
            }

            setView('check-email')
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '' })
        setError('')
        setShowPassword(false)
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
                    className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
                    >
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>

                    {/* Check Email View */}
                    {view === 'check-email' && (
                        <div className="p-8 text-center">
                            <div className="bg-primary/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Verifique seu email!</h2>
                            <p className="text-muted-foreground mb-6">
                                Enviamos um link para <strong>{formData.email}</strong>.
                                Clique no link para continuar.
                            </p>
                            <Button onClick={onClose} className="w-full">
                                Entendi
                            </Button>
                        </div>
                    )}

                    {/* Login View */}
                    {view === 'login' && (
                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold">Bem-vindo de volta!</h2>
                                <p className="text-muted-foreground mt-1">
                                    Entre para acessar sua conta
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
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
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => { resetForm(); setView('forgot-password') }}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Esqueceu a senha?
                                </button>

                                {error && (
                                    <p className="text-sm text-red-500 text-center">{error}</p>
                                )}

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground mt-6">
                                Não tem conta?{' '}
                                <button
                                    onClick={() => { resetForm(); setView('register') }}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Cadastre-se
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Register View */}
                    {view === 'register' && (
                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold">Crie sua conta</h2>
                                <p className="text-muted-foreground mt-1">
                                    Cadastre-se e ganhe 10% na primeira compra
                                </p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
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
                                        placeholder="Senha (mínimo 6 caracteres)"
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

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground mt-6">
                                Já tem conta?{' '}
                                <button
                                    onClick={() => { resetForm(); setView('login') }}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Entrar
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Forgot Password View */}
                    {view === 'forgot-password' && (
                        <div className="p-6 sm:p-8">
                            <button
                                onClick={() => { resetForm(); setView('login') }}
                                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Voltar
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold">Esqueceu a senha?</h2>
                                <p className="text-muted-foreground mt-1">
                                    Digite seu email para receber um link de recuperação
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-4">
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

                                {error && (
                                    <p className="text-sm text-red-500 text-center">{error}</p>
                                )}

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar Link'}
                                </Button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
