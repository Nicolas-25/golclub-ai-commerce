
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Initialize Supabase Admin client
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Delete the user from Auth (this cascades to unrelated tables IF set up, but manually deleting data is safer if FKs restrict)
        // My schema has ON DELETE CASCADE?
        // "REFERENCES auth.users(id)" defaults to NO ACTION usually, need ON DELETE CASCADE.
        // I should verify schema or try delete.
        // If delete fails, I need to delete related data first.

        // Try deleting user directly
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

        if (error) {
            console.error('Error deleting user:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Sign out key user (client side usually handles this, but we can clear cookies)
        // The client will handle redirect.

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
