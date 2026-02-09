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
          avatar_url: string | null
          deleted_at: string | null
          created_at?: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role: 'sale' | 'customer' | 'admin' | 'sale_admin'
          phone?: string | null
          manager_id?: string | null
          avatar_url?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'sale' | 'customer' | 'admin' | 'sale_admin'
          phone?: string | null
          manager_id?: string | null
          avatar_url?: string | null
          deleted_at?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          code: string
          name: string
          slug: string | null
          unit: string | null
          stock: number
          image_url: string | null
          price: number
          category: string | null
          category_id: number | null
          description: string | null
          specifications: string | null
          deleted_at: string | null
          created_at?: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          slug?: string | null
          unit?: string | null
          stock?: number
          image_url?: string | null
          price?: number
          category?: string | null
          category_id?: number | null
          description?: string | null
          specifications?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          slug?: string | null
          unit?: string | null
          stock?: number
          image_url?: string | null
          price?: number
          category?: string | null
          category_id?: number | null
          description?: string | null
          specifications?: string | null
          deleted_at?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          display_order?: number
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
          avatar_url: string | null
          deleted_at: string | null
          created_at?: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          address?: string | null
          phone?: string | null
          assigned_sale?: string | null
          avatar_url?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          address?: string | null
          phone?: string | null
          assigned_sale?: string | null
          avatar_url?: string | null
          deleted_at?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          customer_id: number | null
          sale_id: string | null
          status: 'draft' | 'ordered' | 'shipping' | 'paid' | 'completed' | 'cancelled'
          total_amount: number
          payment_status: 'unpaid' | 'paid'
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: number
          customer_id?: number | null
          sale_id?: string | null
          status?: 'draft' | 'ordered' | 'shipping' | 'paid' | 'completed' | 'cancelled'
          total_amount?: number
          payment_status?: 'unpaid' | 'paid'
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          customer_id?: number | null
          sale_id?: string | null
          status?: 'draft' | 'ordered' | 'shipping' | 'paid' | 'completed' | 'cancelled'
          total_amount?: number
          payment_status?: 'unpaid' | 'paid'
          deleted_at?: string | null
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
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'success' | 'warning' | 'info' | 'error'
          category: 'order' | 'inventory' | 'customer' | 'system'
          title: string
          message: string
          read: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'success' | 'warning' | 'info' | 'error'
          category: 'order' | 'inventory' | 'customer' | 'system'
          title: string
          message: string
          read?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'success' | 'warning' | 'info' | 'error'
          category?: 'order' | 'inventory' | 'customer' | 'system'
          title?: string
          message?: string
          read?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          timestamp: string
          event_type: string
          user_id: string | null
          user_email: string | null
          ip_address: string | null
          user_agent: string | null
          resource: string | null
          action: string | null
          success: boolean
          error_message: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          timestamp?: string
          event_type: string
          user_id?: string | null
          user_email?: string | null
          ip_address?: string | null
          user_agent?: string | null
          resource?: string | null
          action?: string | null
          success?: boolean
          error_message?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          event_type?: string
          user_id?: string | null
          user_email?: string | null
          ip_address?: string | null
          user_agent?: string | null
          resource?: string | null
          action?: string | null
          success?: boolean
          error_message?: string | null
          metadata?: Json
          created_at?: string
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
