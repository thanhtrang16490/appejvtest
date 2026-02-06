/**
 * Security Audit Logging
 * Logs security-related events for monitoring and compliance
 */

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

// In production, this should write to a database or logging service
export function logAuditEvent(event: Omit<AuditLog, 'timestamp'>): void {
  const log: AuditLog = {
    timestamp: new Date(),
    ...event
  }
  
  // For development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', JSON.stringify(log, null, 2))
  }
  
  // In production, send to logging service (e.g., Supabase, CloudWatch, etc.)
  // Example: await supabase.from('audit_logs').insert(log)
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
