import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, whatsapp, team_interest, session_id } = body

        const supabase = await createClient()

        // Check if lead already exists for this session
        if (session_id) {
            const { data: existingLead } = await supabase
                .from('leads')
                .select('id')
                .eq('session_id', session_id)
                .single()

            if (existingLead) {
                // Update existing lead
                const { data, error } = await supabase
                    .from('leads')
                    .update({
                        ...(name && { name }),
                        ...(whatsapp && { whatsapp }),
                        ...(team_interest && { team_interest }),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingLead.id)
                    .select()
                    .single()

                if (error) throw error

                return NextResponse.json({ success: true, lead: data, updated: true })
            }
        }

        // Create new lead
        const { data, error } = await supabase
            .from('leads')
            .insert({
                name,
                whatsapp,
                team_interest,
                session_id,
                status: 'active',
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, lead: data, created: true })
    } catch (error) {
        console.error('Error saving lead:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao salvar lead' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const session_id = searchParams.get('session_id')

        if (!session_id) {
            return NextResponse.json({ error: 'session_id required' }, { status: 400 })
        }

        const supabase = await createClient()

        const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('session_id', session_id)
            .single()

        if (error && error.code !== 'PGRST116') throw error

        return NextResponse.json({ lead: lead || null })
    } catch (error) {
        console.error('Error fetching lead:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar lead' },
            { status: 500 }
        )
    }
}
