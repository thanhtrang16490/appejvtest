import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Handle errors from Supabase
    if (error) {
        console.error('Auth callback error:', error, errorDescription)
        
        // Redirect to login with error
        return NextResponse.redirect(
            `${requestUrl.origin}/auth/login?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`
        )
    }

    if (code) {
        const supabase = await createClient()

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            return NextResponse.redirect(
                `${requestUrl.origin}/auth/login?error=exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`
            )
        }

        // Get user session to determine redirect
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
            // Check if this is a password reset flow
            const next = requestUrl.searchParams.get('next')
            
            if (next === 'reset-password' || requestUrl.searchParams.get('type') === 'recovery') {
                // Redirect to reset password page
                return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`)
            }

            // Get user role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            // Redirect based on role
            if (profile) {
                const userRole = (profile as { role: string }).role
                if (userRole === 'sale' || userRole === 'admin' || userRole === 'sale_admin') {
                    return NextResponse.redirect(`${requestUrl.origin}/sales`)
                } else {
                    return NextResponse.redirect(`${requestUrl.origin}/customer/dashboard`)
                }
            }
        }
    }

    // Default redirect to login
    return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
