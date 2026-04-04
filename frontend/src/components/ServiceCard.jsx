import { Link } from 'react-router';
import { MapPin, Clock } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice, getStarValues } from '@/lib/utils';

// ---------------------------------------------------------------------------
// StarRating
// ---------------------------------------------------------------------------
function StarRating({ rating = 0, total = 0, className }) {
  const stars = getStarValues(rating);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars.map((type, i) => (
          <svg
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              type === 'empty' ? 'text-muted-foreground/30' : 'text-amber-400',
            )}
            viewBox="0 0 24 24"
            fill={
              type === 'empty'
                ? 'none'
                : type === 'half'
                  ? 'url(#half)'
                  : 'currentColor'
            }
            stroke="currentColor"
            strokeWidth={type === 'empty' ? 1.5 : 0}
          >
            {type === 'half' && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {total > 0 && <span className="ml-0.5">({total})</span>}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PriceLabel
// ---------------------------------------------------------------------------
const priceTypeLabel = {
  hourly: '/ hr',
  fixed: '',
  daily: '/ day',
  monthly: '/ mo',
  session: '/ session',
};

function PriceLabel({ price, priceType = 'fixed' }) {
  const suffix = priceTypeLabel[priceType] ?? '';
  return (
    <span className="text-sm font-semibold text-foreground">
      {formatPrice(price)}
      {suffix && (
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">
          {suffix}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ServiceCard  (main export)
// ---------------------------------------------------------------------------
/**
 * Props:
 *   service: {
 *     _id, name, description, imageUrl, price, priceType, currency?,
 *     rating?, total?, city?, category?, availableTime?,
 *     providerName?, providerAvatar?
 *   }
 *   className?
 */
export function ServiceCard({ service, className }) {
  const {
    _id,
    name,
    description,
    imageUrl,
    price,
    priceType = 'fixed',
    currency = 'USD',
    rating = 0,
    total = 0,
    city,
    category,
    availableTime,
    providerName,
  } = service;

  return (
    <Link to={`/services/${_id}`} className="group block focus:outline-none">
      <Card
        className={cn(
          'overflow-hidden border border-border/60 transition-all duration-300',
          'p-0 gap-0',
          'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
          'focus-within:ring-2 focus-within:ring-primary/30',
          className,
        )}
      >
        {/* ---- Thumbnail ---- */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl text-primary/20">✦</span>
            </div>
          )}

          {/* Category badge overlay */}
          {category && (
            <div className="absolute left-2.5 top-2.5">
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm text-xs font-medium"
              >
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* ---- Body ---- */}
        <CardContent className="p-4 pb-2">
          <h3 className="line-clamp-1 font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
            {name}
          </h3>

          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {city && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {city}
              </span>
            )}
            {availableTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {availableTime}
              </span>
            )}
          </div>
        </CardContent>

        {/* ---- Footer ---- */}
        <CardFooter className="flex items-center justify-between px-4 pb-4 pt-2">
          <StarRating rating={rating} total={total} />
          <PriceLabel price={price} priceType={priceType} currency={currency} />
        </CardFooter>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// ServiceCardSkeleton – loading placeholder
// ---------------------------------------------------------------------------
// import { Skeleton } from '@/components/ui/skeleton';

// export function ServiceCardSkeleton() {
//   return (
//     <Card className="overflow-hidden border border-border/60 p-0 gap-0">
//       <Skeleton className="aspect-[4/3] w-full rounded-none" />
//       <CardContent className="p-4 pb-2 space-y-2">
//         <Skeleton className="h-4 w-3/4" />
//         <Skeleton className="h-3 w-full" />
//         <Skeleton className="h-3 w-2/3" />
//         <div className="flex gap-3 pt-1">
//           <Skeleton className="h-3 w-16" />
//           <Skeleton className="h-3 w-20" />
//         </div>
//       </CardContent>
//       <CardFooter className="flex items-center justify-between px-4 pb-4 pt-2">
//         <Skeleton className="h-3.5 w-24" />
//         <Skeleton className="h-4 w-16" />
//       </CardFooter>
//     </Card>
//   );
// }
