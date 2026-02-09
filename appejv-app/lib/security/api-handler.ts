/**
 * Secure API Route Handler
 * Wrapper for API routes with built-in security features
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, RATE_LIMITS } from './rate-limit'
import { logAuditEvent, AuditEventType, getClientIP, getUserAgent } from './audit'

export interface SecureAPIOptions {
  requireAuth?: boolean
  allowedRoles?: string[]
  rateLimit?: {
    interval: number
    maxRequests: number
  }
  allowedMethods?: string[]
}

export async function secureAPIHandler(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  options: SecureAPIOptions = {}
) {
  const {
    requireAuth = true,
    allowedRoles = [],
    rateLimit: rateLimitConfig = RATE_LIMITS.API,
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  } = options

  try {
    // Check allowed methods
    if (!allowedMethods.includes(request.method)) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitKey = `api:${clientIP}:${request.nextUrl.pathname}`
    
    if (!rateLimit(rateLimitKey, rateLimitConfig)) {
      logAuditEvent({
        eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
        ipAddress: clientIP,
        userAgent: getUserAgent(request),
        resource: request.nextUrl.pathname,
        action: request.method,
        success: false,
        errorMessage: 'API rate limit exceeded'
      })

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Authentication check
    if (requireAuth) {
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        logAuditEvent({
          eventType: AuditEventType.UNAUTHORIZED_ACCESS,
          ipAddress: clientIP,
          userAgent: getUserAgent(request),
          resource: request.nextUrl.pathname,
          action: request.method,
          success: false,
          errorMessage: 'Unauthorized API access'
        })

        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Role-based access control
      if (allowedRoles.length > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const userRole = (profile as any)?.role

        if (!userRole || !allowedRoles.includes(userRole)) {
          logAuditEvent({
            eventType: AuditEventType.UNAUTHORIZED_ACCESS,
            userId: user.id,
            userEmail: user.email,
            ipAddress: clientIP,
            userAgent: getUserAgent(request),
            resource: request.nextUrl.pathname,
            action: request.method,
            success: false,
            errorMessage: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`,
            metadata: { userRole, requiredRoles: allowedRoles }
          })

          return NextResponse.json(
            { error: 'Forbidden: Insufficient permissions' },
            { status: 403 }
          )
        }
      }

      // Call the actual handler with authenticated user
      return await handler(request, user)
    }

    // Call handler without auth requirement
    return await handler(request, null)

  } catch (error) {
    console.error('API Handler Error:', error)
    
    logAuditEvent({
      eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      resource: request.nextUrl.pathname,
      action: request.method,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      metadata: { error: String(error) }
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
