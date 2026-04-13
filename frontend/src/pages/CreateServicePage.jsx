import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader2,
  ImageIcon,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateServiceMutation,
  useGetCategoriesQuery,
} from '../services/servicesApi';

// ── Constants ─────────────────────────────────────────────────────────────────

const PRICE_TYPES = [
  { value: 'fixed', label: 'fixed' },
  { value: 'hourly', label: 'Per hour' },
  { value: 'per_session', label: 'Per session' },
  { value: 'per_day', label: 'Per day' },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function FieldGroup({ label, children }) {
  return (
    <div
      className="rounded-2xl border border-border bg-card px-5 py-5"
      style={{ boxShadow: '0 1px 8px hsl(var(--primary) / 0.04)' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 font-sans mb-4">
        {label}
      </p>
      {children}
    </div>
  );
}

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
    <div className="relative rounded-xl overflow-hidden border border-border h-40 group">
      <img
        src={value}
        alt="service preview"
        className="w-full h-full object-cover"
      />
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
      htmlFor="service-image"
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
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed h-40 cursor-pointer transition-colors ${
        dragOver
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-primary/[0.02] bg-muted/20'
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60">
        <ImageIcon className="h-4.5 w-4.5 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground/70 font-sans">
          Drop an image or <span className="text-primary">browse</span>
        </p>
        <p className="text-[11px] text-muted-foreground/50 font-sans mt-0.5">
          PNG, JPG up to 5 MB · Recommended 800×600
        </p>
      </div>
      <input
        id="service-image"
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

  function toggleTag(tag) {
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag],
    );
  }

  function addCustom() {
    const t = custom.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setCustom('');
    setShowCustom(false);
  }

  return (
    <div className="space-y-3">
      {/* Suggested tags */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-sans ${
              value.includes(tag)
                ? 'border-primary/40 bg-primary/10 text-primary font-medium'
                : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/20 hover:bg-primary/[0.03]'
            }`}
          >
            {tag}
          </button>
        ))}

        {/* Custom tag pill */}
        {!showCustom && (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors font-sans"
          >
            <Plus className="h-3 w-3" />
            Custom
          </button>
        )}
      </div>

      {/* Custom tag input */}
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
            placeholder="Type a tag and press Enter…"
            className="h-8 text-xs font-sans max-w-[200px]"
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

      {/* Selected custom tags not in suggested list */}
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

// ── Main Component ────────────────────────────────────────────────────────────

export default function NewServicePage() {
  const navigate = useNavigate();
  const [createService, { isLoading }] = useCreateServiceMutation();
  const { data, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  const CATEGORIES = isCategoriesLoading ? [] : data;

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    priceType: '',
    discountPrice: '',
    duration: '',
    city: '',
    imageUrl: '',
    tags: [],
    isListed: true,
    instantBooking: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // ── field helpers
  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  // ── validation
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
      e.discountPrice = 'Discount must be less than the original price.';
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
      await createService({
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
      }).unwrap();
      navigate('/business/services');
    } catch (err) {
      setServerError(
        err?.data?.message ?? 'Failed to create service. Please try again.',
      );
    }
  }

  const descLen = form.description.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-3 font-sans">
      {/* ── Back nav ── */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 -ml-1 text-muted-foreground font-sans mb-1"
        asChild
      >
        <Link to="/business/services">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to services
        </Link>
      </Button>

      {/* ── Page header ── */}
      <div className="space-y-1 pb-1">
        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
          Add a new service
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Fill in the details below — customers will see this when browsing your
          profile.
        </p>
      </div>

      {/* ── Server error ── */}
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive font-sans">{serverError}</p>
        </div>
      )}

      {/* ── Basic info ── */}
      <FieldGroup label="Basic information">
        <div className="space-y-4">
          <Field id="name" label="Service name" required error={errors.name}>
            <Input
              id="name"
              placeholder="e.g. Full Body Massage, Haircut & Styling"
              value={form.name}
              onChange={set('name')}
              className={`h-9 text-sm font-sans ${errors.name ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
            />
          </Field>

          <Field
            id="description"
            label="Description"
            hint="Help customers know what to expect."
          >
            <Textarea
              id="description"
              placeholder="Describe what's included, what to expect, any special notes…"
              value={form.description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESC) set('description')(e);
              }}
              rows={3}
              className="text-sm font-sans resize-none"
            />
            <p
              className={`text-[11px] text-right font-sans mt-1 ${descLen > MAX_DESC * 0.9 ? 'text-amber-600' : 'text-muted-foreground/50'}`}
            >
              {descLen} / {MAX_DESC}
            </p>
          </Field>

          <Field
            id="category"
            label="Category"
            required
            error={errors.category}
          >
            <Select value={form.category} onValueChange={setVal('category')}>
              <SelectTrigger
                id="category"
                className={`h-9 text-sm font-sans ${errors.category ? 'border-destructive' : ''}`}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem
                    key={c._id}
                    value={c._id}
                    className="text-sm font-sans"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </FieldGroup>

      {/* ── Pricing & duration ── */}
      <FieldGroup label="Pricing & duration">
        <div className="space-y-4">
          {/* Price + Price Type */}
          <div className="grid grid-cols-2 gap-3">
            <Field id="price" label="Price" required error={errors.price}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-sans">
                  ₹
                </span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.price}
                  onChange={set('price')}
                  className={`h-9 pl-6 text-sm font-sans ${errors.price ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                />
              </div>
            </Field>

            <Field
              id="priceType"
              label="Price type"
              required
              error={errors.priceType}
            >
              <Select
                value={form.priceType}
                onValueChange={setVal('priceType')}
              >
                <SelectTrigger
                  id="priceType"
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

          {/* Duration + Discount */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="duration"
              label="Duration (min)"
              required
              error={errors.duration}
            >
              <div className="relative">
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="60"
                  value={form.duration}
                  onChange={set('duration')}
                  className={`h-9 pr-10 text-sm font-sans ${errors.duration ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60 font-sans">
                  min
                </span>
              </div>
            </Field>

            <Field
              id="discountPrice"
              label="Discount price"
              hint="Optional"
              error={errors.discountPrice}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-sans">
                  ₹
                </span>
                <Input
                  id="discountPrice"
                  type="number"
                  min="0"
                  placeholder="—"
                  value={form.discountPrice}
                  onChange={set('discountPrice')}
                  className={`h-9 pl-6 text-sm font-sans ${errors.discountPrice ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                />
              </div>
            </Field>
          </div>

          {/* City */}
          <Field id="city" label="City" required error={errors.city}>
            <Input
              id="city"
              placeholder="e.g. Mumbai, Delhi, Bangalore"
              value={form.city}
              onChange={set('city')}
              className={`h-9 text-sm font-sans ${errors.city ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
            />
          </Field>
        </div>
      </FieldGroup>

      {/* ── Tags ── */}
      <FieldGroup label="Tags">
        <TagsInput value={form.tags} onChange={setVal('tags')} />
        <p className="text-[11px] text-muted-foreground/50 font-sans mt-3">
          Tags help customers find your service faster in search.
        </p>
      </FieldGroup>

      {/* ── Image ── */}
      <FieldGroup label="Service image">
        <ImageUpload value={form.imageUrl} onChange={setVal('imageUrl')} />
      </FieldGroup>

      {/* ── Visibility ── */}
      <FieldGroup label="Visibility & booking">
        <div className="space-y-0 divide-y divide-border/60">
          {/* Toggle row */}
          {[
            {
              key: 'isListed',
              label: 'List this service publicly',
              sub: 'Customers can discover and book this service from your profile.',
            },
            {
              key: 'instantBooking',
              label: 'Accept instant bookings',
              sub: 'Customers can book without waiting for your manual confirmation.',
            },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between py-3.5">
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
        </div>
      </FieldGroup>

      {/* ── Footer actions ── */}
      <Separator />
      <div className="flex items-center justify-between pt-1 pb-4">
        <Button variant="outline" size="sm" className="font-sans" asChild>
          <Link to="/business/services">Cancel</Link>
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isLoading}
          className="gap-2 font-sans min-w-[130px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Publishing…
            </>
          ) : (
            'Publish service →'
          )}
        </Button>
      </div>
    </div>
  );
}
