import { useParams, Link } from 'react-router';
import { Share2, Heart, MapPin, Clock, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import {
  useGetServiceByIdQuery,
  useGetServicesQuery,
} from '@/services/servicesApi';
import { ServiceCard } from '@/components/ServiceCard';
import { StarRating } from '@/components/serviceDetail/StarRating';
import { BookingCard } from '@/components/serviceDetail/BookingCard';
import { DetailSkeleton } from '@/components/serviceDetail/DetailSkeleton';

export default function ServiceDetailPage() {
  const { id } = useParams();

  const { data: serviceData, isLoading, isError } = useGetServiceByIdQuery(id);
  const service = serviceData?.data;

  // Related services (same category, exclude current)
  const { data: relatedData } = useGetServicesQuery(
    { category: service?.category?._id, limit: 4 },
    { skip: !service?.category?._id },
  );

  const related = (relatedData?.data ?? []).filter((s) => s._id !== id);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !service) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <Button asChild className="mt-6">
          <Link to="/explore">Browse services</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/explore" className="hover:text-foreground">
          Explore
        </Link>
        {service.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to={`/explore?category=${service.category.slug}`}
              className="hover:text-foreground"
            >
              {service.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* LEFT: Content */}
        <div className="space-y-8 min-w-0">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            {service.images?.[0] ? (
              <img
                src={service.images[0]}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-primary/10">
                ✦
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold sm:text-3xl">{service.name}</h1>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <StarRating
                rating={service.avgRating}
                reviewCount={service.totalReviews}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {service.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {service.city}
                </span>
              )}
              {service.business?.businessName && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {service.business.businessName}
                </span>
              )}
            </div>
          </div>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold mb-3">About this service</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {service.description || 'No description provided.'}
            </div>
          </section>
        </div>

        {/* RIGHT: Booking */}
        <BookingCard service={service} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-6">Similar services</h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
