import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useSession } from '@/hooks/useSession'

/** Signed-in pages. Anonymous visitors go to `/login`, which sends them back here after. */
export function ProtectedRoute() {
  const location = useLocation()
  const { data, isPending, isError, isFetching, refetch } = useSession()

  if (isPending) return <Spinner size="lg" />

  if (isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <Alert
          variant="error"
          title="Could not reach the server"
          action={
            <Button size="sm" variant="secondary" loading={isFetching} onClick={() => refetch()}>
              Try again
            </Button>
          }
        >
          Your session could not be checked. This is usually a dropped connection.
        </Alert>
      </div>
    )
  }

  if (!data.authenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
