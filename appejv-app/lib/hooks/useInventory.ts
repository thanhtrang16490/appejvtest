import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi, AdjustInventoryData } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

export function useInventory() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return inventoryApi.getAll(session.access_token)
    },
  })
}

export function useLowStock(threshold: number = 10) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['inventory', 'low-stock', threshold],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return inventoryApi.getLowStock(threshold, session.access_token)
    },
  })
}

export function useAdjustInventory() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: AdjustInventoryData) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }
      return inventoryApi.adjust(data, session.access_token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
