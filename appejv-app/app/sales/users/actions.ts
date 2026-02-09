'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Admin client with service role for Auth management
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function createUser(formData: FormData) {
    const supabase = await createServerClient()

    // Auth & Role check
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    const currentRole = (profile as any)?.role
    if (currentRole !== 'admin' && currentRole !== 'sale_admin') return { error: 'Forbidden' }

    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const fullName = (formData.get('fullName') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const role = formData.get('role') as 'sale' | 'customer' | 'admin' | 'sale_admin'
    const manager_id = formData.get('manager_id') as string | null

    if (!email || !password || !fullName || !role) {
        return { error: 'Missing required fields' }
    }

    if (currentRole === 'sale_admin' && (role === 'admin' || role === 'sale_admin')) {
        return { error: 'Sale Admin cannot create Admin or other Sale Admin accounts' }
    }

    const emailStr = email as string
    const passwordStr = password as string
    const fullNameStr = fullName as string

    let sanitizedPhone: string | undefined = phone?.trim()
    if (sanitizedPhone) {
        // Remove spaces and other non-digit characters except +
        const digitsOnly = sanitizedPhone.replace(/[^\d+]/g, '')
        if (digitsOnly.startsWith('0')) {
            sanitizedPhone = `+84${digitsOnly.slice(1)}`
        } else if (!digitsOnly.startsWith('+')) {
            sanitizedPhone = `+84${digitsOnly}`
        } else {
            sanitizedPhone = digitsOnly
        }
    }

    try {
        console.log('Attempting to create Auth user for:', email, 'with phone:', sanitizedPhone)

        // 1. Create Auth User
        const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: emailStr,
            password: passwordStr,
            phone: sanitizedPhone || undefined,
            email_confirm: true,
            user_metadata: { full_name: fullNameStr }
        })

        if (createError) {
            console.error('Auth creation error:', createError)
            return { error: `Auth Error: ${createError.message}` }
        }

        if (!user) {
            return { error: 'User creation failed without error message' }
        }

        console.log('Auth user created:', user.id, '. Updating profile...')

        // 2. Update Profile
        // We use upsert in case a trigger already created the profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: user.id,
                role: role,
                full_name: fullName,
                phone: phone,
                manager_id: manager_id
            })

        if (profileError) {
            console.error('Profile update error:', profileError)
            // Even if profile fails, user is created. We might want to mention this.
            return { error: `Profile Error: ${profileError.message}` }
        }

        console.log('User profile created successfully')
        revalidatePath('/sales/users')
        return { success: true }
    } catch (error: any) {
        console.error('Unexpected error during user creation:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function deleteUser(userId: string) {
    const supabase = await createServerClient()

    // Auth & Role check
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    const currentRole = (profile as any)?.role
    if (currentRole !== 'admin' && currentRole !== 'sale_admin') return { error: 'Forbidden' }

    if (userId === currentUser.id) return { error: 'Cannot delete yourself' }

    try {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (error) throw error

        revalidatePath('/sales/users')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
