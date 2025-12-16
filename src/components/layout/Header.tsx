'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { User, LogIn, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
    showAuthModal?: (type: 'login' | 'register') => void
    user?: any
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
        <header className="sticky top-0 z-50 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <div className="relative h-16 w-40">
                            <Image
                                src="/logo-light.png"
                                alt="GolClub"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu - Only show when logged in */}
                    {user && (
                        <nav className="hidden lg:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wide',
                                        pathname === item.href
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-primary text-white hover:bg-primary/90'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Auth Buttons / Profile */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors"
                                >
                                    <User className="h-6 w-6 text-primary" />
                                </button>

                                {/* Profile Dropdown */}
                                {profileMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0"
                                            onClick={() => setProfileMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border-2 border-primary py-2 z-50">
                                            <div className="px-4 py-2 border-b border-zinc-200">
                                                <p className="font-bold text-sm">{user.name || user.user_metadata?.name || 'Usuário'}</p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/perfil"
                                                className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Meu Perfil
                                            </Link>
                                            <Link
                                                href="/pedidos"
                                                className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Meus Pedidos
                                            </Link>
                                            <Link
                                                href="/favoritos"
                                                className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                Favoritos
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setProfileMenuOpen(false)
                                                    onLogout?.()
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
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
                                    onClick={() => showAuthModal?.('login')}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-10 rounded-sm"
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    LOGIN
                                </Button>
                                <Button
                                    onClick={() => showAuthModal?.('register')}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-10 rounded-sm"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    CADASTRAR
                                </Button>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        {user && (
                            <button
                                className="lg:hidden p-2 text-primary"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {user && mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-zinc-200">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-3 rounded-lg font-bold transition-colors',
                                        pathname === item.href
                                            ? 'bg-primary text-white'
                                            : 'text-primary bg-primary/10'
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
