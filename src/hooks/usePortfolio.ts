import { useQuery } from '@tanstack/react-query'
import {
  fetchBenchmark,
  fetchCandleSeries,
  fetchOrders,
  fetchPortfolio,
  fetchPositions,
  fetchPrediction,
  fetchTrades,
} from '@/api/portfolio'
import { fetchSectorMap } from '@/api/sectors'

/** Holdings, totals and funds. The server caches it briefly to spare Angel One's rate limits. */
export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
  })
}

export function usePositions() {
  return useQuery({ queryKey: ['positions'], queryFn: fetchPositions })
}

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: fetchOrders })
}

export function useTrades() {
  return useQuery({ queryKey: ['trades'], queryFn: fetchTrades })
}

/** Beta and cumulative returns against NIFTY 50 — slow, so cached for five minutes. */
export function useBenchmark(days = 90) {
  return useQuery({
    queryKey: ['benchmark', days],
    queryFn: () => fetchBenchmark(days),
    staleTime: 5 * 60_000,
  })
}

/** Symbol → sector. A static file, so fetched once per visit. */
export function useSectorMap() {
  return useQuery({
    queryKey: ['sector-map'],
    queryFn: fetchSectorMap,
    staleTime: Infinity,
  })
}

/** Daily bars for one symbol. Shared by every chart that draws the same window. */
export function useCandles(symbol: string | null, days = 90) {
  return useQuery({
    queryKey: ['candles', symbol, days],
    queryFn: () => fetchCandleSeries(symbol!, days),
    enabled: symbol !== null,
  })
}

/** Direction forecast for one stock. Cached for the visit; the card's Refresh re-runs it. */
export function usePrediction(symbol: string | null) {
  return useQuery({
    queryKey: ['prediction', symbol],
    queryFn: () => fetchPrediction(symbol!),
    enabled: symbol !== null,
    staleTime: 5 * 60_000,
    retry: false,
  })
}
