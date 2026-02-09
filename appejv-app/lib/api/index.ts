/**
 * API Services Index
 * Export all API services for easy import
 */

export * from './client'
export * from './auth'
export * from './products'
export * from './customers'
export * from './orders'
export * from './inventory'
export * from './reports'

// Re-export for convenience
export { authApi } from './auth'
export { productsApi } from './products'
export { customersApi } from './customers'
export { ordersApi } from './orders'
export { inventoryApi } from './inventory'
export { reportsApi } from './reports'
