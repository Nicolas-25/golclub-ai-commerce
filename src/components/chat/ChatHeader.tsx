'use client'

import Image from 'next/image'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ChatHeader() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-3">
                <Image
                    src="/logo.png"
                    alt="GolClub"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                    priority
                />
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVertical className="h-5 w-5" />
            </Button>
        </header>
    )
}
