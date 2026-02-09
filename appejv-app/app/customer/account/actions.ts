'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const avatar_url = formData.get('avatar_url') as string | null

    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: 'Không tìm thấy thông tin người dùng' }
        }

        // Build update object
        const updates: CustomerUpdate = {
            name,
            address
        }

        if (avatar_url) {
            updates.avatar_url = avatar_url
        }

        const { error } = await (supabase as any)
            .from('customers')
            .update(updates)
            .eq('phone', user.phone as string)

        if (error) {
            console.error('Update error:', error)
            return { error: 'Không thể cập nhật thông tin' }
        }

        revalidatePath('/customer/account')
        revalidatePath('/customer/profile')
        
        return { success: true }
    } catch (error) {
        console.error('Update profile error:', error)
        return { error: 'Có lỗi xảy ra khi cập nhật thông tin' }
    }
}
