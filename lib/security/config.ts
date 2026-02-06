/**
 * Security Configuration
 * Centralized security settings and environment validation
 */

// Validate required environment variables
export function validateEnvironment(): void {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    console.warn('⚠️  Supabase URL should use HTTPS in production')
  }
}

// Security configuration
export const SECURITY_CONFIG = {
  // Session settings
  SESSION: {
    MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
    IDLE_TIMEOUT: 30 * 60, // 30 minutes in seconds
  },

  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },

  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
  },

  // Rate limiting
  RATE_LIMIT: {
    ENABLED: true,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },

  // CORS settings
  CORS: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  },

  // Audit logging
  AUDIT: {
    ENABLED: true,
    LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
}

// Check if running in production
export const isProduction = process.env.NODE_ENV === 'production'

// Check if running in development
export const isDevelopment = process.env.NODE_ENV === 'development'

// Validate environment on module load
if (typeof window === 'undefined') {
  // Only validate on server-side
  try {
    validateEnvironment()
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    if (isProduction) {
      process.exit(1)
    }
  }
}
