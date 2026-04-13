import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useFilters } from '@/hooks/useFilters';
import { useGetCategoriesQuery } from '@/services/servicesApi';

import { FilterPanel } from '@/components/explore/FilterPanel';
import { ActiveFilters } from '@/components/explore/ActiveFilters';
import { ResultsGrid } from '@/components/explore/ResultsGrid';

export default function ExplorePage() {
  const { filters, setFilters, clearFilters } = useFilters();
  const { data: fetchCategories } = useGetCategoriesQuery();
  const [localQuery, setLocalQuery] = useState(filters.q);
  const categories = fetchCategories;

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ q: localQuery.trim() });
  };

  const filterProps = { filters, setFilters, clearFilters, categories };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Explore Services</h1>

      {/* Mobile Search & Filters */}
      <div className="flex gap-2 sm:hidden mb-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search…"
            className="pl-9 h-9"
          />
        </form>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <FilterPanel {...filterProps} />
          </SheetContent>
        </Sheet>
      </div>

      <ActiveFilters filters={filters} setFilters={setFilters} />

      <div className="flex gap-8 mt-5">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-xl border p-5">
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        <section className="flex-1">
          <form
            onSubmit={handleSearch}
            className="relative mb-6 hidden sm:flex"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-9"
              placeholder="Search services..."
            />
          </form>
          <ResultsGrid filters={filters} />
        </section>
      </div>
    </div>
  );
}
