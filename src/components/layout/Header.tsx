'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
    onProductsClick?: () => void
    showAuthModal?: (type: 'login' | 'register') => void
}

export function Header({ onProductsClick, showAuthModal }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <div className="relative h-10 w-32">
                            <Image
                                src="/logo.png"
                                alt="GolClub"
                                fill
                                className="object-contain brightness-0 invert"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Início
                        </Link>
                        <button
                            onClick={onProductsClick}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Produtos
                        </button>
                        <Link
                            href="#contato"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Contato
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showAuthModal?.('login')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Entrar
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => showAuthModal?.('register')}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <User className="h-4 w-4 mr-2" />
                            Cadastrar
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-muted-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Início
                            </Link>
                            <button
                                onClick={() => {
                                    onProductsClick?.()
                                    setMobileMenuOpen(false)
                                }}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground text-left"
                            >
                                Produtos
                            </button>
                            <Link
                                href="#contato"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contato
                            </Link>
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => showAuthModal?.('login')}
                                    className="flex-1"
                                >
                                    Entrar
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => showAuthModal?.('register')}
                                    className="flex-1"
                                >
                                    Cadastrar
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
