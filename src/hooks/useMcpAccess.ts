import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMcpToken,
  listMcpTokens,
  listOAuthConnections,
  revokeMcpToken,
  revokeOAuthConnection,
} from '@/api/mcp'

const tokensKey = ['mcp-tokens'] as const
const connectionsKey = ['oauth-connections'] as const

/** The signed-in user's personal access tokens. Pass `enabled: false` while signed out. */
export function useMcpTokens(enabled: boolean) {
  return useQuery({ queryKey: tokensKey, queryFn: listMcpTokens, enabled })
}

export function useCreateMcpToken() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMcpToken,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tokensKey }),
  })
}

export function useRevokeMcpToken() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeMcpToken,
    onSettled: () => queryClient.invalidateQueries({ queryKey: tokensKey }),
  })
}

/** Apps connected through OAuth (claude.ai connectors and the like). */
export function useOAuthConnections(enabled: boolean) {
  return useQuery({ queryKey: connectionsKey, queryFn: listOAuthConnections, enabled })
}

export function useRevokeOAuthConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeOAuthConnection,
    onSettled: () => queryClient.invalidateQueries({ queryKey: connectionsKey }),
  })
}
