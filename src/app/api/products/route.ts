import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return NextResponse.json({ products })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('products')
            .insert({
                name: body.name,
                team: body.team,
                season: body.season,
                type: body.type,
                price_cost: body.price_cost,
                price_sale: body.price_sale,
                price_international: body.price_international,
                sizes_available: body.sizes_available,
                stock_br: body.stock_br,
                is_active: body.is_active,
                image_url: body.image_url,
            })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ product: data })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
    }
}
