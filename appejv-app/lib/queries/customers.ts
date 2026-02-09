import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Query Keys Factory
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: { search?: string; saleId?: string }) => 
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
}

// Fetch Customers List
export function useCustomers(search?: string, saleId?: string) {
  return useQuery({
    queryKey: customerKeys.list({ search, saleId }),
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('customers')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true })

      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      if (saleId) {
        query = query.eq('assigned_sale', saleId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - customers don't change often
  })
}

// Fetch Single Customer
export function useCustomer(id: number) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          profiles!customers_assigned_sale_fkey (id, full_name, phone)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// Create Customer Mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (customerData: {
      code: string
      name: string
      address?: string
      phone?: string
      assigned_sale?: string
    }) => {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from('customers')
        .insert(customerData)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

// Update Customer Mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: number
      name?: string
      address?: string
      phone?: string
      assigned_sale?: string
    }) => {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Update cache for this specific customer
      queryClient.setQueryData(customerKeys.detail(data.id), data)
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

// Delete Customer Mutation (Soft Delete)
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (customerId: number) => {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from('customers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', customerId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}
