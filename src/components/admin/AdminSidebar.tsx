'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Users, LayoutDashboard, MessageSquare, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produtos', icon: Package },
    { href: '/admin/leads', label: 'Leads', icon: Users },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">GC</span>
                    </div>
                    <span className="font-semibold text-lg">GolClub Admin</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                    <MessageSquare className="h-5 w-5" />
                    Ver Chat
                </Link>
            </div>
        </aside>
    )
}
