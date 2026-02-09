import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi, OrdersQuery, CreateOrderData, UpdateOrderData } from '@/lib/api'

export function useOrders(query?: OrdersQuery) {
  return useQuery({
    queryKey: ['orders', query],
    queryFn: async () => {
      return ordersApi.getAll(query || {})
    },
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      return ordersApi.getById(id)
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      return ordersApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateOrderData }) => {
      return ordersApi.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return ordersApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
