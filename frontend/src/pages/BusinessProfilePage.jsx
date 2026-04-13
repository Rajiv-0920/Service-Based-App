import { useState } from 'react';
import { Link } from 'react-router';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Pencil,
  AlertTriangle,
  CalendarDays,
  Package,
  BookOpen,
  ChevronRight,
  Upload,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  useGetBusinessProfileQuery,
  useUpdateBusinessProfileMutation,
} from '../services/businessApi';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatAddress({ street, city, state, pincode } = {}) {
  return [street, city, state, pincode].filter(Boolean).join(', ') || '—';
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ isApproved, isSuspended }) {
  if (isSuspended)
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-destructive/30 bg-destructive/10 text-destructive text-[11px] px-2 py-0.5"
      >
        <XCircle className="h-3 w-3" /> Suspended
      </Badge>
    );
  if (isApproved)
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-emerald-200 bg-emerald-100/80 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 shadow-sm"
      >
        <CheckCircle2 className="h-3 w-3 stroke-[3px]" />
        Approved
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-amber-200 bg-amber-100/50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5"
    >
      <Clock className="h-3 w-3 stroke-[2.5px]" />
      Pending Approval
    </Badge>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ avg = 0 }) {
  const full = Math.floor(avg);
  const half = avg - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= full
              ? 'fill-amber-400 text-amber-400'
              : i === full + 1 && half
                ? 'fill-amber-200 text-amber-400'
                : 'fill-muted text-muted-foreground/25'
          }`}
        />
      ))}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
      <Pulse className="h-32 rounded-2xl" />
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <div className="flex gap-4">
          <Pulse className="h-16 w-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Pulse className="h-5 w-40" />
            <Pulse className="h-4 w-24" />
          </div>
        </div>
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-2/3" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Pulse key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Banners ───────────────────────────────────────────────────────────────────

function PendingBanner() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50/40 px-5 py-4 shadow-sm">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-amber-200 shadow-sm">
        <Clock className="h-5 w-5 text-amber-600 stroke-[2.5px]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-amber-950 font-sans tracking-tight">
          Awaiting Admin Approval
        </h3>
        <p className="text-[12px] text-amber-900/80 font-sans leading-relaxed">
          Your profile is currently under review. Your services will be
          <span className="mx-1 font-semibold text-amber-950 underline decoration-amber-300 underline-offset-4">
            hidden from customers
          </span>
          until verified—usually within 24–48 hours.
        </p>
      </div>
    </div>
  );
}

function SuspendedBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3.5">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15">
        <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-semibold text-destructive font-sans">
          Account suspended
        </p>
        <p className="text-xs text-destructive/70 font-sans mt-0.5 leading-relaxed">
          Your business has been suspended. Please contact support to resolve
          this.
        </p>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, iconClass }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 hover:border-border/80 transition-colors">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-2xl font-bold font-display tracking-tight text-foreground leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
            {sub}
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-sans">{label}</p>
    </div>
  );
}

// ── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3.5 py-3.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 font-sans mb-0.5">
          {label}
        </p>
        <p className="text-sm text-foreground font-sans break-words leading-snug">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

// ── Action Card ───────────────────────────────────────────────────────────────

function ActionCard({ icon: Icon, label, description, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground font-sans">{label}</p>
        <p className="text-xs text-muted-foreground font-sans">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
    </Link>
  );
}

// ── Field Group ───────────────────────────────────────────────────────────────

function FieldGroup({ label, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans">
        {label}
      </p>
      {children}
    </div>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium text-foreground/80 font-sans"
      >
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] text-destructive font-sans">{error}</p>
      )}
    </div>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────

function EditProfileModal({ open, onOpenChange, biz }) {
  const [updateProfile, { isLoading }] = useUpdateBusinessProfileMutation();

  const [form, setForm] = useState({
    businessName: biz.businessName ?? '',
    email: biz.email ?? '',
    phone: biz.phone ?? '',
    logo: biz.logo ?? '',
    description: biz.description ?? '',
    street: biz.address?.street ?? '',
    city: biz.address?.city ?? '',
    state: biz.address?.state ?? '',
    pincode: biz.address?.pincode ?? '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.businessName.trim())
      e.businessName = 'Business name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setServerError('');
    try {
      await updateProfile({
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        logo: form.logo,
        description: form.description,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      }).unwrap();
      onOpenChange(false);
    } catch (err) {
      setServerError(
        err?.data?.message ?? 'Failed to update profile. Please try again.',
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto font-sans p-0 gap-0"
        style={{ boxShadow: '0 8px 48px -8px hsl(var(--primary) / 0.18)' }}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Pencil className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-display tracking-tight text-foreground">
                Edit Business Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                Changes will be visible to customers after saving.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3.5 py-3">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive font-sans">
                {serverError}
              </p>
            </div>
          )}

          {/* Basic info */}
          <FieldGroup label="Basic Information">
            <Field
              id="businessName"
              label="Business Name"
              error={errors.businessName}
            >
              <Input
                id="businessName"
                placeholder="e.g. Sunrise Salon"
                value={form.businessName}
                onChange={set('businessName')}
                className={`h-9 text-sm font-sans ${errors.businessName ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
              />
            </Field>

            <Field id="description" label="Description">
              <Textarea
                id="description"
                placeholder="Tell customers what makes your business special…"
                value={form.description}
                onChange={set('description')}
                className="text-sm font-sans resize-none min-h-[88px]"
                rows={3}
              />
            </Field>

            <Field id="logo" label="Logo URL">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 overflow-hidden">
                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt="logo preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  value={form.logo}
                  onChange={set('logo')}
                  className="h-9 text-sm font-sans flex-1"
                />
              </div>
            </Field>
          </FieldGroup>

          <Separator />

          {/* Contact */}
          <FieldGroup label="Contact Details">
            <div className="grid grid-cols-2 gap-3">
              <Field id="email" label="Email" error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@business.com"
                  value={form.email}
                  onChange={set('email')}
                  className={`h-9 text-sm font-sans ${errors.email ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                />
              </Field>
              <Field id="phone" label="Phone" error={errors.phone}>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={set('phone')}
                  className={`h-9 text-sm font-sans ${errors.phone ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                />
              </Field>
            </div>
          </FieldGroup>

          <Separator />

          {/* Address */}
          <FieldGroup label="Address">
            <Field id="street" label="Street">
              <Input
                id="street"
                placeholder="123 Main Street"
                value={form.street}
                onChange={set('street')}
                className="h-9 text-sm font-sans"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field id="city" label="City">
                <Input
                  id="city"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={set('city')}
                  className="h-9 text-sm font-sans"
                />
              </Field>
              <Field id="state" label="State">
                <Input
                  id="state"
                  placeholder="Maharashtra"
                  value={form.state}
                  onChange={set('state')}
                  className="h-9 text-sm font-sans"
                />
              </Field>
            </div>
            <Field id="pincode" label="Pincode">
              <Input
                id="pincode"
                placeholder="400001"
                value={form.pincode}
                onChange={set('pincode')}
                className="h-9 text-sm font-sans w-36"
                maxLength={6}
              />
            </Field>
          </FieldGroup>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="font-sans"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 font-sans min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BusinessProfilePage() {
  const { data: biz, isLoading, isError, error } = useGetBusinessProfileQuery();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <ProfileSkeleton />;

  if (isError)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-7 w-7 text-destructive/60" />
        </div>
        <div>
          <p className="font-semibold text-foreground font-display">
            Something went wrong
          </p>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            {error?.data?.message ?? 'Failed to load business profile.'}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/business/setup">Complete setup</Link>
        </Button>
      </div>
    );

  const {
    businessName,
    email,
    phone,
    logo,
    description,
    address,
    isApproved,
    isSuspended,
    avgRating,
    totalReviews,
    createdAt,
  } = biz;

  const hasReviews = totalReviews > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-3 font-sans">
      {/* ── Edit Modal ── */}
      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} biz={biz} />

      {/* ── Banners ── */}
      {isSuspended && <SuspendedBanner />}
      {!isApproved && !isSuspended && <PendingBanner />}

      {/* ── Hero card ── */}
      <div
        className="rounded-2xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: '0 2px 24px -4px hsl(var(--primary) / 0.08)' }}
      >
        {/* Cover strip */}
        <div
          className="h-20 w-full"
          style={{
            background: `linear-gradient(135deg,
              hsl(var(--primary) / 0.15) 0%,
              hsl(var(--primary) / 0.05) 50%,
              hsl(var(--primary) / 0.10) 100%)`,
          }}
        >
          <div
            className="h-full w-full opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-8 mb-4">
            <Avatar className="h-16 w-16 border-4 border-card rounded-xl shadow-sm">
              <AvatarImage src={logo} alt={businessName} />
              <AvatarFallback
                className="rounded-xl text-lg font-bold"
                style={{
                  background: 'hsl(var(--primary) / 0.15)',
                  color: 'hsl(var(--primary))',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {getInitials(businessName)}
              </AvatarFallback>
            </Avatar>

            {/* ← now opens the modal instead of navigating */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 mb-1"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </Button>
          </div>

          {/* Name + status */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
                {businessName}
              </h1>
              <StatusBadge isApproved={isApproved} isSuspended={isSuspended} />
            </div>

            {hasReviews ? (
              <div className="flex items-center gap-2">
                <StarRating avg={avgRating} />
                <span className="text-sm font-semibold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No reviews yet · Be the first to get one
              </p>
            )}

            {description ? (
              <>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </>
            ) : (
              <>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground/50 italic">
                  No description added yet.{' '}
                  <button
                    onClick={() => setEditOpen(true)}
                    className="text-primary not-italic hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Add one
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Avg rating"
          value={hasReviews ? avgRating.toFixed(1) : '—'}
          sub={hasReviews ? 'out of 5.0' : 'no reviews yet'}
          icon={Star}
          iconClass="bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Total reviews"
          value={totalReviews ?? 0}
          sub={totalReviews === 1 ? 'customer review' : 'customer reviews'}
          icon={MessageSquare}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Member since"
          value={new Date(createdAt).getFullYear()}
          sub={formatDate(createdAt).split(' ').slice(1).join(' ')}
          icon={CalendarDays}
          iconClass="bg-secondary text-muted-foreground"
        />
      </div>

      {/* ── Contact details ── */}
      <div
        className="rounded-2xl border border-border bg-card px-5 divide-y divide-border/60"
        style={{ boxShadow: '0 1px 8px hsl(var(--primary) / 0.04)' }}
      >
        <InfoRow icon={Mail} label="Email" value={email} />
        <InfoRow icon={Phone} label="Phone" value={phone} />
        <InfoRow icon={MapPin} label="Address" value={formatAddress(address)} />
        <InfoRow
          icon={CalendarDays}
          label="Listed since"
          value={formatDate(createdAt)}
        />
      </div>

      {/* ── Quick actions ── */}
      <div className="space-y-2 pt-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">
          Manage
        </p>
        <ActionCard
          icon={Package}
          label="Add a new service"
          description="List a new service for customers to discover"
          to="/business/services/new"
        />
        <ActionCard
          icon={Building2}
          label="Manage services"
          description="Edit, pause or remove existing services"
          to="/business/services"
        />
        <ActionCard
          icon={BookOpen}
          label="View bookings"
          description="See all incoming and past bookings"
          to="/business/bookings"
        />
      </div>
    </div>
  );
}
