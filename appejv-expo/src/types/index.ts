// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'sale' | 'admin' | 'sale_admin' | 'warehouse'

export interface User {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: UserRole
}

// ─── Customer ────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  full_name?: string
  phone?: string
  email?: string
  address?: string
  assigned_to?: string
  user_id?: string
  created_at: string
  updated_at: string
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  code?: string
  description?: string
  price: number
  stock: number
  category_id?: number
  category?: string
  image_url?: string
  created_at: string
  updated_at: string
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'draft'
  | 'ordered'
  | 'shipping'
  | 'paid'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  customer_id?: string
  customer_name?: string
  sale_id?: string
  total_amount: number
  status: OrderStatus
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  price_at_order?: number
  subtotal: number
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface SalesTeam {
  id: string
  name: string
  manager_id: string
  created_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  sale_id: string
  status: 'active' | 'inactive'
  joined_at: string
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  orderedCount: number
  lowStockCount: number
  customerCount: number
  totalRevenue: number
}

export interface TeamStats {
  teamMembers: number
  teamCustomers: number
  teamOrders: number
  teamRevenue: number
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: 'order' | 'system' | 'alert'
  read: boolean
  data?: Record<string, unknown>
  created_at: string
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  pagination?: PaginationMeta
}
