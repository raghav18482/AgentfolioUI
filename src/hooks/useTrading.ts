import { useQuery } from '@tanstack/react-query'
import { getBriefingLogs, getBriefingSchedule, getProposals, getRiskProfile } from '@/api/trading'

export function useRiskProfile() {
  return useQuery({ queryKey: ['risk-profile'], queryFn: getRiskProfile })
}

/** Polled: the agent creates proposals mid-conversation, and they expire. */
export function useProposals() {
  return useQuery({ queryKey: ['proposals'], queryFn: getProposals, refetchInterval: 8_000 })
}

export function useBriefingSchedule() {
  return useQuery({ queryKey: ['briefing-schedule'], queryFn: getBriefingSchedule })
}

export function useBriefingLogs() {
  return useQuery({ queryKey: ['briefing-logs'], queryFn: getBriefingLogs })
}
