/**
 * Error Tracking & Monitoring
 * Centralized error handling and logging
 */

interface ErrorContext {
  userId?: string
  screen?: string
  action?: string
  [key: string]: any
}

class ErrorTracker {
  private isInitialized = false
  private isDevelopment = __DEV__

  /**
   * Initialize error tracking service
   * In production, this would initialize Sentry or similar service
   */
  init() {
    if (this.isInitialized) return

    // TODO: Initialize Sentry in production
    // Sentry.init({
    //   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    //   enableAutoSessionTracking: true,
    //   tracesSampleRate: 1.0,
    // })

    this.isInitialized = true
    console.log('Error tracking initialized')
  }

  /**
   * Log an error with context
   */
  logError(error: Error, context?: ErrorContext) {
    if (this.isDevelopment) {
      console.error('Error:', error.message, context)
      console.error('Stack:', error.stack)
    }

    // TODO: Send to Sentry in production
    // Sentry.captureException(error, { extra: context })

    // Store error locally for debugging
    this.storeErrorLocally(error, context)
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: ErrorContext) {
    if (this.isDevelopment) {
      console.warn('Warning:', message, context)
    }

    // TODO: Send to Sentry as breadcrumb
    // Sentry.addBreadcrumb({
    //   message,
    //   level: 'warning',
    //   data: context,
    // })
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: ErrorContext) {
    if (this.isDevelopment) {
      console.log('Info:', message, context)
    }

    // TODO: Send to Sentry as breadcrumb
    // Sentry.addBreadcrumb({
    //   message,
    //   level: 'info',
    //   data: context,
    // })
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, email?: string, role?: string) {
    // TODO: Set user in Sentry
    // Sentry.setUser({ id: userId, email, role })
    
    if (this.isDevelopment) {
      console.log('User context set:', { userId, email, role })
    }
  }

  /**
   * Clear user context
   */
  clearUser() {
    // TODO: Clear user in Sentry
    // Sentry.setUser(null)
    
    if (this.isDevelopment) {
      console.log('User context cleared')
    }
  }

  /**
   * Store error locally for debugging
   */
  private async storeErrorLocally(error: Error, context?: ErrorContext) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        context,
      }

      // Store in AsyncStorage for later review
      // const existingLogs = await AsyncStorage.getItem('error_logs')
      // const logs = existingLogs ? JSON.parse(existingLogs) : []
      // logs.push(errorLog)
      // await AsyncStorage.setItem('error_logs', JSON.stringify(logs.slice(-50))) // Keep last 50 errors
    } catch (e) {
      console.error('Failed to store error locally:', e)
    }
  }

  /**
   * Get stored error logs (for debugging)
   */
  async getErrorLogs() {
    try {
      // const logs = await AsyncStorage.getItem('error_logs')
      // return logs ? JSON.parse(logs) : []
      return []
    } catch (e) {
      console.error('Failed to get error logs:', e)
      return []
    }
  }

  /**
   * Clear stored error logs
   */
  async clearErrorLogs() {
    try {
      // await AsyncStorage.removeItem('error_logs')
      console.log('Error logs cleared')
    } catch (e) {
      console.error('Failed to clear error logs:', e)
    }
  }
}

export const errorTracker = new ErrorTracker()

/**
 * Helper function to wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorTracker.logError(error as Error, context)
      throw error
    }
  }) as T
}

/**
 * Helper function to handle API errors
 */
export function handleApiError(error: any, defaultMessage = 'Có lỗi xảy ra') {
  if (error?.message) {
    return error.message
  }
  
  if (error?.error) {
    return error.error
  }
  
  return defaultMessage
}
