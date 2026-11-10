import api from './client'
import type { BrokerCredentials, BrokerageStatusInfo, Feature } from '@/types'

type ConnectResult = BrokerageStatusInfo & { ok: true; available_features: Feature[] }

export async function fetchBrokerageStatus(): Promise<BrokerageStatusInfo> {
  const { data } = await api.get<BrokerageStatusInfo>('/api/brokerage/status')
  return data
}

/** Angel One verifies the credentials before anything is stored; a rejection stores nothing. */
export async function connectBrokerage(credentials: BrokerCredentials): Promise<ConnectResult> {
  const { data } = await api.post<ConnectResult>('/api/brokerage/register', credentials)
  return data
}

/** Wipes the stored credentials. The account and learning progress stay. */
export async function disconnectBrokerage(): Promise<ConnectResult> {
  const { data } = await api.post<ConnectResult>('/api/brokerage/disconnect')
  return data
}
