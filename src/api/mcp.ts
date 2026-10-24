import api from './client'
import type { CreatedMcpToken, McpToken, OAuthConnection } from '@/types'

export async function listMcpTokens(): Promise<McpToken[]> {
  const { data } = await api.get<{ tokens: McpToken[] }>('/api/mcp/tokens')
  return data.tokens
}

/** Needs the app password again, so a stolen session cookie cannot mint a long-lived token. */
export async function createMcpToken(payload: {
  name: string
  ttl_days: number
  app_password: string
}): Promise<CreatedMcpToken> {
  const { data } = await api.post<CreatedMcpToken>('/api/mcp/tokens', payload)
  return data
}

export async function revokeMcpToken(id: number): Promise<void> {
  await api.delete(`/api/mcp/tokens/${id}`)
}

export async function listOAuthConnections(): Promise<OAuthConnection[]> {
  const { data } = await api.get<{ connections: OAuthConnection[] }>('/api/oauth/connections')
  return data.connections
}

export async function revokeOAuthConnection(id: number): Promise<void> {
  await api.delete(`/api/oauth/connections/${id}`)
}
