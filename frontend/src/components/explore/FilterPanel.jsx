import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MAX_PRICE } from '@/constants/explore';
import { useGetAvailableCitiesQuery } from '@/services/servicesApi';

export function FilterPanel({ filters, setFilters, clearFilters, categories }) {
  // Fetch dynamic cities from backend
  const { data: cityResponse, isLoading: citiesLoading } =
    useGetAvailableCitiesQuery();
  const availableCities = cityResponse?.data || [];

  const [localPrice, setLocalPrice] = useState([
    Number(filters.minPrice) || 0,
    Number(filters.maxPrice) || MAX_PRICE,
  ]);

  function applyPrice() {
    setFilters({
      minPrice: localPrice[0] > 0 ? localPrice[0] : '',
      maxPrice: localPrice[1] < MAX_PRICE ? localPrice[1] : '',
    });
  }

  const activeCount = [
    filters.category,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Filters</h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5" /> Clear all ({activeCount})
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(slug) => {
            setFilters({
              category: slug === 'all' ? '' : slug,
              page: 1,
            });
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat._id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic City Select */}
      <div className="space-y-2">
        <label className="text-sm font-medium">City</label>
        <Select
          value={filters.city || 'all'}
          onValueChange={(v) =>
            setFilters({ city: v === 'all' ? '' : v, page: 1 })
          }
          disabled={citiesLoading}
        >
          <SelectTrigger className="h-9">
            <SelectValue
              placeholder={citiesLoading ? 'Loading...' : 'All cities'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {citiesLoading ? (
              <div className="p-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Price range</label>
          <span className="text-xs text-muted-foreground font-mono">
            ₹{localPrice[0]} –{' '}
            {localPrice[1] === MAX_PRICE ? `${MAX_PRICE}+` : localPrice[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={25}
          value={localPrice}
          onValueChange={setLocalPrice}
          onValueCommit={applyPrice}
        />
      </div>
    </div>
  );
}
