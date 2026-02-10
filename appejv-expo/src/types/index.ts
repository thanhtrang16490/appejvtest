export interface User {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: 'customer' | 'sale' | 'admin' | 'sale_admin'
}

export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  customer_name?: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  items: OrderItem[]
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
  subtotal: number
}
