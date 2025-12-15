'use client'

import { useState, useRef, KeyboardEvent, FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (message: string) => void
    disabled?: boolean
    placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = "Digite sua mensagem..." }: ChatInputProps) {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSend = () => {
        const trimmed = value.trim()
        console.log('[ChatInput] handleSend called, value:', trimmed, 'disabled:', disabled)

        if (!trimmed) {
            console.log('[ChatInput] Empty message, not sending')
            return
        }

        if (disabled) {
            console.log('[ChatInput] Input is disabled, not sending')
            return
        }

        console.log('[ChatInput] Calling onSend with:', trimmed)
        onSend(trimmed)
        setValue('')

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log('[ChatInput] Enter key pressed')
            e.preventDefault()
            handleSend()
        }
    }

    const handleButtonClick = () => {
        console.log('[ChatInput] Send button clicked')
        handleSend()
    }

    const handleInput = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
        }
    }

    return (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-3 safe-bottom">
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onInput={handleInput}
                        placeholder={placeholder}
                        disabled={disabled}
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
                    type="button"
                    onClick={handleButtonClick}
                    disabled={!value.trim() || disabled}
                    size="icon"
                    className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shrink-0"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
