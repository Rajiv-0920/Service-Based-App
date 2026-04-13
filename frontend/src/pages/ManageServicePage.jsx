import { useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  EyeOff,
  Eye,
  Star,
  Clock,
  MapPin,
  Tag,
  PackageX,
  Loader2,
  AlertTriangle,
  X,
  ImageIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useDeleteServiceMutation,
  useToggleServiceListingMutation,
  useGetCategoriesQuery,
  useGetBusinessServicesQuery,
  useUpdateServiceMutation,
} from '../services/servicesApi';
import { selectCurrentBusiness } from '../store/authSlice';

// ── Constants ─────────────────────────────────────────────────────────────────

const PRICE_TYPES = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'hourly', label: 'Per hour' },
  { value: 'per_session', label: 'Per session' },
  { value: 'per_day', label: 'Per day' },
  { value: 'negotiable', label: 'Negotiable' },
];

const SUGGESTED_TAGS = [
  'Relaxation',
  'Pain relief',
  'Anti-stress',
  'Sports',
  'Couples',
  'Prenatal',
  'Kids',
  'Senior',
  'Premium',
  'Quick',
];

const MAX_DESC = 300;

const PRICE_TYPE_CONFIG = {
  fixed: {
    label: 'Fixed',
    class: 'border-primary/30 bg-primary/8 text-primary',
  },
  hourly: {
    label: 'Per hour',
    class:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
  },
  per_session: {
    label: 'Per session',
    class:
      'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400',
  },
  per_day: {
    label: 'Per day',
    class:
      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400',
  },
  negotiable: {
    label: 'Negotiable',
    class: 'border-border bg-muted/50 text-muted-foreground',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatPrice = (price, priceType) => {
  const formatted = `₹${price.toLocaleString('en-IN')}`;
  const labels = {
    fixed: '',
    hourly: '/hr',
    per_session: '/session',
    per_day: '/day',
    negotiable: ' (negotiable)',
  };
  return formatted + (labels[priceType] ?? '');
};

// ── Shared primitives ─────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
);

function Field({ id, label, required, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium text-foreground/80 font-sans"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground/60 font-sans">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-destructive font-sans">{error}</p>
      )}
    </div>
  );
}

// ── Image Upload ──────────────────────────────────────────────────────────────

function ImageUpload({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  }

  return value ? (
    <div className="relative rounded-xl overflow-hidden border border-border h-36 group">
      <img src={value} alt="preview" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
      <button
        onClick={() => onChange('')}
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  ) : (
    <label
      htmlFor="edit-service-image"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed h-36 cursor-pointer transition-colors ${
        dragOver
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-primary/[0.02] bg-muted/20'
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground/70 font-sans">
          Drop an image or <span className="text-primary">browse</span>
        </p>
        <p className="text-[11px] text-muted-foreground/50 font-sans mt-0.5">
          PNG, JPG up to 5 MB
        </p>
      </div>
      <input
        id="edit-service-image"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </label>
  );
}

// ── Tags Input ────────────────────────────────────────────────────────────────

function TagsInput({ value, onChange }) {
  const [custom, setCustom] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const toggleTag = (tag) =>
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag],
    );

  function addCustom() {
    const t = custom.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setCustom('');
    setShowCustom(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-sans ${
              value.includes(tag)
                ? 'border-primary/40 bg-primary/10 text-primary font-medium'
                : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/20'
            }`}
          >
            {tag}
          </button>
        ))}
        {!showCustom && (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors font-sans"
          >
            <Plus className="h-3 w-3" /> Custom
          </button>
        )}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustom();
              }
              if (e.key === 'Escape') setShowCustom(false);
            }}
            placeholder="Tag name…"
            className="h-8 text-xs font-sans max-w-[160px]"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={addCustom}
            className="h-8 text-xs font-sans"
          >
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCustom(false)}
            className="h-8 text-xs font-sans"
          >
            Cancel
          </Button>
        </div>
      )}

      {value.filter((t) => !SUGGESTED_TAGS.includes(t)).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value
            .filter((t) => !SUGGESTED_TAGS.includes(t))
            .map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="gap-1 text-[11px] border-primary/30 bg-primary/8 text-primary pr-1.5 font-sans"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-0.5 hover:text-destructive transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}

// ── Edit Service Modal ────────────────────────────────────────────────────────

function EditServiceModal({ service, open, onOpenChange, refetch }) {
  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const { data: categories = [], isLoading: isCatLoading } =
    useGetCategoriesQuery();

  const [form, setForm] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    category: service?.category ?? '',
    price: service?.price ?? '',
    priceType: service?.priceType ?? '',
    discountPrice: service?.discountPrice ?? '',
    duration: service?.duration ?? '',
    city: service?.city ?? '',
    imageUrl: service?.imageUrl ?? '',
    tags: service?.tags ?? [],
    isListed: service?.isListed ?? true,
    instantBooking: service?.instantBooking ?? false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Service name is required.';
    if (!form.category) e.category = 'Please select a category.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Enter a valid price.';
    if (!form.priceType) e.priceType = 'Please select a price type.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (
      !form.duration ||
      isNaN(Number(form.duration)) ||
      Number(form.duration) <= 0
    )
      e.duration = 'Enter a valid duration.';
    if (
      form.discountPrice &&
      (isNaN(Number(form.discountPrice)) ||
        Number(form.discountPrice) >= Number(form.price))
    )
      e.discountPrice = 'Must be less than original price.';
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
      await updateService({
        id: service._id,
        body: {
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          price: Number(form.price),
          priceType: form.priceType,
          discountPrice: form.discountPrice
            ? Number(form.discountPrice)
            : undefined,
          duration: Number(form.duration),
          city: form.city.trim(),
          imageUrl: form.imageUrl,
          tags: form.tags,
          isListed: form.isListed,
          instantBooking: form.instantBooking,
        },
      }).unwrap();
      refetch();
      onOpenChange(false);
    } catch (err) {
      setServerError(
        err?.data?.message ?? 'Failed to update. Please try again.',
      );
    }
  }

  const descLen = form.description.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-xl max-h-[90vh] overflow-y-auto font-sans p-0 gap-0"
        style={{ boxShadow: '0 8px 48px -8px hsl(var(--primary) / 0.18)' }}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Pencil className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-display tracking-tight text-foreground">
                Edit Service
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                Changes go live immediately after saving.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3.5 py-3">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive font-sans">
                {serverError}
              </p>
            </div>
          )}

          {/* Basic info */}
          <section className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans">
              Basic information
            </p>
            <Field
              id="edit-name"
              label="Service name"
              required
              error={errors.name}
            >
              <Input
                id="edit-name"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Deep Tissue Massage"
                className={`h-9 text-sm font-sans ${errors.name ? 'border-destructive' : ''}`}
              />
            </Field>
            <Field
              id="edit-description"
              label="Description"
              hint="Help customers know what to expect."
            >
              <Textarea
                id="edit-description"
                value={form.description}
                rows={3}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESC) set('description')(e);
                }}
                className="text-sm font-sans resize-none"
                placeholder="Describe what's included…"
              />
              <p
                className={`text-[11px] text-right font-sans mt-1 ${descLen > MAX_DESC * 0.9 ? 'text-amber-600' : 'text-muted-foreground/50'}`}
              >
                {descLen} / {MAX_DESC}
              </p>
            </Field>
            <Field
              id="edit-category"
              label="Category"
              required
              error={errors.category}
            >
              <Select value={form.category} onValueChange={setVal('category')}>
                <SelectTrigger
                  id="edit-category"
                  className={`h-9 text-sm font-sans ${errors.category ? 'border-destructive' : ''}`}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {isCatLoading ? (
                    <SelectItem value="__loading" disabled>
                      Loading…
                    </SelectItem>
                  ) : (
                    categories.map((c) => (
                      <SelectItem
                        key={c._id}
                        value={c._id}
                        className="text-sm font-sans"
                      >
                        {c.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </Field>
          </section>

          <Separator />

          {/* Pricing */}
          <section className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans">
              Pricing &amp; duration
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="edit-price"
                label="Price"
                required
                error={errors.price}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={set('price')}
                    className={`h-9 pl-6 text-sm font-sans ${errors.price ? 'border-destructive' : ''}`}
                  />
                </div>
              </Field>
              <Field
                id="edit-priceType"
                label="Price type"
                required
                error={errors.priceType}
              >
                <Select
                  value={form.priceType}
                  onValueChange={setVal('priceType')}
                >
                  <SelectTrigger
                    id="edit-priceType"
                    className={`h-9 text-sm font-sans ${errors.priceType ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_TYPES.map((pt) => (
                      <SelectItem
                        key={pt.value}
                        value={pt.value}
                        className="text-sm font-sans"
                      >
                        {pt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="edit-duration"
                label="Duration (min)"
                required
                error={errors.duration}
              >
                <div className="relative">
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={set('duration')}
                    className={`h-9 pr-10 text-sm font-sans ${errors.duration ? 'border-destructive' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60">
                    min
                  </span>
                </div>
              </Field>
              <Field
                id="edit-discountPrice"
                label="Discount price"
                hint="Optional"
                error={errors.discountPrice}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="edit-discountPrice"
                    type="number"
                    min="0"
                    placeholder="—"
                    value={form.discountPrice}
                    onChange={set('discountPrice')}
                    className={`h-9 pl-6 text-sm font-sans ${errors.discountPrice ? 'border-destructive' : ''}`}
                  />
                </div>
              </Field>
            </div>
            <Field id="edit-city" label="City" required error={errors.city}>
              <Input
                id="edit-city"
                value={form.city}
                onChange={set('city')}
                placeholder="e.g. Mumbai"
                className={`h-9 text-sm font-sans ${errors.city ? 'border-destructive' : ''}`}
              />
            </Field>
          </section>

          <Separator />

          {/* Tags */}
          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans">
              Tags
            </p>
            <TagsInput value={form.tags} onChange={setVal('tags')} />
          </section>

          <Separator />

          {/* Image */}
          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans">
              Service image
            </p>
            <ImageUpload value={form.imageUrl} onChange={setVal('imageUrl')} />
          </section>

          <Separator />

          {/* Visibility */}
          <section className="divide-y divide-border/60">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans pb-3">
              Visibility &amp; booking
            </p>
            {[
              {
                key: 'isListed',
                label: 'List this service publicly',
                sub: 'Customers can discover and book this service.',
              },
              {
                key: 'instantBooking',
                label: 'Accept instant bookings',
                sub: 'No manual confirmation needed from you.',
              },
            ].map(({ key, label, sub }) => (
              <div
                key={key}
                className="flex items-center justify-between py-3.5"
              >
                <div className="space-y-0.5 pr-8">
                  <p className="text-sm font-medium text-foreground font-sans">
                    {label}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 font-sans">
                    {sub}
                  </p>
                </div>
                <Switch checked={form[key]} onCheckedChange={setVal(key)} />
              </div>
            ))}
          </section>
        </div>

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
            className="gap-2 font-sans min-w-[110px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
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

// ── Skeleton ──────────────────────────────────────────────────────────────────

const ServiceCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
    <div className="flex gap-4">
      <Pulse className="h-16 w-16 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <Pulse className="h-4 w-40" />
        <Pulse className="h-3 w-24" />
      </div>
      <Pulse className="h-8 w-8 rounded-lg shrink-0" />
    </div>
    <Pulse className="h-px w-full" />
    <div className="flex justify-between">
      <Pulse className="h-3 w-20" />
      <Pulse className="h-3 w-20" />
    </div>
  </div>
);

// ── Service Card ──────────────────────────────────────────────────────────────

function ServiceCard({ service, onDelete, onEdit, refetch }) {
  const [toggleListing, { isLoading: isToggling }] =
    useToggleServiceListingMutation();

  const handleToggle = async () => {
    try {
      await toggleListing({
        id: service._id,
        isListed: !service.isListed,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to toggle listing:', err);
    }
  };

  const hasDiscount =
    service.discountPrice && service.discountPrice < service.price;
  const priceType =
    PRICE_TYPE_CONFIG[service.priceType] ?? PRICE_TYPE_CONFIG.fixed;

  return (
    <div
      className={`rounded-2xl border bg-card overflow-hidden transition-all duration-200 ${service.isListed ? 'border-border' : 'border-border/60 opacity-75'}`}
    >
      {!service.isListed && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/60 border-b border-border/60">
          <EyeOff className="h-3 w-3 text-muted-foreground/60" />
          <p className="text-[11px] text-muted-foreground font-sans">
            Hidden from customers
          </p>
        </div>
      )}

      <div className="p-5">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-border bg-muted/40">
            {service.imageUrl ? (
              <img
                src={service.imageUrl}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Tag className="h-5 w-5 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="text-sm font-bold font-display text-foreground leading-snug">
                {service.name}
              </h3>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 ${priceType.class}`}
              >
                {priceType.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {service.description || 'No description added.'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-foreground">
                {formatPrice(
                  hasDiscount ? service.discountPrice : service.price,
                  service.priceType,
                )}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{service.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => onEdit(service)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit service
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleToggle}
                className="flex items-center gap-2 cursor-pointer"
              >
                {service.isListed ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Make public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(service)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator className="my-4" />

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {service.duration} min
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> {service.city}
          </div>
          {service.avgRating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{' '}
              {service.avgRating.toFixed(1)}
            </div>
          )}
          {service.tags?.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap ml-auto">
              {service.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-sans"
                >
                  {tag}
                </span>
              ))}
              {service.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground/50 font-sans">
                  +{service.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            {service.isListed ? 'Visible to customers' : 'Not listed publicly'}
          </p>
          <div className="flex items-center gap-2">
            {isToggling && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            )}
            <Switch
              checked={service.isListed}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ManageServicesPage() {
  const business = useSelector(selectCurrentBusiness);
  const {
    data: services = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBusinessServicesQuery(business?._id, { skip: !business?._id });

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const filtered = services.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'listed' && s.isListed) ||
      (filter === 'unlisted' && !s.isListed);
    return matchSearch && matchFilter;
  });

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleteError('');
    try {
      await deleteService(toDelete._id).unwrap();
      setToDelete(null);
      refetch();
    } catch (err) {
      setDeleteError(err?.data?.message ?? 'Delete failed.');
    }
  };

  if (isLoading)
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="py-20 text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive/60" />
        </div>
        <p className="font-semibold text-foreground font-display">
          Failed to load services
        </p>
        <p className="text-sm text-muted-foreground">
          {error?.data?.message || 'Something went wrong.'}
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">My Services</h1>
          <p className="text-sm text-muted-foreground">
            {services.length} service{services.length !== 1 ? 's' : ''} total
            {services.length > 0 &&
              ` · ${services.filter((s) => s.isListed).length} listed`}
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5 font-sans">
          <Link to="/business/services/new">
            <Plus className="h-3.5 w-3.5" /> Add new
          </Link>
        </Button>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive font-sans">{deleteError}</p>
        </div>
      )}

      {/* Search + Filter */}
      {services.length > 0 && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              placeholder="Search by name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm font-sans"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-[140px] text-sm font-sans shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="listed">Listed</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Service list */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <ServiceCard
              key={s._id}
              service={s}
              onDelete={setToDelete}
              onEdit={setToEdit}
              refetch={refetch}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
            <PackageX className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              {search || filter !== 'all'
                ? 'No services match your search.'
                : 'No services yet.'}
            </p>
            {!search && filter === 'all' && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 font-sans text-xs"
                asChild
              >
                <Link to="/business/services/new">Add your first service</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {toEdit && (
        <EditServiceModal
          service={toEdit}
          open={!!toEdit}
          onOpenChange={(open) => {
            if (!open) setToEdit(null);
          }}
          refetch={refetch}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog
        open={!!toDelete}
        onOpenChange={(open) => {
          if (!open) {
            setToDelete(null);
            setDeleteError('');
          }
        }}
      >
        <AlertDialogContent className="font-sans max-w-sm">
          <AlertDialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 mb-1">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="font-display text-base">
              Delete "{toDelete?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-sans text-muted-foreground">
              This will permanently remove the service. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              disabled={isDeleting}
              className="font-sans text-sm"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 gap-2 font-sans text-sm"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting…
                </>
              ) : (
                'Yes, delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
