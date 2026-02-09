import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { setSecurityHeaders } from '@/lib/security/headers'
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit'
import { logAuditEvent, AuditEventType, getClientIP, getUserAgent } from '@/lib/security/audit'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Add pathname to headers for layout to check
    response.headers.set('x-pathname', request.nextUrl.pathname)

    // Apply security headers
    response = setSecurityHeaders(response)

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Check if user exists but profile is deleted
    if (user) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .single()

        // If profile doesn't exist or error fetching it, user was deleted
        if (!profile || profileError) {
            // Log the deleted user access attempt
            logAuditEvent({
                eventType: AuditEventType.UNAUTHORIZED_ACCESS,
                userId: user.id,
                userEmail: user.email,
                ipAddress: getClientIP(request),
                userAgent: getUserAgent(request),
                resource: request.nextUrl.pathname,
                success: false,
                errorMessage: 'User profile deleted or not found',
                metadata: { profileError: profileError?.message }
            })

            // Sign out the user
            await supabase.auth.signOut()

            // Redirect to login with message
            const url = request.nextUrl.clone()
            url.pathname = '/auth/login'
            url.searchParams.set('message', 'account_deleted')
            
            const redirectResponse = NextResponse.redirect(url)
            // Clear all cookies
            redirectResponse.cookies.delete('sb-access-token')
            redirectResponse.cookies.delete('sb-refresh-token')
            
            return redirectResponse
        }
    }

    // Rate limiting for authentication routes
    if (request.nextUrl.pathname.startsWith('/auth/')) {
        const clientIP = getClientIP(request)
        const rateLimitKey = `auth:${clientIP}`
        
        if (!rateLimit(rateLimitKey, RATE_LIMITS.AUTH)) {
            logAuditEvent({
                eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
                ipAddress: clientIP,
                userAgent: getUserAgent(request),
                resource: request.nextUrl.pathname,
                success: false,
                errorMessage: 'Rate limit exceeded for authentication'
            })
            
            return new NextResponse('Too many requests. Please try again later.', {
                status: 429,
                headers: response.headers
            })
        }
    }

    // Protected Routes needing Auth
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/customer') ||
        request.nextUrl.pathname.startsWith('/sales')

    if (isProtectedRoute && !user) {
        // Log unauthorized access attempt
        logAuditEvent({
            eventType: AuditEventType.UNAUTHORIZED_ACCESS,
            ipAddress: getClientIP(request),
            userAgent: getUserAgent(request),
            resource: request.nextUrl.pathname,
            success: false,
            errorMessage: 'Attempted to access protected route without authentication'
        })

        const url = request.nextUrl.clone()
        // Redirect to unified login page
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    // Role-based verification for sales routes
    if (user && request.nextUrl.pathname.startsWith('/sales')) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        const role = profile?.role
        
        if (role !== 'sale' && role !== 'admin' && role !== 'sale_admin') {
            // Log unauthorized role access
            logAuditEvent({
                eventType: AuditEventType.UNAUTHORIZED_ACCESS,
                userId: user.id,
                userEmail: user.email,
                ipAddress: getClientIP(request),
                userAgent: getUserAgent(request),
                resource: request.nextUrl.pathname,
                success: false,
                errorMessage: `User with role '${role}' attempted to access sales route`,
                metadata: { attemptedRole: role }
            })

            const url = request.nextUrl.clone()
            url.pathname = '/customer/dashboard'
            return NextResponse.redirect(url)
        }

        // Log successful access to sensitive routes
        if (request.method !== 'GET') {
            logAuditEvent({
                eventType: AuditEventType.DATA_MODIFICATION,
                userId: user.id,
                userEmail: user.email,
                ipAddress: getClientIP(request),
                userAgent: getUserAgent(request),
                resource: request.nextUrl.pathname,
                action: request.method,
                success: true,
                metadata: { role }
            })
        }
    }

    return response
}
