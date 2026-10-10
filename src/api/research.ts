import api from './client'
import type { FundamentalData, Glossary, TechnicalData } from '@/types'

export async function fetchFundamental(symbol: string): Promise<FundamentalData> {
  const { data } = await api.get<FundamentalData>('/api/research/fundamental', { params: { symbol } })
  return data
}

export async function fetchTechnical(symbol: string, exchange = 'NSE', days = 365): Promise<TechnicalData> {
  const { data } = await api.get<TechnicalData>('/api/research/technical', { params: { symbol, exchange, days } })
  return data
}

/** What each metric means and where "good" starts. A static file, shared with the Learn page. */
export async function fetchGlossary(): Promise<Glossary> {
  const { data } = await api.get<Glossary>('/static/data/metric_glossary.json')
  return data
}
