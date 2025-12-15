import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Props {
    params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return NextResponse.json({ product })
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params
        const body = await req.json()
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('products')
            .update({
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
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json({ product: data })
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
    }
}
