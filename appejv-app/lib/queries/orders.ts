import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Query Keys Factory
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: { status?: string; saleId?: string }) => 
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
}

// Fetch Orders List
export function useOrders(status?: string, saleId?: string) {
  return useQuery({
    queryKey: orderKeys.list({ status, saleId }),
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('orders')
        .select(`
          *,
          customers (id, name, phone),
          profiles!orders_sale_id_fkey (id, full_name)
        `)
        .eq('deleted_at', null)
        .order('created_at', { ascending: false })

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (saleId) {
        query = query.eq('sale_id', saleId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    staleTime: 30 * 1000, // 30 seconds - orders change frequently
  })
}

// Fetch Single Order with Details
export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (*),
          profiles!orders_sale_id_fkey (*),
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id, // Only run if id exists
  })
}

// Update Order Status Mutation
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      status 
    }: { 
      orderId: number
      status: string 
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    // Optimistic update
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() })

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData(orderKeys.lists())

      // Optimistically update all order lists
      queryClient.setQueriesData(
        { queryKey: orderKeys.lists() },
        (old: any) => {
          if (!old) return old
          return old.map((order: any) =>
            order.id === orderId ? { ...order, status } : order
          )
        }
      )

      return { previousOrders }
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.lists(), context.previousOrders)
      }
    },
    // Refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

// Create Order Mutation
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderData: {
      customer_id: number
      sale_id: string
      status: string
      total_amount: number
      items: Array<{
        product_id: number
        quantity: number
        price_at_order: number
      }>
    }) => {
      const supabase = createClient()
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customer_id,
          sale_id: orderData.sale_id,
          status: orderData.status,
          total_amount: orderData.total_amount,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price_at_order,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      return order
    },
    onSuccess: () => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

// Delete Order Mutation (Soft Delete)
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: number) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}
