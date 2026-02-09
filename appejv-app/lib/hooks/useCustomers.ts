import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi, CustomersQuery, CreateCustomerData, UpdateCustomerData } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

export function useCustomers(query?: CustomersQuery) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['customers', query],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return customersApi.getAll(query || {}, session.access_token)
    },
  })
}

export function useCustomer(id: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return customersApi.getById(id, session.access_token)
    },
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return customersApi.create(data, session.access_token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCustomerData }) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return customersApi.update(id, data, session.access_token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return customersApi.delete(id, session.access_token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
