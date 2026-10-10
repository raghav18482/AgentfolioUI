import api from './client'
import type { AiCredentials, FundamentalSummary } from '@/types'

export async function fetchInsights(credentials: AiCredentials): Promise<string> {
  const { data } = await api.post<{ insight: string }>('/api/ai/insights', credentials)
  return data.insight
}

export async function askPortfolio(question: string, credentials: AiCredentials): Promise<string> {
  const { data } = await api.post<{ answer: string }>('/api/ai/ask', { ...credentials, question })
  return data.answer
}

/**
 * Generated with the deployment's own OpenRouter key, so no credentials are sent.
 * `refresh` asks the server to skip its cache (rate-limited there).
 */
export async function fetchFundamentalSummary(symbol: string, refresh: boolean): Promise<FundamentalSummary> {
  const { data } = await api.post<FundamentalSummary>('/api/research/fundamental/summary', { symbol, refresh })
  return data
}
