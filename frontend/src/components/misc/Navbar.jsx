import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  Search,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectCurrentUser } from '../../store/authSlice';
import { useLogoutMutation } from '../../services/authApi';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns up to 2 initials from a display name or email */
function getInitials(user) {
  if (!user) return '?';
  if (user.name) {
    return user.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
  return (user.email?.[0] ?? '?').toUpperCase();
}

// ---------------------------------------------------------------------------
// ProfileMenu — shown when user is logged in
// ---------------------------------------------------------------------------
function ProfileMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      // Always clear local state even if the server call fails
      dispatch(clearCredentials());
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open profile menu"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={user?.avatar ?? user?.photoURL}
              alt={user?.name ?? 'User avatar'}
            />
            <AvatarFallback
              className="text-xs font-semibold"
              style={{
                background: 'hsl(var(--primary) / 0.15)',
                color: 'hsl(var(--primary))',
              }}
            >
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          {/* Show name on md+ screens */}
          <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
            {user?.name?.split(' ')[0] ?? user?.email}
          </span>
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-1">
        {/* User info header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            {user?.name && (
              <span className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </span>
            )}
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser); // null = logged out

  const searchFromUrl = new URLSearchParams(location.search).get('q') ?? '';
  const [query, setQuery] = useState(searchFromUrl);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (query.trim()) params.set('q', query.trim());
    else params.delete('q');
    params.set('page', '1');
    navigate(`/explore?${params.toString()}`);
    setMobileOpen(false);
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md transition-shadow duration-200',
        scrolled && 'shadow-sm',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="hidden text-lg tracking-tight sm:block font-[family-name:var(--font-display)]">
            Service Base App
          </span>
        </Link>

        {/* Search bar (desktop) */}
        <form
          onSubmit={handleSearch}
          className="relative hidden flex-1 max-w-xl sm:flex items-center"
          role="search"
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search services, skills, or providers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 h-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-input"
            aria-label="Search services"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/explore">Explore</Link>
          </Button>

          {user ? (
            // ── Logged in: avatar + dropdown ──
            <div className="ml-2">
              <ProfileMenu user={user} />
            </div>
          ) : (
            // ── Logged out: sign in + CTA ──
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" className="ml-1" asChild>
                <Link to="/register">List a Service</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-4 py-4 sm:hidden space-y-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              aria-label="Search services"
            />
          </form>

          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/explore" onClick={() => setMobileOpen(false)}>
                Explore
              </Link>
            </Button>

            {user ? (
              <>
                {/* Mobile: show avatar + name inline */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.avatar ?? user?.photoURL} />
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{
                        background: 'hsl(var(--primary) / 0.15)',
                        color: 'hsl(var(--primary))',
                      }}
                    >
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    {user?.name && (
                      <span className="text-sm font-medium truncate">
                        {user.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/settings" onClick={() => setMobileOpen(false)}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-destructive hover:text-destructive"
                  onClick={async () => {
                    // reuse same logout logic
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button className="mt-1" asChild>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    List a Service
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
