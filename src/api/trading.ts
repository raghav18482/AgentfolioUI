import api from './client'
import type {
  BriefingLog,
  BriefingSchedule,
  ExecutionResult,
  RiskProfile,
  TradeProposal,
} from '@/types'

export async function getRiskProfile(): Promise<RiskProfile | null> {
  const { data } = await api.get<{ has_profile: boolean; profile?: RiskProfile }>('/api/trading/profile')
  return data.has_profile && data.profile ? data.profile : null
}

export async function saveRiskProfile(profile: RiskProfile): Promise<RiskProfile> {
  const { data } = await api.post<{ ok: true; profile: RiskProfile }>('/api/trading/profile', profile)
  return data.profile
}

/** Every proposal for this session, whatever its status. */
export async function getProposals(): Promise<TradeProposal[]> {
  const { data } = await api.get<{ proposals: TradeProposal[] }>('/api/trading/proposals')
  return data.proposals
}

/** Approve and immediately execute. Places a real order when `ok` comes back true. */
export async function approveProposal(id: string): Promise<ExecutionResult> {
  const { data } = await api.post<ExecutionResult>(`/api/trading/proposals/${encodeURIComponent(id)}/approve`)
  return data
}

export async function rejectProposal(id: string): Promise<void> {
  await api.post(`/api/trading/proposals/${encodeURIComponent(id)}/reject`)
}

export async function getBriefingSchedule(): Promise<BriefingSchedule | null> {
  const { data } = await api.get<{ exists: boolean; schedule?: BriefingSchedule }>('/api/briefing/schedule')
  return data.exists && data.schedule ? data.schedule : null
}

/** `timeIst` is `HH:MM` in India time; the server works out the next UTC run. */
export async function saveBriefingSchedule(timeIst: string, enabled: boolean): Promise<BriefingSchedule> {
  const { data } = await api.post<{ ok: true; schedule: BriefingSchedule }>('/api/briefing/schedule', {
    time_ist: timeIst,
    enabled,
  })
  return data.schedule
}

/** Disables the schedule; the row stays, so it reads back as paused. */
export async function disableBriefingSchedule(): Promise<void> {
  await api.delete('/api/briefing/schedule')
}

/** Starts a background send; the result shows up in the logs about 30 s later. */
export async function sendBriefingNow(): Promise<string> {
  const { data } = await api.post<{ ok: true; message?: string }>('/api/briefing/send-now')
  return data.message ?? 'Briefing started — check WhatsApp in ~30s'
}

export async function getBriefingLogs(): Promise<BriefingLog[]> {
  const { data } = await api.get<{ logs: BriefingLog[] }>('/api/briefing/logs')
  return data.logs
}
