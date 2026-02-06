/**
 * Security Audit Logging
 * Logs security-related events for monitoring and compliance
 */

import { createClient } from '@/lib/supabase/server'

export enum AuditEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
}

export interface AuditLog {
  timestamp: Date
  eventType: AuditEventType
  userId?: string
  userEmail?: string
  ipAddress?: string
  userAgent?: string
  resource?: string
  action?: string
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

// Save audit log to database
export async function logAuditEvent(event: Omit<AuditLog, 'timestamp'>): Promise<void> {
  const log: AuditLog = {
    timestamp: new Date(),
    ...event
  }
  
  // For development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', JSON.stringify(log, null, 2))
  }
  
  // Save to database
  try {
    const supabase = await createClient()
    
    await (supabase as any).from('audit_logs').insert({
      timestamp: log.timestamp.toISOString(),
      event_type: log.eventType,
      user_id: log.userId || null,
      user_email: log.userEmail || null,
      ip_address: log.ipAddress || null,
      user_agent: log.userAgent || null,
      resource: log.resource || null,
      action: log.action || null,
      success: log.success,
      error_message: log.errorMessage || null,
      metadata: log.metadata || {}
    })
  } catch (error) {
    // Don't throw error to avoid breaking the main flow
    console.error('[AUDIT] Failed to save audit log:', error)
  }
}

// Helper to extract IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Helper to get user agent
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}
