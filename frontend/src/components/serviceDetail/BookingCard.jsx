import { MapPin, Clock, Star, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

export function BookingCard({ service }) {
  const {
    price,
    currency = 'INR',
    priceType = 'fixed',
    avgRating: rating = 0,
    totalReviews: reviewCount = 0,
    city,
    availableTime,
  } = service;

  const priceTypeSuffix =
    {
      hourly: '/ hour',
      fixed: '',
      daily: '/ day',
      monthly: '/ month',
      session: '/ session',
    }[priceType] ?? '';

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/2 pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">
            {formatPrice(price, currency)}
            {priceTypeSuffix && (
              <span className="ml-1.5 text-base font-normal text-muted-foreground">
                {priceTypeSuffix}
              </span>
            )}
          </CardTitle>
          {rating > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)} · {reviewCount} reviews
            </div>
          )}
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="space-y-2.5 text-sm">
            {city && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Location
                </span>
                <span className="font-medium text-foreground">{city}</span>
              </div>
            )}
            {availableTime && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Hours
                </span>
                <span className="font-medium text-foreground">
                  {availableTime.from} - {availableTime.to}
                </span>
              </div>
            )}
          </div>

          <Separator />

          <Button
            className="w-full h-11 text-base font-semibold gap-2"
            size="lg"
          >
            <Calendar className="h-4 w-4" /> Book Now
          </Button>

          <Button variant="outline" className="w-full h-10 gap-2">
            Contact Provider
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            <Shield className="inline h-3 w-3 mr-0.5 align-text-bottom" />
            Free cancellation · No upfront charge
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
