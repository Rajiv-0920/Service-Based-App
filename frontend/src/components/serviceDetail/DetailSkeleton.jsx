import { Skeleton } from '@/components/ui/skeleton';

export function DetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="space-y-2">
            {[100, 95, 88, 70].map((w) => (
              <Skeleton key={w} className="h-4" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </main>
  );
}
