import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function InventoryLoading() {
  return (
    <div className="space-y-4">
      {/* Search and Filter Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader className="p-3">
              <Skeleton className="h-32 w-full rounded-xl" />
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
