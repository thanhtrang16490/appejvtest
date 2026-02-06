export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'sale' | 'customer' | 'admin' | 'sale_admin'
          phone: string | null
          manager_id: string | null
          created_at?: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role: 'sale' | 'customer' | 'admin' | 'sale_admin'
          phone?: string | null
          manager_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'sale' | 'customer' | 'admin' | 'sale_admin'
          phone?: string | null
          manager_id?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          code: string
          name: string
          unit: string | null
          stock: number
          image_url: string | null
          price: number
          category: string | null // Added field
          created_at?: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          unit?: string | null
          stock?: number
          image_url?: string | null
          price?: number
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          unit?: string | null
          stock?: number
          image_url?: string | null
          price?: number
          category?: string | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: number
          code: string
          name: string
          address: string | null
          phone: string | null
          assigned_sale: string | null
          created_at?: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          address?: string | null
          phone?: string | null
          assigned_sale?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          address?: string | null
          phone?: string | null
          assigned_sale?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          customer_id: number | null
          sale_id: string | null
          status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
          total_amount: number
          payment_status: 'unpaid' | 'paid'
          created_at: string
        }
        Insert: {
          id?: number
          customer_id?: number | null
          sale_id?: string | null
          status?: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
          total_amount?: number
          payment_status?: 'unpaid' | 'paid'
          created_at?: string
        }
        Update: {
          id?: number
          customer_id?: number | null
          sale_id?: string | null
          status?: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
          total_amount?: number
          payment_status?: 'unpaid' | 'paid'
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          quantity: number
          price_at_order: number
        }
        Insert: {
          id?: number
          order_id: number
          product_id: number
          quantity: number
          price_at_order: number
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          price_at_order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
