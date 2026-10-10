import api from './client'
import type { AuthConfig, EnrollPayload, LoginPayload, Session } from '@/types'

export async function fetchSession(): Promise<Session> {
  const { data } = await api.get<Session>('/api/session/bootstrap')
  return data
}

export async function fetchAuthConfig(): Promise<AuthConfig> {
  const { data } = await api.get<AuthConfig>('/api/auth/config')
  return data
}

export async function login(payload: LoginPayload): Promise<{ client_id: string }> {
  const { data } = await api.post<{ ok: true; client_id: string }>('/api/auth/login', payload)
  return data
}

export async function enroll(payload: EnrollPayload): Promise<{ client_id: string }> {
  const { data } = await api.post<{ ok: true; client_id: string }>('/api/auth/enroll', payload)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout')
}
