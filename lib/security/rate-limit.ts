/**
 * Rate Limiting Utility
 * Prevents abuse by limiting requests per IP/user
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests allowed in the interval
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const record = store[identifier]

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }

  if (!record || record.resetTime < now) {
    // Create new record or reset expired one
    store[identifier] = {
      count: 1,
      resetTime: now + config.interval
    }
    return true
  }

  if (record.count >= config.maxRequests) {
    return false // Rate limit exceeded
  }

  record.count++
  return true
}

// Predefined rate limit configs
export const RATE_LIMITS = {
  AUTH: { interval: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  API: { interval: 60 * 1000, maxRequests: 60 }, // 60 requests per minute
  STRICT: { interval: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
}
