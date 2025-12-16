'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Product {
    id: string
    name: string
    team: string
    price_sale: number
    price_international?: number
    image_url?: string
    stock_br?: number
}

interface ChatContextType {
    // Chat expansion state
    isExpanded: boolean
    setIsExpanded: (expanded: boolean) => void
    toggleExpanded: () => void

    // Selected product for chat flow
    selectedProduct: Product | null
    selectProduct: (product: Product) => void
    clearSelectedProduct: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const toggleExpanded = () => setIsExpanded(prev => !prev)

    const selectProduct = (product: Product) => {
        setSelectedProduct(product)
        setIsExpanded(true) // Expand chat when product is selected
    }

    const clearSelectedProduct = () => setSelectedProduct(null)

    return (
        <ChatContext.Provider value={{
            isExpanded,
            setIsExpanded,
            toggleExpanded,
            selectedProduct,
            selectProduct,
            clearSelectedProduct,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChatContext() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider')
    }
    return context
}
