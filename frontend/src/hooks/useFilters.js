import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

/**
 * useFilters – reads & writes filter state via URL search params.
 *
 * Keeps pages bookmarkable and shareable without extra Redux slices.
 *
 * Returned `filters` object is safe to pass directly to `useGetServicesQuery`.
 */
export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    city: searchParams.get('city') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    page: Number(searchParams.get('page') ?? '1'),
  };

  /** Merge new values into the existing params and reset page to 1
   *  unless the caller explicitly sets `page`. */
  const setFilters = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === '' || value === null || value === undefined) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });

        // Reset to page 1 whenever anything except page itself changes
        if (!('page' in updates)) next.set('page', '1');

        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(
    () => setSearchParams({}),
    [setSearchParams],
  );

  return { filters, setFilters, clearFilters };
}
