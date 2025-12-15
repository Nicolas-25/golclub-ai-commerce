'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function TypingIndicator() {
    return (
        <div className="flex gap-3 px-4">
            <Avatar className="h-8 w-8 shrink-0 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    GC
                </AvatarFallback>
            </Avatar>

            <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 border border-border">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{
                                y: [0, -6, 0],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
