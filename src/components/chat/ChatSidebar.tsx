'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, User, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import ReactMarkdown from 'react-markdown'
import { useChatContext } from '@/contexts/ChatContext'

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
}

interface ChatSidebarProps {
    userEmail?: string
    userName?: string
}

export function ChatSidebar({ userEmail, userName }: ChatSidebarProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: userName
                ? `Olá, ${userName}! 👋 Vejo que está navegando pelo catálogo. Posso te ajudar a encontrar algo específico?`
                : 'Olá! 👋 Posso te ajudar a encontrar a camisa perfeita?'
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const { isExpanded, toggleExpanded, selectedProduct, clearSelectedProduct } = useChatContext()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        const assistantId = (Date.now() + 1).toString()
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    userInfo: {
                        name: userName,
                        email: userEmail,
                    },
                }),
            })

            if (!response.ok) throw new Error('Failed')

            const reader = response.body?.getReader()
            if (!reader) throw new Error('No reader')

            const decoder = new TextDecoder()
            let assistantContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                assistantContent += chunk

                setMessages(prev =>
                    prev.map(m =>
                        m.id === assistantId
                            ? { ...m, content: assistantContent }
                            : m
                    )
                )
            }
        } catch (error) {
            console.error('Error:', error)
            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantId
                        ? { ...m, content: 'Desculpe, tive um problema. Pode repetir?' }
                        : m
                )
            )
        } finally {
            setIsLoading(false)
        }
    }, [messages, isLoading, userName, userEmail])

    // Handle product selected from catalog
    useEffect(() => {
        if (selectedProduct) {
            const productMessage = `Quero saber mais sobre a camisa ${selectedProduct.name} do ${selectedProduct.team}!`
            sendMessage(productMessage)
            clearSelectedProduct()
        }
    }, [selectedProduct, clearSelectedProduct, sendMessage])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(input)
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ width: isExpanded ? 380 : 56 }}
                animate={{ width: isExpanded ? 380 : 56 }}
                transition={{ duration: 0.3 }}
                className="fixed right-4 top-20 bottom-4 bg-primary rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
            >
                {/* Toggle Button */}
                <button
                    onClick={toggleExpanded}
                    className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-50"
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
                        <div className="p-4 pt-14 border-b border-white/10">
                            <h3 className="text-white font-bold text-lg">Chat GolClub</h3>
                            <p className="text-white/70 text-sm">Assistente de vendas</p>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
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
                                            <div className="bg-white/20 rounded-full p-1.5 h-8 w-8 flex items-center justify-center shrink-0">
                                                <User className="text-white h-4 w-4" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm prose prose-sm max-w-none',
                                            message.role === 'user'
                                                ? 'bg-white text-zinc-900 rounded-tr-sm'
                                                : 'bg-white/10 text-white rounded-tl-sm'
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
                                    </motion.div>
                                ))}
                                {isLoading && messages[messages.length - 1]?.content === '' && (
                                    <div className="flex gap-3">
                                        <div className="bg-white/20 rounded-full p-1.5 h-8 w-8 flex items-center justify-center">
                                            <User className="text-white h-4 w-4" />
                                        </div>
                                        <div className="bg-white/10 rounded-2xl px-4 py-2.5 rounded-tl-sm">
                                            <TypingIndicator />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 bg-white/10 text-white placeholder:text-white/50 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="h-10 w-10 rounded-full bg-white text-primary hover:bg-white/90"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                )}

                {/* Collapsed state - just icon */}
                {!isExpanded && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white/20 rounded-full p-3">
                            <User className="text-white h-6 w-6" />
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
