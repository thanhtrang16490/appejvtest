import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Query Keys Factory
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
}

// Fetch Categories List
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data || []
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
  })
}
