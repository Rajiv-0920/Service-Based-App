import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterMutation } from '../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import BackgroundDecor from '../components/misc/BackgroundDecor';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Field({ id, label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-[11px] text-muted-foreground font-sans">{hint}</p>
      )}
    </div>
  );
}

function Req({ children }) {
  return (
    <>
      {children}
      <span className="text-destructive">*</span>
    </>
  );
}

function IconInput({ id, icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input id={id} className="pl-9 h-10" {...props} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
        {children}
      </span>
      <div className="h-[1px] flex-1 bg-border" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Register Page
// ---------------------------------------------------------------------------
export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Read intent from URL — /register?intent=business
  const isBusiness = searchParams.get('intent') === 'business';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    try {
      const { token, user } = await register({
        name,
        email,
        password,
      }).unwrap();

      localStorage.setItem('token', token);
      dispatch(setCredentials({ user, token }));
      // Redirect based on intent
      navigate(isBusiness ? '/business/setup' : '/');
    } catch (err) {
      setError(err?.data?.message ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      <BackgroundDecor />

      {/* Back to home */}
      <div className="mb-6 flex justify-start w-full max-w-md">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to home
        </Link>
      </div>

      {/* Logo */}
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-xl tracking-tight font-display">
          Service Base
        </span>
      </Link>

      <div className="w-full max-w-md">
        {/* Heading — changes based on intent */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight font-display">
            {isBusiness ? 'Create a business account' : 'Create an account'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground font-sans">
            {isBusiness
              ? 'Set up your account, then complete your business profile.'
              : 'Find and book trusted local services.'}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-border bg-card p-8 shadow-sm"
          style={{
            boxShadow:
              '0 2px 24px -4px hsl(var(--primary) / 0.08), 0 1px 4px hsl(0 0% 0% / 0.06)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <SectionLabel>Account info</SectionLabel>

            <div className="space-y-4">
              <Field id="name" label={<Req>Full name</Req>}>
                <IconInput
                  id="name"
                  icon={User}
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field id="email" label={<Req>Email address</Req>}>
                <IconInput
                  id="email"
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
            </div>

            <SectionLabel>Security</SectionLabel>

            <Field
              id="password"
              label={<Req>Password</Req>}
              hint="Minimum 6 characters"
            >
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-10 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            <p className="text-[11px] text-muted-foreground font-sans">
              Fields marked <span className="text-destructive">*</span> are
              required.
            </p>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive font-sans">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  {isBusiness ? 'Create business account' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Extra note for business intent */}
            {isBusiness && (
              <p className="text-center text-[11px] text-muted-foreground font-sans leading-relaxed">
                After sign up you'll complete your business profile. Accounts
                require admin approval before going live.
              </p>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground font-sans">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:opacity-75 transition-opacity"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
