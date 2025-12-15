'use client'

import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import type { Message } from '@/types/database'

interface ChatContainerProps {
    messages: Message[]
    isLoading?: boolean
    onSendMessage: (content: string) => void
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
    return (
        <div className="flex flex-col h-[100dvh] bg-background">
            <ChatHeader />

            <ChatMessages messages={messages} isLoading={isLoading} />

            <ChatInput onSend={onSendMessage} disabled={isLoading} />
        </div>
    )
}
