'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/Header'
import { AuthModal } from '@/components/auth/AuthModal'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface User {
  email: string
  name?: string
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bem Vindo a Gol Club! Aqui você encontra as melhores camisas de futebol em qualidade e preço!\n\nCaso você já tenha uma conta basta fazer login para dar uma olhada no catálogo ou fazer novos pedidos.\n\nCaso seja sua primeira vez por aqui faça seu cadastro para seguirmos por aqui.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<User | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        setUser({
          email: authUser.email || '',
          name: authUser.user_metadata?.name
        })

        // Update welcome message for logged in user
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Olá${authUser.user_metadata?.name ? `, ${authUser.user_metadata.name}` : ''}! 👋 Seja bem-vindo de volta à **GolClub**!\n\nEm que posso te ajudar hoje? Quer ver nossos **lançamentos**, procurar uma camisa específica ou conferir seus **pedidos**?`
        }])
      }
    }

    checkSession()
  }, [])

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
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

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
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const showAuthModal = (type: 'login' | 'register') => {
    setAuthModalType(type)
    setAuthModalOpen(true)
  }

  const handleAuthSuccess = (userData: User) => {
    setUser(userData)
    setAuthModalOpen(false)
  }

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header
        showAuthModal={showAuthModal}
        user={user}
        onLogout={handleLogout}
      />

      {/* Banner Area */}
      <div className="bg-primary py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-white font-bold text-xl mb-2">BANNERS</h2>
        </div>
      </div>

      {/* Main Chat Area - Purple background like mockup */}
      <main className="flex-1 flex flex-col bg-primary">
        {/* Chat Container */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="bg-primary rounded-2xl border-4 border-white/20 p-4 h-full flex flex-col min-h-[400px]">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
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
                      <Avatar className="h-10 w-10 shrink-0 border-2 border-white bg-white/20">
                        <AvatarFallback className="bg-transparent text-white text-lg">
                          👤
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {message.role === 'user' && (
                      <Avatar className="h-10 w-10 shrink-0 border-2 border-white bg-white">
                        <AvatarFallback className="bg-white text-primary text-lg">
                          👤
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      'max-w-[85%] rounded-xl px-4 py-3 border-2',
                      message.role === 'user'
                        ? 'bg-white text-zinc-900 border-white'
                        : 'bg-white text-zinc-900 border-white'
                    )}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.content === '' && (
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white bg-white/20">
                      <AvatarFallback className="bg-transparent text-white text-lg">👤</AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-xl px-4 py-3 border-2 border-white">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-primary py-4 border-t-4 border-white/20">
          <div className="max-w-4xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="w-full bg-white rounded-full px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none border-4 border-white focus:border-white/80"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white border-4 border-white"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialType={authModalType}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
