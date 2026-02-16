/**
 * Analytics Service
 * Centralized analytics tracking cho app
 * 
 * Features:
 * - Event tracking
 * - Screen tracking
 * - User properties
 * - Custom dimensions
 * - Error tracking integration
 */

import { ErrorTracker } from './error-tracking'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

interface UserProperties {
  userId?: string
  email?: string
  role?: string
  [key: string]: any
}

class AnalyticsService {
  private enabled: boolean = true
  private userProperties: UserProperties = {}
  private eventQueue: AnalyticsEvent[] = []

  /**
   * Initialize analytics
   * @param config - Configuration options
   */
  initialize(config?: { enabled?: boolean }) {
    this.enabled = config?.enabled ?? true
    
    if (__DEV__) {
      console.log('📊 Analytics initialized', { enabled: this.enabled })
    }
  }

  /**
   * Track an event
   * @param eventName - Name of the event
   * @param properties - Event properties
   * 
   * @example
   * ```typescript
   * Analytics.trackEvent('product_viewed', {
   *   product_id: '123',
   *   product_name: 'iPhone 15',
   *   price: 999
   * })
   * ```
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        ...this.userProperties,
      },
      timestamp: Date.now(),
    }

    // Queue event
    this.eventQueue.push(event)

    // Log in development
    if (__DEV__) {
      console.log('📊 Event:', eventName, properties)
    }

    // TODO: Send to analytics service (Firebase, Mixpanel, etc.)
    // this.sendToAnalyticsService(event)

    // Limit queue size
    if (this.eventQueue.length > 100) {
      this.eventQueue.shift()
    }
  }

  /**
   * Track screen view
   * @param screenName - Name of the screen
   * @param properties - Additional properties
   * 
   * @example
   * ```typescript
   * Analytics.trackScreen('ProductList', {
   *   category: 'electronics'
   * })
   * ```
   */
  trackScreen(screenName: string, properties?: Record<string, any>) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    })
  }

  /**
   * Set user properties
   * @param properties - User properties
   * 
   * @example
   * ```typescript
   * Analytics.setUserProperties({
   *   userId: '123',
   *   email: 'user@example.com',
   *   role: 'sale'
   * })
   * ```
   */
  setUserProperties(properties: UserProperties) {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    }

    if (__DEV__) {
      console.log('📊 User properties updated:', this.userProperties)
    }

    // TODO: Send to analytics service
  }

  /**
   * Clear user properties (on logout)
   */
  clearUserProperties() {
    this.userProperties = {}

    if (__DEV__) {
      console.log('📊 User properties cleared')
    }
  }

  /**
   * Track user action
   * @param action - Action name
   * @param target - Target of action
   * @param properties - Additional properties
   * 
   * @example
   * ```typescript
   * Analytics.trackAction('click', 'add_to_cart_button', {
   *   product_id: '123'
   * })
   * ```
   */
  trackAction(action: string, target: string, properties?: Record<string, any>) {
    this.trackEvent(`${action}_${target}`, properties)
  }

  /**
   * Track error
   * @param error - Error object
   * @param context - Error context
   */
  trackError(error: Error, context?: string) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
    })

    // Also log to error tracker
    ErrorTracker.error(error, context || 'Analytics.trackError')
  }

  /**
   * Track timing
   * @param category - Timing category
   * @param variable - Timing variable
   * @param duration - Duration in milliseconds
   * 
   * @example
   * ```typescript
   * Analytics.trackTiming('api', 'fetch_products', 1234)
   * ```
   */
  trackTiming(category: string, variable: string, duration: number) {
    this.trackEvent('timing', {
      category,
      variable,
      duration,
    })
  }

  /**
   * Get event queue (for debugging)
   */
  getEventQueue(): AnalyticsEvent[] {
    return [...this.eventQueue]
  }

  /**
   * Clear event queue
   */
  clearEventQueue() {
    this.eventQueue = []
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled

    if (__DEV__) {
      console.log('📊 Analytics', enabled ? 'enabled' : 'disabled')
    }
  }
}

// Export singleton instance
export const Analytics = new AnalyticsService()

/**
 * Common event names
 */
export const AnalyticsEvents = {
  // Auth
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',

  // Products
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_SEARCHED: 'product_searched',
  PRODUCT_FILTERED: 'product_filtered',

  // Orders
  ORDER_CREATED: 'order_created',
  ORDER_VIEWED: 'order_viewed',
  ORDER_UPDATED: 'order_updated',
  ORDER_CANCELLED: 'order_cancelled',

  // Customers
  CUSTOMER_VIEWED: 'customer_viewed',
  CUSTOMER_CREATED: 'customer_created',
  CUSTOMER_UPDATED: 'customer_updated',

  // Dashboard
  DASHBOARD_VIEWED: 'dashboard_viewed',
  REPORT_VIEWED: 'report_viewed',
  FILTER_APPLIED: 'filter_applied',

  // Actions
  BUTTON_CLICKED: 'button_clicked',
  LINK_CLICKED: 'link_clicked',
  FORM_SUBMITTED: 'form_submitted',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const

/**
 * HOC to track screen views
 * @param Component - Component to wrap
 * @param screenName - Screen name
 * 
 * @example
 * ```typescript
 * export default withAnalytics(ProductList, 'ProductList')
 * ```
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  screenName: string
): React.ComponentType<P> {
  return (props: P) => {
    React.useEffect(() => {
      Analytics.trackScreen(screenName)
    }, [])

    return React.createElement(Component, props)
  }
}
