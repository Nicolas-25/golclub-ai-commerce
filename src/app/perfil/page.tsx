import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

import { Header } from '@/components/layout/Header'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function PerfilPage() {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    const userData = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Header user={user} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Meu Perfil</h1>

                <ProfileForm user={userData} />
            </main>
        </div>
    )
}
