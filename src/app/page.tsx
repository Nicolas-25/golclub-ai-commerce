'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/Header'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { ProductCatalog } from '@/components/catalog/ProductCatalog'
import { AuthModal } from '@/components/auth/AuthModal'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface LeadInfo {
  name?: string
  whatsapp?: string
  team_interest?: string
}

// Generate session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Detect if message contains a name
function extractName(message: string, previousAssistantMessage: string): string | null {
  const namePatterns = [
    /(?:me chamo|meu nome é|sou o|sou a|pode me chamar de)\s+([A-ZÀ-Ú][a-zà-ú]+)/i,
    /^([A-ZÀ-Ú][a-zà-ú]+)$/,
  ]

  const askingForName = previousAssistantMessage.toLowerCase().includes('como posso te chamar') ||
    previousAssistantMessage.toLowerCase().includes('qual seu nome') ||
    previousAssistantMessage.toLowerCase().includes('qual o seu nome')

  if (askingForName && message.trim().split(' ').length <= 3) {
    const words = message.trim().split(' ')
    const possibleName = words[0]
    if (possibleName && possibleName.length > 1 && /^[A-ZÀ-Ú]/i.test(possibleName)) {
      return possibleName.charAt(0).toUpperCase() + possibleName.slice(1).toLowerCase()
    }
  }

  for (const pattern of namePatterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

// Detect WhatsApp number
function extractWhatsApp(message: string, previousAssistantMessage: string): string | null {
  const phonePattern = /(?:\+?55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/
  const askingForPhone = previousAssistantMessage.toLowerCase().includes('whatsapp') ||
    previousAssistantMessage.toLowerCase().includes('telefone') ||
    previousAssistantMessage.toLowerCase().includes('celular')

  if (askingForPhone) {
    const match = message.match(phonePattern)
    if (match) {
      return match[0].replace(/\D/g, '')
    }
  }

  return null
}

// Detect team interest
function extractTeamInterest(message: string): string | null {
  const teams = ['flamengo', 'corinthians', 'palmeiras', 'são paulo', 'santos', 'grêmio',
    'internacional', 'cruzeiro', 'atlético', 'botafogo', 'fluminense', 'vasco']
  const lowerMessage = message.toLowerCase()

  for (const team of teams) {
    if (lowerMessage.includes(team)) {
      return team.charAt(0).toUpperCase() + team.slice(1)
    }
  }

  return null
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Seja bem-vindo à **GolClub**! Sou sua assistente de vendas e vou te ajudar a encontrar a camisa perfeita do seu time do coração. ⚽\n\nPara começar, **qual time você torce?** Ou se preferir, me conta o que você está procurando!'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({})
  const [showCatalog, setShowCatalog] = useState(false)
  const [catalogTeamFilter, setCatalogTeamFilter] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const saveLead = useCallback(async (data: Partial<LeadInfo>) => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          session_id: sessionId,
        }),
      })
    } catch (error) {
      console.error('Error saving lead:', error)
    }
  }, [sessionId])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
    }

    const lastAssistantMsg = messages.filter(m => m.role === 'assistant').pop()?.content || ''

    // Extract lead info
    const extractedName = extractName(content, lastAssistantMsg)
    const extractedWhatsApp = extractWhatsApp(content, lastAssistantMsg)
    const extractedTeam = extractTeamInterest(content)

    if (extractedName && !leadInfo.name) {
      const newLeadInfo = { ...leadInfo, name: extractedName }
      setLeadInfo(newLeadInfo)
      saveLead({ name: extractedName })
    }

    if (extractedWhatsApp && !leadInfo.whatsapp) {
      const newLeadInfo = { ...leadInfo, whatsapp: extractedWhatsApp }
      setLeadInfo(newLeadInfo)
      saveLead({ whatsapp: extractedWhatsApp })
    }

    if (extractedTeam && !leadInfo.team_interest) {
      const newLeadInfo = { ...leadInfo, team_interest: extractedTeam }
      setLeadInfo(newLeadInfo)
      saveLead({ team_interest: extractedTeam })
      setCatalogTeamFilter(extractedTeam)
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

        // Check if AI wants to show catalog
        if (assistantContent.includes('[MOSTRAR_CATALOGO]') ||
          assistantContent.includes('ver mais opções') ||
          assistantContent.includes('ver todas as camisas')) {
          setShowCatalog(true)
        }

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: assistantContent.replace('[MOSTRAR_CATALOGO]', '') }
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
  }, [messages, isLoading, leadInfo, saveLead])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleProductSelect = (product: any) => {
    setShowCatalog(false)
    sendMessage(`Quero saber mais sobre a camisa ${product.name} do ${product.team}`)
  }

  const showAuthModal = (type: 'login' | 'register') => {
    setAuthModalType(type)
    setAuthModalOpen(true)
  }

  const handleAuthSuccess = (userData: { email: string; name?: string }) => {
    setUser(userData)
    setAuthModalOpen(false)
    if (userData.name) {
      setLeadInfo(prev => ({ ...prev, name: userData.name }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        onProductsClick={() => setShowCatalog(!showCatalog)}
        showAuthModal={showAuthModal}
      />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Chat Area */}
          <motion.div
            layout
            className={cn(
              'flex flex-col transition-all duration-300',
              showCatalog ? 'w-full md:w-2/5 border-r border-border' : 'w-full'
            )}
          >
            {/* Lead indicator */}
            {(leadInfo.name || leadInfo.whatsapp) && (
              <div className="bg-primary/10 px-4 py-2 text-sm border-b border-border">
                <span className="text-primary font-medium">
                  {leadInfo.name && `👤 ${leadInfo.name}`}
                  {leadInfo.name && leadInfo.whatsapp && ' • '}
                  {leadInfo.whatsapp && `📱 ${leadInfo.whatsapp}`}
                  {leadInfo.team_interest && ` • ⚽ ${leadInfo.team_interest}`}
                </span>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="max-w-3xl mx-auto space-y-4">
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
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className={cn(
                        message.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                      )}>
                        {message.role === 'user' ? '👤' : '⚽'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary rounded-bl-md'
                    )}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.content === '' && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">⚽</AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={user ? `Olá ${user.name || 'visitante'}, como posso ajudar?` : 'Digite sua mensagem...'}
                  className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-12 w-12 rounded-xl"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>

              {/* Quick actions for guests */}
              {!user && (
                <div className="max-w-3xl mx-auto mt-3 flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showAuthModal('register')}
                    className="text-xs"
                  >
                    Cadastrar e ganhar 10% OFF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => showAuthModal('login')}
                    className="text-xs"
                  >
                    Já tenho conta
                  </Button>
                </div>
              )}
            </div>

            {/* Toggle catalog on mobile */}
            {!showCatalog && (
              <button
                onClick={() => setShowCatalog(true)}
                className="md:hidden fixed bottom-24 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            )}
          </motion.div>

          {/* Catalog Panel */}
          {showCatalog && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-full md:w-3/5 fixed md:relative inset-0 md:inset-auto z-40 bg-background"
            >
              <ProductCatalog
                onClose={() => setShowCatalog(false)}
                onSelectProduct={handleProductSelect}
                teamFilter={catalogTeamFilter}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
