import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || '',
                }
            }
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            user: data.user,
            message: 'Cadastro realizado! Verifique seu email.'
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        )
    }
}
