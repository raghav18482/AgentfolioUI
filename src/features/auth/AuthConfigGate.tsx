import type { ReactNode } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthConfig } from '@/hooks/useSession'
import type { AuthConfig } from '@/types'

interface AuthConfigGateProps {
  children: (config: AuthConfig) => ReactNode
}

/**
 * Holds a phone-number form back until the country list has loaded, so the
 * form never renders with an empty dial-code dropdown.
 */
export function AuthConfigGate({ children }: AuthConfigGateProps) {
  const config = useAuthConfig()

  if (config.isPending) return <Spinner />
  if (config.isError) {
    return (
      <Alert
        variant="error"
        title="Could not load the form"
        action={
          <Button size="sm" variant="secondary" loading={config.isFetching} onClick={() => config.refetch()}>
            Retry
          </Button>
        }
      >
        {config.error.message}
      </Alert>
    )
  }
  return <>{children(config.data)}</>
}
