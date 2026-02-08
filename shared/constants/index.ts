export const BRAND_COLORS = {
  primary: '#175ead',
  secondary: '#2575be',
}

export const ORDER_STATUSES = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  SHIPPING: 'shipping',
  PAID: 'paid',
  COMPLETED: 'completed',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  SALE: 'sale',
  SALE_ADMIN: 'sale_admin',
} as const

export const API_BASE_URL = process.env.API_URL || 'http://localhost:8080'
