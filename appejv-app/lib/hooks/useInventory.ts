import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi, AdjustInventoryData } from '@/lib/api'

export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      return inventoryApi.getAll()
    },
  })
}

export function useLowStock(threshold: number = 10) {
  return useQuery({
    queryKey: ['inventory', 'low-stock', threshold],
    queryFn: async () => {
      return inventoryApi.getLowStock(threshold)
    },
  })
}

export function useAdjustInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AdjustInventoryData) => {
      return inventoryApi.adjust(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
