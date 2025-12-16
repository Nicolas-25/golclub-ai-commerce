import { createClient } from '@/lib/supabase/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { ResetPasswordEmail } from '@/lib/email-templates'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email é obrigatório' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        const origin = req.headers.get('origin') || 'http://localhost:3000'

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/reset-password`
        })

        if (error) {
            // Don't reveal if email exists or not for security
            console.error('Password reset error:', error)
        }

        // Always send success to prevent email enumeration
        // But only actually send email if user exists
        if (!error) {
            try {
                await getResend().emails.send({
                    from: FROM_EMAIL,
                    to: email,
                    subject: 'Redefinir Senha - GolClub ⚽',
                    html: ResetPasswordEmail({
                        name: email.split('@')[0],
                        resetUrl: `${origin}/auth/reset-password`
                    }),
                })
            } catch (emailError) {
                console.error('Error sending reset email:', emailError)
            }
        }

        return NextResponse.json({
            message: 'Se o email existir, você receberá um link para redefinir sua senha.'
        })
    } catch (error: any) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        )
    }
}
