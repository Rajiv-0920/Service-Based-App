import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  CloudLightning,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

import { useLoginMutation, useGoogleLoginMutation } from '../services/authApi';
import { setCredentials } from '../store/authSlice';
import BackgroundDecor from '../components/misc/BackgroundDecor';

// ── Icons ──
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-current text-[#1877F2]"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function SignInPage() {
  const [
    login,
    { isLoading: isEmailLoading, error: loginError, isError: isLoginError },
  ] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleGoogleSignIn() {
    try {
      const result = await googleLogin({ rememberMe }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));

      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google login failed', err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({
        email,
        password,
        rememberMe,
      }).unwrap();

      // dispatch(setCredentials({ user, business, token }));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const socialProviders = [
    {
      id: 'google',
      label: 'Google',
      icon: <GoogleIcon />,
      onClick: handleGoogleSignIn,
      isLoading: isGoogleLoading,
    },
    { id: 'github', label: 'GitHub', icon: <GitHubIcon /> },
    { id: 'twitter', label: 'Twitter', icon: <TwitterXIcon /> },
    { id: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  ];

  return (
    <div className="relative flex-1 bg-background flex items-center justify-center p-4">
      <BackgroundDecor />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Home link */}
        <div className="mb-6 flex w-full justify-start">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Back to home
          </Link>
        </div>

        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl shadow-lg bg-primary">
            <Sparkles
              className="h-5 w-5 text-primary-foreground"
              strokeWidth={1.8}
            />
          </div>
          <div className="text-center">
            <h1 className="text-[2rem] leading-tight text-foreground font-semibold font-display">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue to your account
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-border bg-card p-8 shadow-sm"
          style={{
            boxShadow:
              '0 2px 24px -4px hsl(var(--primary) / 0.08), 0 1px 4px hsl(0 0% 0% / 0.06)',
          }}
        >
          {/* Social Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {socialProviders.map(({ id, label, icon, onClick, isLoading }) => (
              <Button
                key={id}
                variant="outline"
                disabled={isLoading}
                className="h-10 gap-2 text-sm font-medium transition-all hover:bg-secondary hover:border-primary/30"
                onClick={onClick}
                type="button"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  icon
                )}
                <span>{label}</span>
              </Button>
            ))}
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-border" />
            <span className="shrink-0 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              or continue with email
            </span>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 h-10 transition-all focus-visible:ring-2"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-primary text-xs font-medium hover:opacity-75 transition-opacity"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-10 h-10 transition-all focus-visible:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground font-normal cursor-pointer select-none"
              >
                Keep me signed in for 30 days
              </Label>
            </div>

            {isLoginError && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{loginError?.message}</span>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isEmailLoading}
              className="w-full h-10 gap-2"
            >
              {isEmailLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-primary font-semibold hover:opacity-75 transition-opacity"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
