import api from './client'
import type {
  BenchmarkComparison,
  Candle,
  Order,
  PortfolioResponse,
  Position,
  PredictionResult,
  Trade,
} from '@/types'

export async function fetchPortfolio(): Promise<PortfolioResponse> {
  const { data } = await api.get<PortfolioResponse>('/api/portfolio/analytics')
  return data
}

export async function fetchPositions(): Promise<{ positions: Position[]; total_pnl: number }> {
  const { data } = await api.get('/api/portfolio/positions')
  return data
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get<{ orders: Order[] }>('/api/portfolio/orders')
  return data.orders
}

export async function fetchTrades(): Promise<Trade[]> {
  const { data } = await api.get<{ trades: Trade[] }>('/api/portfolio/trades')
  return data.trades
}

/** Portfolio vs NIFTY 50 over `days`. Slow: the server fetches history per holding. */
export async function fetchBenchmark(days = 90): Promise<BenchmarkComparison> {
  const { data } = await api.get<BenchmarkComparison>('/api/portfolio/beta', { params: { days } })
  return data
}

/** Daily bars as the broker sends them, oldest first. */
export async function fetchCandleSeries(symbol: string, days = 90): Promise<Candle[]> {
  const { data } = await api.get<{ candles?: Candle[] }>('/api/portfolio/candles', {
    params: { symbol, exchange: 'NSE', interval: 'ONE_DAY', days },
  })
  return data.candles ?? []
}

/**
 * Direction forecast over three horizons. The server answers "not enough history"
 * as a 200 with an `error` field, so that is turned into a thrown error here.
 */
export async function fetchPrediction(symbol: string, exchange = 'NSE', days = 365): Promise<PredictionResult> {
  const { data } = await api.get<PredictionResult & { error?: string }>('/api/portfolio/predict', {
    params: { symbol, exchange, days },
  })
  if (data.error) throw new Error(data.error)
  return data
}
