import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MAX_PRICE } from '@/constants/explore';

export function ActiveFilters({ filters, setFilters }) {
  const chips = [
    filters.q && { key: 'q', label: `Search: ${filters.q}` },
    filters.categorySlug && {
      key: 'category',
      label: `Category: ${filters.categorySlug}`,
    },
    filters.city && { key: 'city', label: `City: ${filters.city}` },
    (filters.minPrice || filters.maxPrice) && {
      key: 'price',
      label: `Price: ₹${filters.minPrice || 0} – ₹${filters.maxPrice || `${MAX_PRICE}+`}`,
    },
  ].filter(Boolean);

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-5">
      <span className="text-xs text-muted-foreground font-medium">Active:</span>
      {chips.map(({ key, label }) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => {
            if (key === 'price') setFilters({ minPrice: '', maxPrice: '' });
            else if (key === 'category')
              setFilters({ category: '', categorySlug: '' });
            else setFilters({ [key]: '' });
          }}
        >
          {label}
          <X className="h-3 w-3 text-muted-foreground" />
        </Badge>
      ))}
    </div>
  );
}
