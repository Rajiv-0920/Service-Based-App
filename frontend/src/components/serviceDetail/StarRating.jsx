import { getStarValues } from '@/lib/utils';

export function StarRating({ rating, reviewCount }) {
  const stars = getStarValues(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${type === 'empty' ? 'text-muted-foreground/30' : 'text-amber-400'}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="font-semibold text-foreground">
        {rating?.toFixed(1)}
      </span>
      <span className="text-sm text-muted-foreground">
        ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
      </span>
    </div>
  );
}
