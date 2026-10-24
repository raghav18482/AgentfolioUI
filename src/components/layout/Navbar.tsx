import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  ArrowLeftRight,
  BookOpen,
  Bot,
  CandlestickChart,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Newspaper,
  PieChart,
  Plug,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useLogout, useSession } from '@/hooks/useSession'
import { Logo } from '@/components/ui/Logo'

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

const appNav: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/research', label: 'Research', icon: FlaskConical },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/sectors', label: 'Sectors', icon: PieChart },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/trading', label: 'Trading', icon: CandlestickChart },
  { path: '/positions', label: 'Positions', icon: ArrowLeftRight },
  { path: '/orders', label: 'Orders', icon: ClipboardList },
  { path: '/agent', label: 'Agent', icon: Bot },
]

const publicNav: NavItem[] = [
  { path: '/setup', label: 'Setup Guide', icon: BookOpen },
  { path: '/connect', label: 'Connect MCP', icon: Plug },
  { path: '/enroll', label: 'Set Up', icon: UserPlus },
]

function desktopLinkClass({ isActive }: { isActive: boolean }) {
  return clsx(
    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-600/15 text-brand-400'
      : 'text-surface-200/70 hover:bg-surface-800/60 hover:text-white',
  )
}

function mobileLinkClass({ isActive }: { isActive: boolean }) {
  return clsx(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive ? 'bg-brand-600/15 text-brand-400' : 'text-surface-200/70 hover:text-white',
  )
}

export function Navbar() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const logout = useLogout()
  const [mobileOpen, setMobileOpen] = useState(false)

  const authenticated = session?.authenticated === true
  const items = authenticated ? appNav : publicNav

  function handleLogout() {
    setMobileOpen(false)
    logout.mutate(undefined, { onSettled: () => navigate('/') })
  }

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 border-b border-surface-800/80 bg-surface-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={authenticated ? '/dashboard' : '/'} className="shrink-0" aria-label="Agentfolio home">
          <Logo />
        </Link>

        {/* Nothing until the session resolves, so the wrong set never flashes. */}
        {!isPending && (
          <>
            <div className="hidden items-center gap-0.5 xl:flex">
              {items.map(({ path, label, icon: Icon }) => (
                <NavLink key={path} to={path} className={desktopLinkClass}>
                  {/* Ten labelled links fit at xl only without icons; they return at 2xl. */}
                  <Icon className={clsx('h-3.5 w-3.5', authenticated && 'hidden 2xl:block')} aria-hidden />
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="hidden shrink-0 items-center gap-3 xl:flex">
              {authenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-200/70 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="cursor-pointer p-2 text-surface-200 xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>

      {!isPending && mobileOpen && (
        <div
          id="mobile-nav"
          className="max-h-[70vh] overflow-y-auto border-t border-surface-800 bg-surface-950/95 px-4 py-3 backdrop-blur-xl xl:hidden"
        >
          {items.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={mobileLinkClass}>
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </NavLink>
          ))}
          {authenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Logout
            </button>
          ) : (
            <NavLink to="/login" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>
              <LogOut className="h-4 w-4 rotate-180" aria-hidden />
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}
