import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  Key,
  Bell,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

import { selectCurrentUser, clearCredentials } from '../store/authSlice';
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '../services/userApi';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Inline feedback banner
// ---------------------------------------------------------------------------
function Feedback({ type, message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-sans',
        isError
          ? 'bg-destructive/10 text-destructive'
          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
      )}
    >
      {isError ? (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      )}
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password field with show/hide toggle
// ---------------------------------------------------------------------------
function PasswordInput({ id, label, value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Change Password
// ---------------------------------------------------------------------------
function ChangePasswordSection({ isGoogleUser }) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (form.newPassword.length < 6) {
      return setFeedback({
        type: 'error',
        message: 'New password must be at least 6 characters.',
      });
    }
    if (form.newPassword !== form.confirmPassword) {
      return setFeedback({
        type: 'error',
        message: 'New passwords do not match.',
      });
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }).unwrap();
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFeedback({
        type: 'success',
        message: 'Password updated successfully.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err?.data?.message ?? 'Failed to update password. Please try again.',
      });
    }
  };

  if (isGoogleUser) {
    return (
      <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 flex items-start gap-3">
        <Shield className="mt-0.5 h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold font-display">
            Managed by Google
          </p>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Your password is managed through your Google Account. Visit{' '}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Google Account Security
            </a>{' '}
            to make changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <PasswordInput
        id="current-password"
        label="Current password"
        value={form.currentPassword}
        onChange={set('currentPassword')}
        placeholder="Enter current password"
        disabled={isLoading}
      />
      <PasswordInput
        id="new-password"
        label="New password"
        value={form.newPassword}
        onChange={set('newPassword')}
        placeholder="At least 8 characters"
        disabled={isLoading}
      />
      <PasswordInput
        id="confirm-password"
        label="Confirm new password"
        value={form.confirmPassword}
        onChange={set('confirmPassword')}
        placeholder="Repeat new password"
        disabled={isLoading}
      />

      <Feedback type={feedback.type} message={feedback.message} />

      <Button
        type="submit"
        size="sm"
        disabled={isLoading || !form.currentPassword || !form.newPassword}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Key className="mr-2 h-4 w-4" />
        )}
        Update password
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Section: Notifications
// ---------------------------------------------------------------------------
const NOTIFICATION_PREFS = [
  {
    key: 'bookingUpdates',
    label: 'Booking updates',
    description: 'Status changes, confirmations, and cancellations',
  },
  {
    key: 'newReviews',
    label: 'New reviews',
    description: 'When someone leaves a review on your services',
  },
  {
    key: 'promotions',
    label: 'Promotions & news',
    description: 'Platform updates and special offers',
  },
  {
    key: 'security',
    label: 'Security alerts',
    description: 'Login attempts and account changes',
  },
];

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    bookingUpdates: true,
    newReviews: true,
    promotions: false,
    security: true,
  });

  return (
    <div className="space-y-4 font-sans">
      {NOTIFICATION_PREFS.map(({ key, label, description }) => (
        <div key={key} className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Switch
            checked={prefs[key]}
            onCheckedChange={(val) => setPrefs((p) => ({ ...p, [key]: val }))}
            aria-label={label}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Delete Account
// ---------------------------------------------------------------------------
function DeleteAccountSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    try {
      await deleteAccount().unwrap();
      dispatch(clearCredentials());
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">
              This action is permanent
            </p>
            <p className="text-xs text-muted-foreground">
              Deleting your account will remove all your data, bookings, and
              reviews. This cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete my account
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans">
              This will permanently delete your account and all associated data.
              Type <span className="font-semibold text-foreground">DELETE</span>{' '}
              below to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="font-mono"
          />

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmText('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isGoogleUser = !!user.googleId;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-display">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-sans">
          Manage your security, notifications, and account preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Password ── */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-secondary p-2">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base">
                  Password
                </CardTitle>
                <CardDescription className="font-sans text-xs">
                  {isGoogleUser
                    ? 'Your account uses Google Sign-In'
                    : 'Change your login password'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChangePasswordSection isGoogleUser={isGoogleUser} />
          </CardContent>
        </Card>

        {/* ── Notifications ── */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-secondary p-2">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base">
                  Notifications
                </CardTitle>
                <CardDescription className="font-sans text-xs">
                  Choose which emails you want to receive
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NotificationsSection />
          </CardContent>
        </Card>

        {/* ── Danger zone ── */}
        <Card className="shadow-sm border-destructive/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-destructive/10 p-2">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <CardTitle className="font-display text-base text-destructive">
                  Danger zone
                </CardTitle>
                <CardDescription className="font-sans text-xs">
                  Irreversible account actions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DeleteAccountSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
