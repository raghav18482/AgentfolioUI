import api from './client'
import type { Account, AuthConfig, EnrollPayload, LoginPayload, Session } from '@/types'

export async function fetchSession(): Promise<Session> {
  const { data } = await api.get<Session>('/api/session/bootstrap')
  return data
}

export async function fetchAuthConfig(): Promise<AuthConfig> {
  const { data } = await api.get<AuthConfig>('/api/auth/config')
  return data
}

type SignedIn = Account & { ok: true }

export async function login(payload: LoginPayload): Promise<SignedIn> {
  const { data } = await api.post<SignedIn>('/api/auth/login', payload)
  return data
}

/** Registration. Broker fields are optional, all or none; without them the account starts at `not_connected`. */
export async function enroll(payload: EnrollPayload): Promise<SignedIn> {
  const { data } = await api.post<SignedIn>('/api/auth/enroll', payload)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout')
}
