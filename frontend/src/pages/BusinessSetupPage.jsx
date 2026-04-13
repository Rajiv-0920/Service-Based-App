import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRegisterBusinessMutation } from '../services/authApi';
import BackgroundDecor from '../components/misc/BackgroundDecor';

// ── Reusable UI Components ──────────────────────────────────────────────────

function Field({ id, label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-[11px] text-muted-foreground font-sans leading-tight">
          {hint}
        </p>
      )}
    </div>
  );
}

function Req({ children }) {
  return (
    <span className="flex items-center gap-1">
      {children}
      <span className="text-destructive font-bold">*</span>
    </span>
  );
}

function IconInput({ id, icon: Icon, ...props }) {
  return (
    <div className="relative group">
      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <Input
        id={id}
        className="pl-9 h-10 transition-all focus-visible:ring-primary/20"
        {...props}
      />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 pt-6 pb-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80 whitespace-nowrap">
        {children}
      </span>
      <div className="h-[px] flex-1 bg-border/60" />
    </div>
  );
}

// ── Main Page Component ─────────────────────────────────────────────────────

export default function BusinessSetupPage() {
  const navigate = useNavigate();
  const [registerBusiness, { isLoading, error }] =
    useRegisterBusinessMutation();
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    description: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      businessName: form.businessName,
      email: form.email,
      phone: form.phone,
      description: form.description,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
    };

    try {
      await registerBusiness(payload).unwrap();

      setDone(true);
      // Wait for 3 seconds before redirecting
      setTimeout(() => navigate('/business/profile'), 3500);
    } catch (err) {}
  };

  // ── Success View ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <BackgroundDecor />
        <div
          className="w-full max-w-md rounded-2xl border border-border bg-card p-10 shadow-sm text-center space-y-6 transition-all animate-in fade-in zoom-in duration-300"
          style={{ boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.1)' }}
        >
          {/* Animated Success Icon */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75"></div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
              Profile Submitted!
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed text-sm">
              We've received <strong>{form.businessName}</strong>'s details. Our
              team reviews profiles within 24 hours.
            </p>
          </div>

          {/* Stepper visualization */}
          <div className="bg-muted/40 rounded-xl p-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
            <div className="flex flex-col items-center gap-1.5 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Details</span>
            </div>
            <div className="h-[2px] flex-1 bg-primary/30 mx-2" />
            <div className="flex flex-col items-center gap-1.5 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Reviewing</span>
            </div>
            <div className="h-[2px] flex-1 bg-border mx-2" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-border" />
              <span>Go Live</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <p className="text-[12px] text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              Redirecting to profile...
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/business/profile')}
            >
              View Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form View ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center w-full px-4 py-12">
      <BackgroundDecor />

      {/* Brand Header */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight font-display">
          Service Base
        </span>
      </div>

      <div className="w-full max-w-xl">
        {/* Title & Banner */}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-display">
            Register your business
          </h1>
          <p className="text-muted-foreground font-sans max-w-xs mx-auto text-sm">
            Complete your profile to start reaching customers in your area.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <Building2 className="h-5 w-5 text-primary shrink-0" />
          <p className="text-[12px] text-muted-foreground/90 font-sans leading-relaxed">
            <strong>Verification required:</strong> Your profile will be
            manually reviewed. Ensure your phone and email are accurate to avoid
            delays.
          </p>
        </div>

        {/* Main Form Card */}
        <div
          className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-sm"
          style={{ boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.05)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <SectionLabel>Basic Information</SectionLabel>

            <div className="grid grid-cols-1 gap-5">
              <Field id="businessName" label={<Req>Business Name</Req>}>
                <IconInput
                  id="businessName"
                  icon={Building2}
                  placeholder="e.g. Elite Plumbing Solutions"
                  value={form.businessName}
                  onChange={handleChange('businessName')}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="email" label={<Req>Business Email</Req>}>
                  <IconInput
                    id="email"
                    icon={Mail}
                    type="email"
                    placeholder="contact@business.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    required
                  />
                </Field>

                <Field id="phone" label={<Req>Phone Number</Req>}>
                  <IconInput
                    id="phone"
                    icon={Phone}
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    required
                  />
                </Field>
              </div>

              <Field
                id="description"
                label="Business Description"
                hint="Summarize what you do and your years of expertise."
              >
                <div className="relative group">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                  <Textarea
                    id="description"
                    placeholder="Tell your customers about your services..."
                    value={form.description}
                    onChange={handleChange('description')}
                    className="pl-9 min-h-[100px] resize-none font-sans text-sm focus-visible:ring-primary/20"
                  />
                </div>
              </Field>
            </div>

            <SectionLabel>Location Details</SectionLabel>

            <div className="space-y-4">
              <Field id="street" label="Street Address">
                <IconInput
                  id="street"
                  icon={MapPin}
                  placeholder="Building, Street, Area"
                  value={form.street}
                  onChange={handleChange('street')}
                />
              </Field>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Field id="city" label={<Req>City</Req>}>
                    <Input
                      id="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange('city')}
                      required
                      className="h-10"
                    />
                  </Field>
                </div>
                <div className="col-span-1">
                  <Field id="state" label={<Req>State</Req>}>
                    <Input
                      id="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange('state')}
                      required
                      className="h-10"
                    />
                  </Field>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Field id="pincode" label="Pincode">
                    <Input
                      id="pincode"
                      placeholder="000000"
                      value={form.pincode}
                      onChange={handleChange('pincode')}
                      maxLength={6}
                      className="h-10"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive font-sans animate-in slide-in-from-top-1">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Profile for Review
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="mt-4 text-[11px] text-center text-muted-foreground font-sans">
                By submitting, you agree to our Terms of Service for Business
                Owners.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
