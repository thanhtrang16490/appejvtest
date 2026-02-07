import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Query Keys Factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { search?: string; categoryId?: number }) => 
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  lowStock: () => [...productKeys.all, 'lowStock'] as const,
}

// Fetch Products List
export function useProducts(search?: string, categoryId?: number) {
  return useQuery({
    queryKey: productKeys.list({ search, categoryId }),
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('products')
        .select('*, categories(id, name)')
        .is('deleted_at', null)
        .order('name', { ascending: true })

      if (search) {
        query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`)
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - products don't change often
  })
}

// Fetch Low Stock Products
export function useLowStockProducts() {
  return useQuery({
    queryKey: productKeys.lowStock(),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .is('deleted_at', null)
        .lt('stock', 20)
        .order('stock', { ascending: true })

      if (error) throw error
      return data || []
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Fetch Single Product
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// Update Product Stock Mutation
export function useUpdateProductStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      stock,
    }: {
      id: number
      stock: number
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .update({ stock })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Update cache for this specific product
      queryClient.setQueryData(productKeys.detail(data.id), data)
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() })
    },
  })
}

// Update Product Mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: number
      name?: string
      code?: string
      price?: number
      stock?: number
      category_id?: number
      image_url?: string
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(productKeys.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
