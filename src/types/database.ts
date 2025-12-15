export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    team: string
                    season: string
                    type: 'home' | 'away' | 'third' | 'special' | 'retro'
                    price_cost: number
                    price_sale: number
                    price_international: number | null
                    image_url: string | null
                    images: string[] | null
                    sizes_available: string[]
                    stock_br: number
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    team: string
                    season: string
                    type?: 'home' | 'away' | 'third' | 'special' | 'retro'
                    price_cost: number
                    price_sale: number
                    price_international?: number | null
                    image_url?: string | null
                    images?: string[] | null
                    sizes_available?: string[]
                    stock_br?: number
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    team?: string
                    season?: string
                    type?: 'home' | 'away' | 'third' | 'special' | 'retro'
                    price_cost?: number
                    price_sale?: number
                    price_international?: number | null
                    image_url?: string | null
                    images?: string[] | null
                    sizes_available?: string[]
                    stock_br?: number
                    is_active?: boolean
                }
            }
            leads: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string | null
                    whatsapp: string | null
                    team_interest: string | null
                    utm_source: string | null
                    utm_medium: string | null
                    utm_campaign: string | null
                    utm_content: string | null
                    status: 'active' | 'abandoned' | 'purchased' | 'returning'
                    last_interaction: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string | null
                    whatsapp?: string | null
                    team_interest?: string | null
                    utm_source?: string | null
                    utm_medium?: string | null
                    utm_campaign?: string | null
                    utm_content?: string | null
                    status?: 'active' | 'abandoned' | 'purchased' | 'returning'
                    last_interaction?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string | null
                    whatsapp?: string | null
                    team_interest?: string | null
                    utm_source?: string | null
                    utm_medium?: string | null
                    utm_campaign?: string | null
                    utm_content?: string | null
                    status?: 'active' | 'abandoned' | 'purchased' | 'returning'
                    last_interaction?: string
                }
            }
            chat_sessions: {
                Row: {
                    id: string
                    created_at: string
                    lead_id: string | null
                    context: Json
                    current_state: string
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    lead_id?: string | null
                    context?: Json
                    current_state?: string
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    lead_id?: string | null
                    context?: Json
                    current_state?: string
                    is_active?: boolean
                }
            }
            messages: {
                Row: {
                    id: string
                    created_at: string
                    session_id: string | null
                    role: 'user' | 'assistant' | 'system'
                    content: string
                    ui_component: Json | null
                    metadata: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    session_id?: string | null
                    role: 'user' | 'assistant' | 'system'
                    content: string
                    ui_component?: Json | null
                    metadata?: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    session_id?: string | null
                    role?: 'user' | 'assistant' | 'system'
                    content?: string
                    ui_component?: Json | null
                    metadata?: Json
                }
            }
            orders: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    lead_id: string | null
                    product_id: string | null
                    size: string
                    quantity: number
                    total_amount: number
                    payment_status: 'pending' | 'paid' | 'cancelled' | 'refunded'
                    payment_id: string | null
                    pix_code: string | null
                    pix_qr_code: string | null
                    shipping_type: 'stock_br' | 'international'
                    tracking_code: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    lead_id?: string | null
                    product_id?: string | null
                    size: string
                    quantity?: number
                    total_amount: number
                    payment_status?: 'pending' | 'paid' | 'cancelled' | 'refunded'
                    payment_id?: string | null
                    pix_code?: string | null
                    pix_qr_code?: string | null
                    shipping_type: 'stock_br' | 'international'
                    tracking_code?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    lead_id?: string | null
                    product_id?: string | null
                    size?: string
                    quantity?: number
                    total_amount?: number
                    payment_status?: 'pending' | 'paid' | 'cancelled' | 'refunded'
                    payment_id?: string | null
                    pix_code?: string | null
                    pix_qr_code?: string | null
                    shipping_type?: 'stock_br' | 'international'
                    tracking_code?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Convenience types
export type Product = Database['public']['Tables']['products']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

// UI Component types for Generative UI
export type UIComponentType =
    | 'product_card'
    | 'product_carousel'
    | 'offer_comparison'
    | 'size_selector'
    | 'action_buttons'
    | 'pix_payment'

export interface UIComponent {
    type: UIComponentType
    data: Record<string, unknown>
}
