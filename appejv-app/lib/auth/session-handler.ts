/**
 * Session Handler - Auto logout when user is deleted or unauthorized
 */

import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Check if user session is still valid
 * Returns true if valid, false if user should be logged out
 */
export async function validateUserSession(): Promise<boolean> {
    try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return false
        }

        // Check if profile still exists
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            // Profile deleted - logout user
            await handleDeletedUser()
            return false
        }

        return true
    } catch (error) {
        console.error('Error validating user session:', error)
        return false
    }
}

/**
 * Handle deleted user - logout and redirect
 */
export async function handleDeletedUser() {
    try {
        const supabase = createClient()
        await supabase.auth.signOut()
        
        toast.error('Tài khoản của bạn đã bị xóa hoặc vô hiệu hóa. Vui lòng liên hệ quản trị viên.')
        
        // Redirect to login
        window.location.href = '/auth/login?message=account_deleted'
    } catch (error) {
        console.error('Error handling deleted user:', error)
        // Force redirect anyway
        window.location.href = '/auth/login?message=account_deleted'
    }
}

/**
 * Handle API error responses - auto logout on 401/403
 */
export async function handleApiError(error: any) {
    // Check for unauthorized errors
    if (error?.status === 401 || error?.status === 403) {
        const isValid = await validateUserSession()
        
        if (!isValid) {
            // User was deleted or session invalid
            return
        }
        
        // Session is valid but API returned 401/403
        // This might be a permission issue
        toast.error('Bạn không có quyền truy cập tài nguyên này')
    }
}

/**
 * Wrapper for API calls with auto logout on deleted user
 */
export async function withSessionValidation<T>(
    apiCall: () => Promise<T>
): Promise<T | null> {
    try {
        // Validate session before API call
        const isValid = await validateUserSession()
        
        if (!isValid) {
            return null
        }

        // Execute API call
        return await apiCall()
    } catch (error: any) {
        // Handle API errors
        await handleApiError(error)
        throw error
    }
}
