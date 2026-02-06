'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const address = formData.get('address') as string

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Update customer record
    const { error } = await (supabase as any)
        .from('customers')
        .update({
            name,
            address
        })
        .eq('phone', user.phone as string)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/customer/account')
    return { success: true }
}
