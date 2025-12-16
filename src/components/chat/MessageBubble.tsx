'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ProductCard } from '@/components/ui/ProductCard'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
interface MessageBubbleProps {
    message: any
    isLatest?: boolean
}

export function MessageBubble({ message, isLatest }: { message: Message | any, isLatest?: boolean }) {
    const isUser = message.role === 'user'
    const isAssistant = message.role === 'assistant'
    const checkoutTool = message.toolInvocations?.find((t: any) => t.toolName === 'requestCheckout')

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'flex gap-3 px-4',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            {isAssistant && (
                <Avatar className="h-8 w-8 shrink-0 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        GC
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                'max-w-[85%] space-y-2',
                isUser ? 'items-end' : 'items-start'
            )}>
                {/* Text content */}
                <div className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card text-card-foreground rounded-bl-md border border-border'
                )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Generative UI Component (Legacy/Stored) */}
                {message.ui_component && (
                    <GenerativeUI component={message.ui_component} />
                )}

                {/* Live Tool Components */}
                {checkoutTool && (
                    <div className="mt-2 w-full max-w-sm">
                        <CheckoutForm
                            productName={checkoutTool.args.productName}
                            amount={checkoutTool.args.price}
                        />
                    </div>
                )}
            </div>

            {isUser && (
                <Avatar className="h-8 w-8 shrink-0 bg-secondary">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        EU
                    </AvatarFallback>
                </Avatar>
            )}
        </motion.div>
    )
}

interface GenerativeUIProps {
    component: unknown
}

function GenerativeUI({ component }: GenerativeUIProps) {
    const comp = component as { type: string; data: Record<string, unknown> }

    if (!comp?.type) return null

    switch (comp.type) {
        case 'product_card':
            return <ProductCard product={comp.data} />
        case 'action_buttons':
            return <ActionButtonsUI buttons={comp.data.buttons as string[]} />
        default:
            return null
    }
}

function ActionButtonsUI({ buttons }: { buttons?: string[] }) {
    if (!buttons?.length) return null

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {buttons.map((label, i) => (
                <button
                    key={i}
                    className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full border border-border transition-colors"
                >
                    {label}
                </button>
            ))}
        </div>
    )
}
