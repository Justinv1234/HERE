import { Skeleton } from "@/components/ui/skeleton"
import { AppLayout } from "@/components/layout/app-layout"

export default function Loading() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Skeleton className="h-32 w-full mb-8" />

      <div className="mt-8">
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    </AppLayout>
  )
}
