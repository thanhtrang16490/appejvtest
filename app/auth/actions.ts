'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string

    let error;

    if (email) {
        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        error = result.error
    } else if (phone) {
        const result = await supabase.auth.signInWithPassword({
            phone,
            password,
        })
        error = result.error
    } else {
        return { error: 'Email or Phone is required' }
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    // Check user role to decide where to redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

        // Sales staff go to sales dashboard
        if (profile && ['sale', 'admin', 'sale_admin'].includes((profile as any).role)) {
            redirect('/sales')
        } else {
            // Customers go to dashboard
            redirect('/customer/dashboard')
        }
    } else {
        redirect('/auth/login')
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
