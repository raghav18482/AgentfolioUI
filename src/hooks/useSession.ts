import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { enroll, fetchAuthConfig, fetchSession, login, logout } from '@/api/auth'
import type { PremiumStatus, Session } from '@/types'

export const sessionQueryKey = ['session'] as const

/**
 * Who is signed in. The single source of truth for route guards, the nav, the
 * premium gate and the AI-key passphrase — server state, so it lives in the
 * query cache rather than a parallel client store.
 */
export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
    staleTime: Infinity,
    retry: 1,
  })
}

/** The signed-in user, or `null` while anonymous or still loading. */
export function useCurrentUser(): { clientId: string; premium: PremiumStatus } | null {
  const { data } = useSession()
  return data?.authenticated ? { clientId: data.client_id, premium: data.premium } : null
}

/** Countries, default dial code and password rule. Static for the server's lifetime. */
export function useAuthConfig() {
  return useQuery({
    queryKey: ['auth-config'],
    queryFn: fetchAuthConfig,
    staleTime: Infinity,
  })
}

/** Login and enrollment both end signed in; resolve only once the session says so. */
function useSignIn<T>(mutationFn: (payload: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
  })
}

export const useLogin = () => useSignIn(login)
export const useEnroll = () => useSignIn(enroll)

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Drop every cached response, not just the session: the next person to
      // sign in on this browser must never glimpse the previous portfolio.
      queryClient.clear()
      queryClient.setQueryData<Session>(sessionQueryKey, { authenticated: false })
    },
  })
}
