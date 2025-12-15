'use client'

import { useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import type { Message } from '@/types/database'

interface ChatMessagesProps {
    messages: Message[]
    isLoading?: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    return (
        <ScrollArea className="flex-1 px-0">
            <div className="flex flex-col gap-4 py-4">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={message.id || index}
                        message={message}
                        isLatest={index === messages.length - 1}
                    />
                ))}

                {isLoading && <TypingIndicator />}

                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    )
}
