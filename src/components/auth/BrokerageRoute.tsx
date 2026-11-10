import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { isBrokerageConnected } from '@/lib/brokerage'

/**
 * Pages that read the user's Angel One account. Nested inside `ProtectedRoute`,
 * so the session is known and signed in here; without a connected broker the
 * user goes to connect one, and comes back here afterwards.
 *
 * The server enforces the same rule on every endpoint (403); this only keeps
 * the pages from firing requests that were never going to succeed.
 */
export function BrokerageRoute() {
  const location = useLocation()
  const { data } = useSession()
  if (!isBrokerageConnected(data)) {
    return <Navigate to="/connect-brokerage" replace state={{ from: location }} />
  }
  return <Outlet />
}
