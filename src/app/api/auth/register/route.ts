import { createClient } from '@/lib/supabase/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { ConfirmationEmail, WelcomeEmail } from '@/lib/email-templates'
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

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'A senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get the origin for redirect URL
        const origin = req.headers.get('origin') || 'http://localhost:3000'

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || email.split('@')[0],
                },
                emailRedirectTo: `${origin}/auth/callback`
            }
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        // Send confirmation email via Resend
        if (data.user && !data.user.email_confirmed_at) {
            const confirmUrl = `${origin}/auth/confirm?token_hash=${data.user.id}&type=signup`

            try {
                await getResend().emails.send({
                    from: FROM_EMAIL,
                    to: email,
                    subject: 'Confirme seu email - GolClub ⚽',
                    html: ConfirmationEmail({
                        name: name || email.split('@')[0],
                        confirmUrl
                    }),
                })
            } catch (emailError) {
                console.error('Error sending confirmation email:', emailError)
            }
        }

        // If email is already confirmed (development mode), send welcome email
        if (data.user?.email_confirmed_at) {
            try {
                await getResend().emails.send({
                    from: FROM_EMAIL,
                    to: email,
                    subject: 'Bem-vindo à GolClub! ⚽',
                    html: WelcomeEmail({ name: name || email.split('@')[0] }),
                })
            } catch (emailError) {
                console.error('Error sending welcome email:', emailError)
            }
        }

        return NextResponse.json({
            user: data.user,
            message: data.user?.email_confirmed_at
                ? 'Cadastro realizado com sucesso!'
                : 'Verifique seu email para confirmar a conta.'
        })
    } catch (error: any) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        )
    }
}
