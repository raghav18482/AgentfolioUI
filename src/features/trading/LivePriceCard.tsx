import { useCallback, useMemo, useRef, useState, type FormEvent } from 'react'
import { clsx } from 'clsx'
import type { ECharts } from 'echarts/core'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import {
  applyTick,
  candleDataUpdate,
  candlestickOption,
  toCandleSeries,
  type CandleSeries,
} from '@/components/charts/options/candlestick'
import { Button } from '@/components/ui/Button'
import { useEventSource } from '@/hooks/useEventSource'
import { useCandles, usePortfolio } from '@/hooks/usePortfolio'
import { displaySymbol, formatCurrency, signedPct } from '@/utils/format'
import type { MarketTick } from '@/types'

const HEIGHT = 480
const DAYS = 90

const fieldClass =
  'rounded-xl border border-surface-700 bg-surface-800/60 px-3 py-2 text-sm text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30'

function streamUrl(symbol: string, token?: string): string {
  const params = new URLSearchParams({ symbols: symbol })
  if (token && /^\d+$/.test(token)) params.set('tokens', token)
  return `/api/market/stream?${params}`
}

export function LivePriceCard() {
  const portfolio = usePortfolio()
  const holdings = useMemo(
    () => [...(portfolio.data?.holdings ?? [])].sort((a, b) => b.current - a.current),
    [portfolio.data],
  )

  const [chosen, setChosen] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const symbol = chosen ?? holdings[0]?.symbol ?? null
  const holding = holdings.find((h) => h.symbol === symbol)

  const candles = useCandles(symbol, DAYS)

  const series = useMemo(() => (candles.data?.length ? toCandleSeries(candles.data) : null), [candles.data])
  const option = useMemo(
    () => (series ? candlestickOption(series, { avgBuyPrice: holding?.avg_price, zoomStart: 50 }) : null),
    [series, holding?.avg_price],
  )
  const lastClose = series ? series.ohlc[series.ohlc.length - 1][1] : null

  // Ticks go straight to the chart instance. Routing them through state would
  // rebuild the option and redraw the whole chart every second.
  const chartRef = useRef<ECharts | null>(null)
  const liveRef = useRef<{ base: CandleSeries; current: CandleSeries } | null>(null)
  const [tick, setTick] = useState<{ symbol: string; ltp: number } | null>(null)

  const onTick = useCallback(
    (payload: unknown) => {
      const ltp = (payload as MarketTick).ltp
      if (!symbol || !series || !(ltp > 0)) return
      if (liveRef.current?.base !== series) liveRef.current = { base: series, current: series }
      liveRef.current.current = applyTick(liveRef.current.current, ltp)
      chartRef.current?.setOption(candleDataUpdate(liveRef.current.current))
      setTick({ symbol, ltp })
    },
    [symbol, series],
  )

  // The feed starts once history is drawn, as the price label needs a base.
  const status = useEventSource(symbol && series ? streamUrl(symbol, holding?.symboltoken) : null, { tick: onTick })

  const ltp = tick?.symbol === symbol ? tick.ltp : lastClose
  const change = ltp !== null && lastClose ? ltp - lastClose : null

  function loadTyped(e: FormEvent) {
    e.preventDefault()
    const value = typed.trim().toUpperCase()
    if (value) setChosen(value)
  }

  const selectValue = holding ? holding.symbol : ''

  return (
    <ChartCard
      title="Live Price"
      height={HEIGHT}
      loading={portfolio.isPending || (symbol !== null && candles.isPending)}
      error={
        candles.isError
          ? candles.error.message
          : portfolio.isError
            ? `Could not load holdings: ${portfolio.error.message}`
            : null
      }
      empty={symbol === null ? 'No holdings found. Type a symbol above to load a chart.' : !series ? `No candle data for ${symbol}` : null}
      actions={
        <form onSubmit={loadTyped} className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Holding"
            value={selectValue}
            onChange={(e) => {
              if (e.target.value) {
                setChosen(e.target.value)
                setTyped('')
              }
            }}
            className={clsx(fieldClass, 'min-w-[12rem] cursor-pointer')}
          >
            {!holding && <option value="">{holdings.length ? 'Select a stock…' : 'No holdings found'}</option>}
            {holdings.map((h) => (
              <option key={h.symbol} value={h.symbol}>
                {displaySymbol(h.symbol)} {formatCurrency(h.ltp)} ({signedPct(h.pnl_pct, 1)})
              </option>
            ))}
          </select>
          <span className="text-xs text-surface-200/45">or</span>
          <input
            aria-label="Any NSE symbol"
            placeholder="e.g. RELIANCE"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className={clsx(fieldClass, 'w-32 uppercase placeholder:normal-case')}
          />
          <Button type="submit" size="sm" disabled={!typed.trim()}>
            Load
          </Button>
        </form>
      }
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <span className="text-sm font-semibold text-surface-200/80">{symbol && displaySymbol(symbol)}</span>
        <span className="font-display text-2xl font-bold tabular-nums text-white" aria-live="polite">
          {ltp !== null ? formatCurrency(ltp) : '--'}
        </span>
        {change !== null && lastClose ? (
          <span className={clsx('text-sm font-medium tabular-nums', change >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
            {change >= 0 ? '+' : ''}
            {change.toFixed(2)} ({signedPct((change / lastClose) * 100)})
          </span>
        ) : null}
        <span
          className={clsx(
            'ml-auto inline-flex items-center gap-1.5 text-[11px]',
            status === 'open' ? 'text-emerald-400' : status === 'closed' ? 'text-rose-400' : 'text-surface-200/45',
          )}
        >
          <span
            aria-hidden
            className={clsx(
              'h-1.5 w-1.5 rounded-full',
              status === 'open' ? 'animate-pulse bg-emerald-400' : status === 'closed' ? 'bg-rose-400' : 'bg-surface-200/40',
            )}
          />
          {status === 'open' ? 'Live' : status === 'closed' ? 'Live feed unavailable' : 'Connecting…'}
        </span>
      </div>
      {option && (
        <EChart
          option={option}
          height={HEIGHT}
          onReady={(chart) => {
            chartRef.current = chart
          }}
          ariaLabel={`Daily candlestick chart of ${symbol ? displaySymbol(symbol) : 'the selected stock'} with live price`}
        />
      )}
    </ChartCard>
  )
}
