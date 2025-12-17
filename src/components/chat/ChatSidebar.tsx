'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import { TypingIndicator } from './TypingIndicator'
import { useChatContext } from '@/contexts/ChatContext'
import { ProductCard } from './ProductCard'

interface ChatSidebarProps {
    userEmail?: string
    userName?: string
}

export function ChatSidebar({ userEmail, userName }: ChatSidebarProps) {
    const { isExpanded, setIsExpanded, selectedProduct, clearSelectedProduct } = useChatContext()
    const scrollRef = useRef<HTMLDivElement>(null)

    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, append } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: `Olá${userName ? `, ${userName}` : ''}! Sou o assistente da GolClub. Como posso ajudar você a encontrar o manto sagrado hoje? ⚽`
            }
        ],
        body: {
            userInfo: {
                name: userName,
                email: userEmail
            }
        }
    })

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages, isLoading])

    // Toggle expand
    const toggleExpanded = () => setIsExpanded(!isExpanded)

    // Handle product selection from catalog
    useEffect(() => {
        if (selectedProduct) {
            if (!isExpanded) setIsExpanded(true);

            // Send message to AI about the selected product
            append({
                role: 'user',
                content: `Gostei da camisa ${selectedProduct.name}. Pode me dar mais detalhes sobre ela?`
            });

            clearSelectedProduct();
        }
    }, [selectedProduct, isExpanded, setIsExpanded, append, clearSelectedProduct]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ width: isExpanded ? 380 : 56 }}
                animate={{ width: isExpanded ? 380 : 56 }}
                transition={{ duration: 0.3 }}
                className="fixed right-4 top-20 bottom-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
                {/* Toggle Button */}
                <button
                    onClick={toggleExpanded}
                    className="absolute top-4 left-4 p-2 rounded-full bg-[#6A00A0] hover:bg-[#580085] transition-colors z-50 shadow-md"
                >
                    {isExpanded ? (
                        <Minimize2 className="h-4 w-4 text-white" />
                    ) : (
                        <Maximize2 className="h-4 w-4 text-white" />
                    )}
                </button>

                {isExpanded && (
                    <>
                        {/* Header */}
                        <div className="p-4 pt-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                            <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Chat GolClub</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Assistente de vendas</p>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4 pb-4">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            'flex gap-3',
                                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        )}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="bg-[#6A00A0] rounded-full p-1.5 h-8 w-8 flex items-center justify-center shrink-0 shadow-sm text-white self-start mt-1">
                                                <User className="h-4 w-4" />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 max-w-[85%]">
                                            {/* Text Content */}
                                            {message.content && (
                                                <div className={cn(
                                                    'rounded-2xl px-4 py-2.5 text-sm prose prose-sm max-w-none',
                                                    message.role === 'user'
                                                        ? 'bg-[#6A00A0] text-white rounded-tr-sm shadow-md'
                                                        : 'bg-white text-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-sm rounded-tl-sm'
                                                )}>
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ children }) => <p className="m-0 whitespace-pre-wrap">{children}</p>,
                                                            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}

                                            {/* Tool Invocations (Product Card / Checkout) */}
                                            {message.toolInvocations?.map((toolInvocation) => {
                                                if (toolInvocation.toolName === 'showProduct') {
                                                    const { title, subtitle, image, priceChina, priceBr } = toolInvocation.args;

                                                    return (
                                                        <div key={toolInvocation.toolCallId} className="mt-2">
                                                            <ProductCard
                                                                title={title}
                                                                subtitle={subtitle}
                                                                image={image}
                                                                priceChina={priceChina}
                                                                priceBr={priceBr}
                                                                onViewDetails={() => console.log('View details', title)}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                                    <div className="flex gap-3">
                                        <div className="bg-[#6A00A0] rounded-full p-1.5 h-8 w-8 flex items-center justify-center shrink-0 text-white self-start mt-1">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="bg-white border border-purple-100 dark:border-zinc-800 rounded-2xl px-4 py-2.5 rounded-tl-sm shadow-sm">
                                            <TypingIndicator />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A00A0]/20 border border-transparent focus:border-[#6A00A0]"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="h-10 w-10 rounded-full bg-[#6A00A0] text-white hover:bg-[#580085] shadow-md"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                )}

                {/* Collapsed state - just icon */}
                {!isExpanded && (
                    <div className="flex-1 flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors" onClick={toggleExpanded}>
                        <div className="bg-[#6A00A0] rounded-full p-3 shadow-md">
                            <User className="text-white h-6 w-6" />
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
