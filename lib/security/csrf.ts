/**
 * CSRF Protection
 * Prevents Cross-Site Request Forgery attacks
 */

import { randomBytes } from 'crypto'

// Generate CSRF token
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

// Verify CSRF token
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false
  }
  
  // Use constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i)
  }
  
  return result === 0
}

// CSRF token cookie name
export const CSRF_TOKEN_COOKIE = 'csrf_token'
export const CSRF_TOKEN_HEADER = 'x-csrf-token'
