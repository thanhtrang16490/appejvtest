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
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Try to get profile with timeout
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            // If profile query fails or no profile, redirect to customer dashboard as default
            if (profileError || !profile) {
                console.error('Profile query error:', profileError)
                redirect('/customer/dashboard')
            }

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
    } catch (err) {
        console.error('Login redirect error:', err)
        // Default to customer dashboard if anything fails
        redirect('/customer/dashboard')
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
