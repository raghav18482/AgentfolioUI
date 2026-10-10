import api from './client'
import type { SectorNews, SentimentResult } from '@/types'

export async function fetchPortfolioNews(period = '7d'): Promise<{ sectors: SectorNews[] }> {
  const { data } = await api.get('/api/news/portfolio', { params: { period } })
  return data
}

export async function searchNews(q: string, period = '7d', location = ''): Promise<{ articles: any[] }> {
  const { data } = await api.get('/api/news/search', { params: { q, period, location } })
  return data
}

export async function analyzeSentiment(sectors: string[]): Promise<SentimentResult> {
  const { data } = await api.post('/api/news/sentiment', { sectors })
  return data
}
