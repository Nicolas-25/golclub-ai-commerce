import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    const products = [
        {
            name: 'Camisa Brasil Home 2024/25',
            description: 'Camisa oficial da seleção brasileira para a temporada 2024/25. Tecido tecnológico e design clássico.',
            price: 349.90,
            temp_price: 349.90,
            team: 'Brasil',
            image_url: 'https://images.unsplash.com/photo-1577212017184-80cc0da11dfd?auto=format&fit=crop&q=80&w=800',
            category: 'Seleções',
            is_launch: true,
            season: '2024/25'
        },
        {
            name: 'Camisa Flamengo I 2024',
            description: 'Manto sagrado rubro-negro. Versão torcedor com tecnologia Aeroready.',
            price: 349.90,
            temp_price: 299.90,
            team: 'Flamengo',
            image_url: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=800',
            category: 'Nacional',
            is_launch: true,
            season: '2024'
        },
        {
            name: 'Camisa Real Madrid Home 23/24',
            description: 'A camisa do maior campeão da Europa. Elegância e tradição em branco.',
            price: 399.90,
            temp_price: 399.90,
            team: 'Real Madrid',
            image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
            category: 'Europeu',
            is_launch: true,
            season: '2023/24'
        },
        {
            name: 'Camisa Manchester City Home 23/24',
            description: 'Camisa azul celeste do atual campeão da Champions.',
            price: 379.90,
            temp_price: 379.90,
            team: 'Manchester City',
            image_url: 'https://images.unsplash.com/photo-1627637820714-fa3f68d66138?auto=format&fit=crop&q=80&w=800',
            category: 'Europeu',
            is_launch: false,
            season: '2023/24'
        }
    ]

    const results = []

    for (const p of products) {
        // Upsert based on name or team? Name should be unique-ish for seed
        // Ideally upsert, but I don't have constraints on name.
        // I'll just insert if not exists (checked by name) to simulate logic, or actually just use insert and ignore errors if needed, but duplicates are bad.
        // Better: Check if exists.

        const { data } = await supabase.from('products').select('id').eq('name', p.name).single()

        if (!data) {
            const { error } = await supabase.from('products').insert([p])
            results.push({ name: p.name, status: error ? 'error' : 'inserted', error })
        } else {
            // Update
            const { error } = await supabase.from('products').update(p).eq('id', data.id)
            results.push({ name: p.name, status: error ? 'error' : 'updated', error })
        }
    }

    return NextResponse.json({ success: true, results })
}
