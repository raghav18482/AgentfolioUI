import api from './client'
import type { MarketBreadth, SectorMap, SectorOverview } from '@/types'

export async function fetchSectorOverview(): Promise<{ sectors: SectorOverview[] }> {
  const { data } = await api.get('/api/sectors/overview')
  return data
}

export async function fetchMarketBreadth(): Promise<MarketBreadth> {
  const { data } = await api.get('/api/sectors/breadth')
  return data
}

/** The same `data/sector_map.json` the server classifies holdings with. */
export async function fetchSectorMap(): Promise<SectorMap> {
  const { data } = await api.get<SectorMap>('/static/data/sector_map.json')
  return data
}
