import { useState } from 'react'
import {
  Building2,
  Users,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Trash2,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  Search,
  Shield,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
} from '@/components/ui/alert-dialog'

import {
  useGetAdminBusinessesQuery,
  useApproveBusinessMutation,
  useSuspendBusinessMutation,
  useGetAdminUsersQuery,
  useDeleteUserMutation,
  useGetAdminServicesQuery,
  useDeleteServiceMutation,
} from '../services/adminApi'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return (
    name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ── Pulse Skeleton ────────────────────────────────────────────────────────────

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
}

function TableSkeleton({ rows = 4 }) {
  return (
    <div className='space-y-2 p-4'>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className='flex items-center gap-3'>
          <Pulse className='h-9 w-9 rounded-lg shrink-0' />
          <div className='flex-1 space-y-1.5'>
            <Pulse className='h-3.5 w-36' />
            <Pulse className='h-3 w-24' />
          </div>
          <Pulse className='h-7 w-20 rounded-md' />
        </div>
      ))}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, iconClass, note }) {
  return (
    <div className='rounded-xl border border-border bg-card p-5 flex flex-col gap-3'>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className='h-4.5 w-4.5' />
      </div>
      <div>
        <p className='text-3xl font-bold font-display tracking-tight text-foreground'>
          {value ?? '—'}
        </p>
        <p className='text-sm text-muted-foreground font-sans mt-0.5'>
          {label}
        </p>
        {note && (
          <p className='text-[11px] text-muted-foreground/60 font-sans mt-1'>
            {note}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Section Wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon: Icon, count, children, action }) {
  return (
    <div
      className='rounded-2xl border border-border bg-card overflow-hidden'
      style={{ boxShadow: '0 1px 8px hsl(var(--primary) / 0.04)' }}
    >
      <div className='flex items-center justify-between px-5 py-4 border-b border-border/60'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-7 w-7 items-center justify-center rounded-md bg-primary/10'>
            <Icon className='h-3.5 w-3.5 text-primary' />
          </div>
          <h2 className='text-sm font-semibold text-foreground font-display'>
            {title}
          </h2>
          {count !== undefined && (
            <Badge variant='secondary' className='text-[11px] px-1.5 py-0 h-5'>
              {count}
            </Badge>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function Empty({ message }) {
  return (
    <div className='px-5 py-10 text-center'>
      <p className='text-sm text-muted-foreground font-sans'>{message}</p>
    </div>
  )
}

// ── Confirm Delete Dialog ─────────────────────────────────────────────────────

function DeleteDialog({ label, onConfirm, children }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{label}</strong>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Businesses Table ──────────────────────────────────────────────────────────

function BusinessesSection() {
  const { data, isLoading, refetch } = useGetAdminBusinessesQuery()
  const [approve, { isLoading: approving }] = useApproveBusinessMutation()
  const [suspend, { isLoading: suspending }] = useSuspendBusinessMutation()
  const [search, setSearch] = useState('')

  const businesses = data ?? []
  const pending = businesses.filter((b) => !b.isApproved && !b.isSuspended)
  const filtered = businesses.filter(
    (b) =>
      b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Section
      title='Businesses'
      icon={Building2}
      count={businesses.length}
      action={
        <div className='flex items-center gap-2'>
          {pending.length > 0 && (
            <Badge className='gap-1 bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-0 text-[11px]'>
              <Clock className='h-3 w-3' />
              {pending.length} pending
            </Badge>
          )}
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={refetch}
          >
            <RefreshCw className='h-3.5 w-3.5' />
          </Button>
        </div>
      }
    >
      {/* Search */}
      <div className='px-5 py-3 border-b border-border/40'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
          <Input
            placeholder='Search businesses…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-8 h-8 text-sm bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-input'
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <Empty message='No businesses found.' />
      ) : (
        <div className='divide-y divide-border/50'>
          {filtered.map((biz) => (
            <div
              key={biz._id}
              className='flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors'
            >
              {/* Avatar */}
              <Avatar className='h-9 w-9 rounded-lg border border-border shrink-0'>
                <AvatarImage src={biz.logo} alt={biz.businessName} />
                <AvatarFallback
                  className='rounded-lg text-xs font-bold'
                  style={{
                    background: 'hsl(var(--primary) / 0.12)',
                    color: 'hsl(var(--primary))',
                  }}
                >
                  {getInitials(biz.businessName)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-foreground truncate'>
                  {biz.businessName}
                </p>
                <div className='flex items-center gap-2 mt-0.5'>
                  <p className='text-xs text-muted-foreground truncate'>
                    {biz.email}
                  </p>
                  <span className='text-muted-foreground/30'>·</span>
                  <p className='text-xs text-muted-foreground shrink-0'>
                    {formatDate(biz.createdAt)}
                  </p>
                </div>
              </div>

              {/* Status + actions */}
              <div className='flex items-center gap-2 shrink-0'>
                {/* Status badge */}
                {biz.isSuspended ? (
                  <Badge
                    variant='outline'
                    className='text-[11px] font-medium border-destructive/30 bg-destructive/10 text-destructive gap-1 px-2 py-0.5'
                  >
                    <XCircle className='h-3 w-3' /> Suspended
                  </Badge>
                ) : biz.isApproved ? (
                  <Badge
                    variant='outline'
                    className='text-[11px] font-medium border-emerald-400/30 bg-emerald-700 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 gap-1 px-2 py-0.5'
                  >
                    <CheckCircle2 className='h-3 w-3' /> Approved
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='text-[11px] font-medium border-amber-400/30 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 gap-1 px-2 py-0.5'
                  >
                    <Clock className='h-3 w-3' /> Pending
                  </Badge>
                )}

                {/* Approve button — only when not approved and not suspended */}
                {!biz.isApproved && !biz.isSuspended && (
                  <Button
                    size='sm'
                    className='h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white'
                    onClick={() => approve(biz._id)}
                    disabled={approving}
                  >
                    <CheckCircle2 className='h-3 w-3' /> Approve
                  </Button>
                )}

                {/* Suspend button — only when approved */}
                {biz.isApproved && !biz.isSuspended && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-7 text-xs gap-1 border-destructive/30 text-destructive hover:bg-destructive/10'
                    onClick={() => suspend(biz._id)}
                    disabled={suspending}
                  >
                    <ShieldAlert className='h-3 w-3' /> Suspend
                  </Button>
                )}

                {/* Reinstate — only when suspended */}
                {biz.isSuspended && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-7 text-xs gap-1'
                    onClick={() => approve(biz._id)}
                    disabled={approving}
                  >
                    <RefreshCw className='h-3 w-3' /> Reinstate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

// ── Users Table ───────────────────────────────────────────────────────────────

function UsersSection() {
  const { data, isLoading, refetch } = useGetAdminUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
  const [search, setSearch] = useState('')

  const users = data ?? []
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Section
      title='Users'
      icon={Users}
      count={users.length}
      action={
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={refetch}
        >
          <RefreshCw className='h-3.5 w-3.5' />
        </Button>
      }
    >
      {/* Search */}
      <div className='px-5 py-3 border-b border-border/40'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
          <Input
            placeholder='Search users…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-8 h-8 text-sm bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-input'
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <Empty message='No users found.' />
      ) : (
        <div className='divide-y divide-border/50'>
          {filtered.map((u) => (
            <div
              key={u._id}
              className='flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors'
            >
              <Avatar className='h-9 w-9 rounded-lg border border-border shrink-0'>
                <AvatarImage src={u.avatar} alt={u.name} />
                <AvatarFallback
                  className='rounded-lg text-xs font-bold'
                  style={{
                    background: 'hsl(var(--primary) / 0.12)',
                    color: 'hsl(var(--primary))',
                  }}
                >
                  {getInitials(u.name || u.email)}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-foreground truncate'>
                  {u.name ?? 'Unnamed user'}
                </p>
                <div className='flex items-center gap-2 mt-0.5'>
                  <p className='text-xs text-muted-foreground truncate'>
                    {u.email}
                  </p>
                  <span className='text-muted-foreground/30'>·</span>
                  <Badge
                    variant='secondary'
                    className='text-[10px] px-1.5 py-0 h-4 capitalize'
                  >
                    {u.role ?? 'user'}
                  </Badge>
                </div>
              </div>

              <div className='flex items-center gap-2 shrink-0'>
                <p className='text-xs text-muted-foreground hidden sm:block'>
                  {formatDate(u.createdAt)}
                </p>
                <DeleteDialog
                  label={u.name ?? u.email}
                  onConfirm={() => deleteUser(u._id)}
                >
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                  </Button>
                </DeleteDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

// ── Services Table ────────────────────────────────────────────────────────────

function ServicesSection() {
  const { data, isLoading, refetch } = useGetAdminServicesQuery()
  const [deleteService] = useDeleteServiceMutation()
  const [search, setSearch] = useState('')

  const services = data ?? []
  const filtered = services.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.business?.businessName?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Section
      title='Services'
      icon={Package}
      count={services.length}
      action={
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7'
          onClick={refetch}
        >
          <RefreshCw className='h-3.5 w-3.5' />
        </Button>
      }
    >
      {/* Search */}
      <div className='px-5 py-3 border-b border-border/40'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
          <Input
            placeholder='Search services…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-8 h-8 text-sm bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-input'
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <Empty message='No services found.' />
      ) : (
        <div className='divide-y divide-border/50'>
          {filtered.map((svc) => (
            <div
              key={svc._id}
              className='flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors'
            >
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 border border-border'>
                <Package className='h-4 w-4 text-primary/60' />
              </div>

              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-foreground truncate'>
                  {svc.name}
                </p>
                <div className='flex items-center gap-2 mt-0.5'>
                  {svc.business?.businessName && (
                    <p className='text-xs text-muted-foreground truncate'>
                      {svc.business.businessName}
                    </p>
                  )}
                  {svc.price != null && (
                    <>
                      <span className='text-muted-foreground/30'>·</span>
                      <p className='text-xs text-muted-foreground shrink-0'>
                        ₹{svc.price}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <DeleteDialog
                label={svc.name}
                onConfirm={() => deleteService(svc._id)}
              >
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                >
                  <Trash2 className='h-3.5 w-3.5' />
                </Button>
              </DeleteDialog>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

// ── Admin Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data: businesses } = useGetAdminBusinessesQuery()
  const { data: users } = useGetAdminUsersQuery()
  const { data: services } = useGetAdminServicesQuery()

  const pending = (businesses ?? []).filter(
    (b) => !b.isApproved && !b.isSuspended,
  ).length
  const approved = (businesses ?? []).filter((b) => b.isApproved).length
  const suspended = (businesses ?? []).filter((b) => b.isSuspended).length

  return (
    <div className='mx-auto max-w-5xl px-4 py-8 space-y-6 font-sans'>
      {/* ── Page header ── */}
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10'>
          <Shield className='h-5 w-5 text-primary' />
        </div>
        <div>
          <h1 className='text-2xl font-bold font-display tracking-tight text-foreground'>
            Admin panel
          </h1>
          <p className='text-sm text-muted-foreground font-sans'>
            Manage businesses, users, and services
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <StatCard
          label='Total businesses'
          value={businesses?.length ?? '—'}
          icon={Building2}
          iconClass='bg-primary/10 text-primary'
        />
        <StatCard
          label='Pending approval'
          value={pending}
          icon={Clock}
          iconClass='bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
          note={pending > 0 ? 'Needs your attention' : 'All caught up'}
        />
        <StatCard
          label='Total users'
          value={users?.length ?? '—'}
          icon={Users}
          iconClass='bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
        />
        <StatCard
          label='Total services'
          value={services?.length ?? '—'}
          icon={Package}
          iconClass='bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
        />
      </div>

      {/* ── Sections ── */}
      <BusinessesSection />
      <UsersSection />
      <ServicesSection />
    </div>
  )
}
