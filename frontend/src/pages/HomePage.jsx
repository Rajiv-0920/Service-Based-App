import { Link, useNavigate } from 'react-router';
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetServicesQuery,
  useGetCategoriesQuery,
} from '@/services/servicesApi';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceCardSkeleton } from '@/components/ServiceCardSkeleton';

const PERKS = [
  { icon: Sparkles, label: 'Vetted Professionals' },
  { icon: Shield, label: 'Secure Payments' },
  { icon: Clock, label: 'On-Time Guarantee' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const {
    data: servicesResponse,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useGetServicesQuery({ limit: 8 });
  const { data: categoriesData = [] } = useGetCategoriesQuery();

  const services = servicesResponse?.data ?? [];
  const categories = categoriesData?.data || [];

  const handleCategory = (catName) => {
    navigate(`/explore?category=${encodeURIComponent(catName)}`);
  };

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-b border-border/40">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <Badge
            variant="outline"
            className="mb-6 text-xs font-medium tracking-wider uppercase"
          >
            ✦ Trusted by 50,000+ customers
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-3xl mx-auto">
            Find the{' '}
            <span className="text-primary relative">
              perfect service
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 300 8"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 6 Q75 2 150 5 Q225 8 298 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-primary/50"
                />
              </svg>
            </span>{' '}
            for any need
          </h1>

          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Connect with skilled professionals in your city — from home repairs
            to tutoring, photography, and more.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link to="/explore">
                Explore Services <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/explore">Browse Categories</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {PERKS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon size={15} className="text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-foreground mb-5">
            Browse by Category
          </h2>

          {/* Mobile: dropdown */}
          <select
            onChange={(e) =>
              e.target.value === 'all'
                ? navigate('/explore')
                : handleCategory(e.target.value)
            }
            className="sm:hidden w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Desktop: horizontal scroll pills */}
          <div
            className="hidden sm:flex overflow-x-auto gap-2 pb-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            <button
              onClick={() => navigate('/explore')}
              className="shrink-0 rounded-full border border-border bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium transition-colors"
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategory(cat.slug)}
                className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Services ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Latest Services
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-sm">
            <Link to="/explore">
              See all <ArrowRight size={13} />
            </Link>
          </Button>
        </div>

        {servicesError ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">
              Failed to load services. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {servicesLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            ) : services.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-12 text-sm">
                No services found yet.
              </p>
            ) : (
              services.map((service) => {
                const serviceForCard = {
                  _id: service._id,
                  name: service.name,
                  description: service.description,
                  imageUrl: service.images?.[0] || service.logo || '',
                  price: service.price,
                  priceType: service.priceType,
                  rating: service.avgRating,
                  total: service.totalReviews,
                  city: service.city,
                  category: service.category?.name,
                  availableTime:
                    service.availableTime?.from && service.availableTime?.to
                      ? `${service.availableTime.from} - ${service.availableTime.to}`
                      : null,
                };
                return (
                  <ServiceCard key={service._id} service={serviceForCard} />
                );
              })
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
