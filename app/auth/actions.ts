'use server'

import { revalidatePath } from 'next/cache'
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
        return { error: 'Email hoặc số điện thoại là bắt buộc' }
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    // Return user role for client-side redirect
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profileError || !profile) {
                console.error('Profile query error:', profileError)
                return { success: true, role: 'customer' }
            }

            return { success: true, role: (profile as any).role }
        } else {
            return { error: 'Không tìm thấy thông tin người dùng' }
        }
    } catch (err) {
        console.error('Login error:', err)
        return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
}
