# React Query Setup Guide

React Query provides powerful data fetching, caching, and state management for your app.

## Benefits

- ✅ Automatic caching and background refetching
- ✅ Optimistic updates
- ✅ Reduced prop drilling
- ✅ Better loading and error states
- ✅ Automatic retry on failure
- ✅ Pagination and infinite scroll support

---

## Installation

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

---

## Setup

### 1. Create Query Client Provider

Create `lib/providers/query-provider.tsx`:

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 2. Wrap App with Provider

Update `app/layout.tsx`:

```tsx
import { QueryProvider } from '@/lib/providers/query-provider'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
```

---

## Usage Examples

### Example 1: Fetch Orders

Create `lib/queries/orders.ts`:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
}

// Fetch Orders
export function useOrders(status?: string, saleId?: string) {
  return useQuery({
    queryKey: orderKeys.list(status || 'all'),
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('orders')
        .select(`
          *,
          customers (name),
          profiles!orders_sale_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false })

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (saleId) {
        query = query.eq('sale_id', saleId)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

// Fetch Single Order
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
  })
}

// Update Order Status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
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
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}
```

### Example 2: Use in Component

Update `app/sales/orders/page.tsx`:

```tsx
'use client'

import { useOrders, useUpdateOrderStatus } from '@/lib/queries/orders'
import { OrdersLoading } from '@/components/loading/OrdersLoading'
import { toast } from 'sonner'

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { data: orders, isLoading, error } = useOrders(activeTab)
  const updateStatus = useUpdateOrderStatus()

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus })
      toast.success('Cập nhật trạng thái thành công')
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  if (isLoading) return <OrdersLoading />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {/* Render orders */}
      {orders?.map(order => (
        <OrderCard 
          key={order.id} 
          order={order}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  )
}
```

---

## Advanced Features

### Optimistic Updates

```tsx
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }) => {
      // API call
    },
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() })

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData(orderKeys.lists())

      // Optimistically update
      queryClient.setQueryData(orderKeys.lists(), (old: any) => {
        return old?.map((order: any) =>
          order.id === orderId ? { ...order, status } : order
        )
      })

      return { previousOrders }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(orderKeys.lists(), context?.previousOrders)
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}
```

### Pagination

```tsx
export function useOrdersPaginated(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: [...orderKeys.lists(), { page, pageSize }],
    queryFn: async () => {
      const supabase = createClient()
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, count }
    },
    keepPreviousData: true, // Keep old data while fetching new
  })
}
```

### Infinite Scroll

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

export function useOrdersInfinite(pageSize: number = 20) {
  return useInfiniteQuery({
    queryKey: [...orderKeys.lists(), 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const supabase = createClient()
      const from = pageParam * pageSize
      const to = from + pageSize - 1

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
  })
}
```

---

## Migration Strategy

### Phase 1: Setup (Week 1)
1. Install React Query
2. Add QueryProvider to layout
3. Test with DevTools

### Phase 2: Migrate Orders (Week 2)
1. Create `lib/queries/orders.ts`
2. Migrate `/sales/orders` page
3. Migrate `/sales/orders/[id]` page
4. Test thoroughly

### Phase 3: Migrate Other Pages (Week 3-4)
1. Customers queries
2. Products/Inventory queries
3. Reports queries
4. User management queries

### Phase 4: Advanced Features (Week 5+)
1. Implement optimistic updates
2. Add pagination where needed
3. Implement infinite scroll for long lists
4. Add prefetching for better UX

---

## Best Practices

### 1. Query Key Structure
```tsx
// Good - hierarchical structure
const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), filters],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
}

// Bad - flat structure
const orderKeys = {
  all: ['orders'],
  filtered: ['orders', 'filtered'],
  detail: (id) => ['order', id],
}
```

### 2. Error Handling
```tsx
const { data, error, isLoading } = useOrders()

if (error) {
  return <ErrorMessage error={error} />
}
```

### 3. Loading States
```tsx
if (isLoading) return <OrdersLoading />
if (isFetching && !isLoading) {
  // Show subtle loading indicator
  return <RefreshIndicator />
}
```

### 4. Stale Time Configuration
```tsx
// Frequently changing data
staleTime: 30 * 1000 // 30 seconds

// Rarely changing data
staleTime: 5 * 60 * 1000 // 5 minutes

// Static data
staleTime: Infinity
```

---

## Performance Tips

1. **Use `select` to transform data**
   ```tsx
   useQuery({
     queryKey: ['orders'],
     queryFn: fetchOrders,
     select: (data) => data.filter(order => order.status === 'active')
   })
   ```

2. **Prefetch on hover**
   ```tsx
   const queryClient = useQueryClient()
   
   const handleMouseEnter = (orderId: number) => {
     queryClient.prefetchQuery({
       queryKey: orderKeys.detail(orderId),
       queryFn: () => fetchOrder(orderId)
     })
   }
   ```

3. **Disable refetch when not needed**
   ```tsx
   useQuery({
     queryKey: ['static-data'],
     queryFn: fetchStaticData,
     refetchOnMount: false,
     refetchOnWindowFocus: false,
   })
   ```

---

## Troubleshooting

### Issue: Data not updating
**Solution**: Check if you're invalidating the correct query keys

### Issue: Too many refetches
**Solution**: Increase `staleTime` or disable `refetchOnWindowFocus`

### Issue: Memory leaks
**Solution**: Reduce `gcTime` (formerly `cacheTime`)

---

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Key Factory Pattern](https://tkdodo.eu/blog/effective-react-query-keys)

---

**Status**: Ready to implement  
**Priority**: High (significant UX improvement)  
**Estimated Time**: 2-4 weeks for full migration
