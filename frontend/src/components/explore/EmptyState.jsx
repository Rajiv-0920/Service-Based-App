import { useNavigate } from 'react-router';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({ query }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <PackageSearch className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        No services found
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        {query
          ? `We couldn't find anything for "${query}". Try a different search or remove filters.`
          : 'No services match your current filters. Try adjusting them.'}
      </p>
      <Button className="mt-6" onClick={() => navigate('/explore')}>
        Clear all filters
      </Button>
    </div>
  );
}
