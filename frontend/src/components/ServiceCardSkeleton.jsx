import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ServiceCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden border border-border/60 p-0 gap-0 shadow-none">
      {/* 1. Thumbnail + Badge Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute left-2.5 top-2.5">
          {/* Matches the 'Yoga & Meditation Studio' badge size */}
          <Skeleton className="h-5 w-28 rounded-full bg-background/50" />
        </div>
      </div>

      <CardContent className="p-4 pb-2">
        {/* 2. Title - Matches line-height of font-semibold */}
        <Skeleton className="h-5 w-3/4 mb-2" />

        {/* 3. Description - Matches line-clamp-2 */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* 4. Meta Row - Simulating Icon + Text */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" /> {/* Map icon */}
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" /> {/* Clock icon */}
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>

      {/* 5. Footer - Matches StarRating and PriceLabel heights */}
      <CardFooter className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-transparent">
        {/* Stars + Rating text */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-20" /> {/* 5 stars */}
          <Skeleton className="h-3 w-6" /> {/* 0.0 text */}
        </div>
        {/* Price */}
        <Skeleton className="h-5 w-14" />
      </CardFooter>
    </Card>
  );
}
