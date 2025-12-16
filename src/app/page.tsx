'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/Header'
import { AuthModal } from '@/components/auth/AuthModal'
import { GuestHome } from '@/components/home/GuestHome'
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
  const [messages, setMessages] = useState<ChatMessage[]>([])
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

        // Initial message for logged in user
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
    // Initialize chat for newly logged in user
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Olá${userData.name ? `, ${userData.name}` : ''}! 👋 Seja bem-vindo de volta à **GolClub**!\n\nEm que posso te ajudar hoje?`
    }])
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <Header
        showAuthModal={showAuthModal}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        {!user ? (
          // Guest View - Static Landing Page
          <GuestHome />
        ) : (
          // Logged In View - Functional Chat in a Box
          <div className="w-full max-w-4xl flex flex-col gap-6">

            {/* Optional Banner for Logged Users too? 
                The user said "banner placeholder" implies marketing triggers. 
                Let's keep the banner placeholder consistent if needed, 
                but for now let's focus on the chat box as requested.
            */}

            {/* Banner Placeholder (Optional - keeping consistent layout) */}
            <div className="bg-primary rounded-xl h-24 flex items-center justify-center shadow-lg mb-2">
              <h2 className="text-white text-2xl font-bold tracking-wide">BANNERS</h2>
            </div>

            {/* Chat Box Container */}
            <div className="bg-primary rounded-2xl shadow-xl flex flex-col h-[600px] overflow-hidden relative">

              {/* Scrollable Messages Area */}
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-6">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-4',
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="bg-transparent border-2 border-white rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0">
                          <User className="text-white h-5 w-5" />
                        </div>
                      )}
                      {message.role === 'user' && (
                        <div className="bg-white rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0">
                          <User className="text-primary h-5 w-5" />
                        </div>
                      )}
                      <div className={cn(
                        'max-w-[80%] rounded-2xl px-5 py-4 shadow-sm',
                        message.role === 'user'
                          ? 'bg-white text-zinc-900 rounded-tr-sm'
                          : 'bg-white text-zinc-900 rounded-tl-sm'
                      )}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.content === '' && (
                    <div className="flex gap-4">
                      <div className="bg-transparent border-2 border-white rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0">
                        <User className="text-white h-5 w-5" />
                      </div>
                      <div className="bg-white rounded-2xl px-5 py-4 rounded-tl-sm shadow-sm">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area - Inside the Box */}
              <div className="p-4 bg-primary border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex gap-3 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md transition-all"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-2 h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>

            </div>
          </div>
        )}
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
