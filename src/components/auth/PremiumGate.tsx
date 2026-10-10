import type { ReactNode } from 'react'
import { useCurrentUser } from '@/hooks/useSession'

interface PremiumGateProps {
  children: ReactNode
  /** Shown instead of `children` to users without an active premium registration. */
  fallback: ReactNode
}

/**
 * Renders premium-only UI for registered users and `fallback` for everyone else.
 *
 * Branching here, before any child mounts, matters: premium endpoints answer
 * 403 for everyone else, and a query that was never going to succeed should not
 * be fired just to render its failure.
 */
export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const user = useCurrentUser()
  return <>{user?.premium.registered ? children : fallback}</>
}
