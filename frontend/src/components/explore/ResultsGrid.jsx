import { useGetServicesQuery } from '@/services/servicesApi';
import { ServiceCard } from '@/components/ServiceCard';
import { EmptyState } from './EmptyState';
import { PaginationBar } from './PaginationBar';
import { ServiceCardSkeleton } from '@/components/ServiceCardSkeleton';
import { PAGE_SIZE } from '@/constants/explore';

export function ResultsGrid({ filters }) {
  const { data, isLoading, isError, isFetching } = useGetServicesQuery({
    ...filters,
    category: filters.category || undefined,
    limit: PAGE_SIZE,
  });

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
        Something went wrong. Please try again later.
      </div>
    );
  }

  const services = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const loading = isLoading || isFetching;

  if (!loading && services.length === 0) {
    return <EmptyState query={filters.q} />;
  }

  return (
    <div className="space-y-6">
      {!loading && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{total}</span>{' '}
          result{total !== 1 ? 's' : ''}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))
          : services.map((svc) => {
              // DATA TRANSFORMATION: Flatten objects into strings/primitives
              const serviceForCard = {
                _id: svc._id,
                name: svc.name,
                description: svc.description,
                imageUrl: svc.images?.[0] || svc.logo || '',
                price: svc.price,
                priceType: svc.priceType,
                rating: svc.avgRating,
                total: svc.totalReviews,
                city: svc.city,
                // Ensure this is a string, not the object {_id, name}
                category:
                  typeof svc.category === 'object'
                    ? svc.category?.name
                    : svc.category,
                availableTime:
                  svc.availableTime?.from && svc.availableTime?.to
                    ? `${svc.availableTime.from} - ${svc.availableTime.to}`
                    : null,
              };
              return <ServiceCard key={svc._id} service={serviceForCard} />;
            })}
      </div>

      {!loading && totalPages > 1 && (
        <PaginationBar page={filters.page} totalPages={totalPages} />
      )}
    </div>
  );
}
