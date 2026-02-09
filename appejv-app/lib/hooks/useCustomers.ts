import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi, CustomersQuery, CreateCustomerData, UpdateCustomerData } from '@/lib/api'

export function useCustomers(query?: CustomersQuery) {
  return useQuery({
    queryKey: ['customers', query],
    queryFn: async () => {
      return customersApi.getAll(query || {})
    },
  })
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      return customersApi.getById(id)
    },
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
      return customersApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCustomerData }) => {
      return customersApi.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return customersApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
