'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { User, LogIn, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@supabase/ssr'

interface HeaderProps {
    showAuthModal?: (type: 'login' | 'register') => void
    user?: { email: string; name?: string } | null
    onLogout?: () => void
}

const navItems = [
    { href: '/lancamentos', label: 'LANÇAMENTOS' },
    { href: '/camisas', label: 'CAMISAS' },
    { href: '/pedidos', label: 'MEUS PEDIDOS' },
    { href: '/favoritos', label: 'FAVORITOS' },
]

export function Header({ showAuthModal, user, onLogout }: HeaderProps) {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <div className="relative h-10 w-28 sm:h-12 sm:w-32">
                            <Image
                                src="/logo-light.png"
                                alt="GolClub"
                                fill
                                className="object-contain dark:hidden"
                                priority
                            />
                            <Image
                                src="/logo.png"
                                alt="GolClub"
                                fill
                                className="object-contain hidden dark:block brightness-0 invert"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu - Only show when logged in */}
                    {user && (
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                                        pathname === item.href
                                            ? 'bg-primary text-white'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-primary/10 hover:text-primary'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Auth Buttons / Profile */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {profileMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0"
                                            onClick={() => setProfileMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
                                                <p className="font-medium text-sm">{user.name || 'Usuário'}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/perfil"
                                                className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Meu Perfil
                                            </Link>
                                            <Link
                                                href="/pedidos"
                                                className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Meus Pedidos
                                            </Link>
                                            <Link
                                                href="/favoritos"
                                                className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Favoritos
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setProfileMenuOpen(false)
                                                    onLogout?.()
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => showAuthModal?.('login')}
                                    className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-white"
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    LOGIN
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => showAuthModal?.('register')}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <User className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">CADASTRAR</span>
                                </Button>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        {user && (
                            <button
                                className="lg:hidden p-2 text-zinc-700 dark:text-zinc-300"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {user && mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-3 rounded-lg font-medium transition-colors',
                                        pathname === item.href
                                            ? 'bg-primary text-white'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-primary/10'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
