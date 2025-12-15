'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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

// Detect if message contains a name (simple heuristic)
function extractName(message: string, previousAssistantMessage: string): string | null {
  const lowerPrev = previousAssistantMessage.toLowerCase()

  // Check if AI asked for name
  if (lowerPrev.includes('como posso te chamar') ||
    lowerPrev.includes('qual seu nome') ||
    lowerPrev.includes('qual o seu nome') ||
    lowerPrev.includes('me chamo') ||
    lowerPrev.includes('seu nome')) {

    // Extract first word as name (common pattern)
    const words = message.trim().split(/\s+/)
    const firstWord = words[0]

    // Check if it looks like a name (starts with capital, reasonable length)
    if (firstWord &&
      firstWord.length >= 2 &&
      firstWord.length <= 20 &&
      /^[A-ZÀ-Ú][a-zà-ú]+$/.test(firstWord)) {
      return firstWord
    }

    // If message is short, likely just the name
    if (message.trim().length <= 30 && !message.includes(' ') || words.length <= 2) {
      return message.trim().split(' ')[0]
    }
  }

  return null
}

// Detect WhatsApp number
function extractWhatsApp(message: string, previousAssistantMessage: string): string | null {
  const lowerPrev = previousAssistantMessage.toLowerCase()

  if (lowerPrev.includes('whatsapp') || lowerPrev.includes('telefone') || lowerPrev.includes('celular')) {
    // Look for phone number patterns
    const phoneMatch = message.match(/\d{10,11}/)
    if (phoneMatch) return phoneMatch[0]

    // Try with formatting
    const formattedMatch = message.match(/\(?\d{2}\)?\s*\d{4,5}[-\s]?\d{4}/)
    if (formattedMatch) {
      return formattedMatch[0].replace(/\D/g, '')
    }
  }

  return null
}

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! 👋 Bem-vindo à GolClub!\n\nSou seu assistente virtual e estou aqui para te ajudar a encontrar a camisa perfeita do seu time do coração. ⚽\n\nQual time você torce?',
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({})
  const [sessionId] = useState(() => generateSessionId())

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Save lead to backend
  const saveLead = useCallback(async (updates: Partial<LeadInfo>) => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          session_id: sessionId,
        }),
      })
    } catch (error) {
      console.error('Error saving lead:', error)
    }
  }, [sessionId])

  // Auto-resize textarea
  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    }

    // Get last assistant message for context
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant')?.content || ''

    // Try to extract lead info
    const extractedName = extractName(content, lastAssistantMsg)
    const extractedWhatsApp = extractWhatsApp(content, lastAssistantMsg)

    let updatedLeadInfo = { ...leadInfo }

    if (extractedName && !leadInfo.name) {
      updatedLeadInfo.name = extractedName
      setLeadInfo(updatedLeadInfo)
      saveLead({ name: extractedName })
    }

    if (extractedWhatsApp && !leadInfo.whatsapp) {
      updatedLeadInfo.whatsapp = extractedWhatsApp
      setLeadInfo(updatedLeadInfo)
      saveLead({ whatsapp: extractedWhatsApp })
    }

    // Extract team interest from keywords
    const teams = ['flamengo', 'corinthians', 'palmeiras', 'são paulo', 'santos', 'vasco', 'fluminense', 'botafogo', 'grêmio', 'internacional', 'cruzeiro', 'atlético', 'real madrid', 'barcelona']
    const lowerContent = content.toLowerCase()
    const mentionedTeam = teams.find(t => lowerContent.includes(t))

    if (mentionedTeam && !leadInfo.team_interest) {
      updatedLeadInfo.team_interest = mentionedTeam
      setLeadInfo(updatedLeadInfo)
      saveLead({ team_interest: mentionedTeam })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          leadInfo: updatedLeadInfo,
        }),
      })

      if (!response.ok) throw new Error('Failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let assistantContent = ''
      const assistantId = `assistant-${Date.now()}`

      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
      }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          assistantContent += chunk

          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          ))
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, leadInfo, saveLead])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <main className="min-h-screen">
      <div className="flex flex-col h-[100dvh] bg-background">
        <ChatHeader />

        {/* Lead indicator */}
        {leadInfo.name && (
          <div className="px-4 py-1.5 bg-primary/10 text-xs text-primary text-center border-b border-border">
            👤 {leadInfo.name} {leadInfo.whatsapp && `• 📱 ${leadInfo.whatsapp}`}
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-0">
          <div className="flex flex-col gap-4 py-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex gap-3 px-4',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isUser && (
                    <Avatar className="h-8 w-8 shrink-0 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        GC
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn('max-w-[85%] space-y-2', isUser ? 'items-end' : 'items-start')}>
                    {msg.content && (
                      <div className={cn(
                        'rounded-2xl px-4 py-2.5 text-sm',
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-card text-card-foreground rounded-bl-md border border-border'
                      )}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
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
            })}

            {isLoading && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-3 safe-bottom">
          <form onSubmit={onSubmit} className="flex items-end gap-2 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(input)
                  }
                }}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                rows={1}
                className={cn(
                  "w-full resize-none rounded-2xl bg-card border border-border",
                  "px-4 py-3 text-sm placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "scrollbar-thin"
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
