import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TableSkeletonProps {
  title?: string;
  description?: string;
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ 
  title = "Loading...", 
  description = "Please wait while we load the data", 
  rows = 5, 
  columns = 6 
}: TableSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search bar skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          {/* Table skeleton */}
          <div className="rounded-md border">
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, i) => (
                  <Skeleton key={i} className="h-4 flex-1" />
                ))}
              </div>
            </div>
            
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="border-b p-4 last:border-b-0">
                <div className="flex space-x-4">
                  {Array.from({ length: columns }).map((_, j) => (
                    <Skeleton key={j} className="h-4 flex-1" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}