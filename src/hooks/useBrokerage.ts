import { useMutation, useQueryClient } from '@tanstack/react-query'
import { connectBrokerage, disconnectBrokerage } from '@/api/brokerage'
import { sessionQueryKey } from '@/hooks/useSession'

/** Server state that holds no broker data and survives a broker change. */
const KEEP_ON_BROKER_CHANGE = new Set(['session', 'auth-config'])

/** Link Angel One. Resolves once the session reports the new status. */
export function useConnectBrokerage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: connectBrokerage,
    // A failed attempt can change the status too (to `failed`), so re-read either way.
    onSettled: () => queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
  })
}

/** Unlink Angel One, and forget every cached response that came from it. */
export function useDisconnectBrokerage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disconnectBrokerage,
    onSuccess: async () => {
      queryClient.removeQueries({
        predicate: (q) => !KEEP_ON_BROKER_CHANGE.has(String(q.queryKey[0])),
      })
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    },
  })
}
