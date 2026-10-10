import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { useSession } from '@/hooks/useSession'

/**
 * The landing page and the sign-in forms. Someone already signed in has no use
 * for them: they go to the page that sent them to log in, or the dashboard.
 *
 * Signing in only invalidates the session query; this redirect is what moves
 * the user on, so the forms never navigate themselves and there is one path.
 */
export function GuestOnlyRoute() {
  const location = useLocation()
  const { data, isPending } = useSession()

  if (isPending) return <Spinner size="lg" />

  if (data?.authenticated) {
    const from = (location.state as { from?: Location } | null)?.from
    const target = from ? `${from.pathname}${from.search}${from.hash}` : '/dashboard'
    return <Navigate to={target} replace />
  }
  return <Outlet />
}
