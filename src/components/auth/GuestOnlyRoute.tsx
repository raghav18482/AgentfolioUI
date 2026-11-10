import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { useSession } from '@/hooks/useSession'
import { homePath } from '@/lib/brokerage'

/**
 * The landing page and the sign-in forms. Someone already signed in has no use
 * for them: they go to the page that sent them to log in, or the dashboard.
 *
 * Signing in only invalidates the session query; this redirect is what moves
 * the user on, so the forms never navigate themselves and there is one path.
 * With no page to return to, a user with a connected broker lands on the
 * dashboard and anyone else on learning, the part open to them.
 */
export function GuestOnlyRoute() {
  const location = useLocation()
  const { data, isPending } = useSession()

  if (isPending) return <Spinner size="lg" />

  if (data?.authenticated) {
    const from = (location.state as { from?: Location } | null)?.from
    const target = from ? `${from.pathname}${from.search}${from.hash}` : homePath(data)
    return <Navigate to={target} replace />
  }
  return <Outlet />
}
