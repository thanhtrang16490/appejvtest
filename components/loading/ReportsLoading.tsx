import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ReportsLoading() {
  return (
    <div className="space-y-6">
      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Revenue Card Skeleton */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl">
        <CardHeader className="p-6 pb-0">
          <Skeleton className="h-4 w-32 bg-white/20" />
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <Skeleton className="h-10 w-48 bg-white/20" />
          <Skeleton className="h-3 w-40 bg-white/20 mt-2" />
        </CardContent>
      </Card>

      {/* Trend Chart Skeleton */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader className="p-6">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-48 flex items-end gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <Skeleton 
                key={i} 
                className="flex-1" 
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Tables Skeleton */}
      {[1, 2].map((section) => (
        <Card key={section} className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader className="p-6 pb-2">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-24 rounded-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-28" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
