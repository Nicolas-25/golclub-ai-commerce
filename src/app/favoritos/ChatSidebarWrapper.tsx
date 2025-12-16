'use client'

import { ChatSidebar } from '@/components/chat/ChatSidebar'

interface ChatSidebarWrapperProps {
    userEmail: string
    userName?: string
}

export function ChatSidebarWrapper({ userEmail, userName }: ChatSidebarWrapperProps) {
    return <ChatSidebar userEmail={userEmail} userName={userName} />
}
