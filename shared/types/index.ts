export interface Order {
  id: number
  customer_id: number
  sale_id: string
  status: 'draft' | 'ordered' | 'shipping' | 'paid' | 'completed'
  total_amount: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  phone: string
  address: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  code: string
  price: number
  stock: number
  category_id: number
  image_url?: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'sale' | 'sale_admin'
}
