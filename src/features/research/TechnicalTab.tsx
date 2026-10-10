import { clsx } from 'clsx'
import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { macdOption } from '@/components/charts/options/macd'
import { priceDmaOption } from '@/components/charts/options/priceDma'
import { rsiOption } from '@/components/charts/options/rsi'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTechnical } from '@/hooks/useResearch'
import type { TechnicalData, TechnicalSignal } from '@/types'
import { formatNum } from '@/utils/format'
import { MetricList, type MetricItem } from './MetricList'

const dash = '—'
const rupees = (v: number | null) => (v == null ? dash : `₹${formatNum(v)}`)
const num = (v: number | null, d = 2) => (v == null ? dash : formatNum(v, d))

function indicatorItems(i: TechnicalData['indicators']): MetricItem[] {
  return [
    { label: '50 DMA', value: rupees(i.sma_50) },
    { label: '200 DMA', value: rupees(i.sma_200) },
    { label: 'RSI (14)', value: num(i.rsi, 1) },
    { label: 'MACD', value: num(i.macd) },
    { label: 'MACD Signal', value: num(i.macd_signal) },
    { label: '52W High', value: rupees(i.week52_high) },
    { label: '52W Low', value: rupees(i.week52_low) },
    { label: '52W Position', value: i.week52_position == null ? dash : `${i.week52_position}%` },
    { label: 'Volume vs Avg', value: i.volume_ratio == null ? dash : `${i.volume_ratio}x` },
  ]
}

export function TechnicalTab({ symbol }: { symbol: string }) {
  const { data, isPending, isError, error } = useTechnical(symbol)

  if (isPending) {
    return (
      <div className="space-y-6" aria-busy>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton height={340} />
          <Skeleton height={340} />
        </div>
        <Skeleton height={500} />
      </div>
    )
  }
  if (isError) return <Alert variant="error">{error.message}</Alert>

  return <TechnicalContent data={data} />
}

function TechnicalContent({ data }: { data: TechnicalData }) {
  const cd = data.chart_data
  const hasPrice = !!cd?.dates?.length
  const hasRsi = !!cd?.rsi?.length
  const hasMacd = !!cd?.macd_line?.length

  const price = useMemo(() => (hasPrice ? priceDmaOption(cd, data.avg_price) : null), [cd, data.avg_price, hasPrice])
  const rsi = useMemo(() => (hasRsi ? rsiOption(cd) : null), [cd, hasRsi])
  const macd = useMemo(() => (hasMacd ? macdOption(cd) : null), [cd, hasMacd])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-base font-semibold text-white">Key Indicators</h2>
          <MetricList items={indicatorItems(data.indicators)} />
        </Card>
        <Card>
          <h2 className="mb-3 text-base font-semibold text-white">Signal Summary</h2>
          <SignalList signals={data.signals} />
        </Card>
      </div>

      <SupportResistance levels={data.support_resistance} price={data.current_price} />

      <ChartCard
        title="Price Chart"
        tag="Candlestick • 50 DMA (blue) • 200 DMA (orange) • Volume"
        height={500}
        empty={price ? null : 'No price data available'}
      >
        {price && <EChart option={price} height={500} ariaLabel="Candlestick price chart with 50 and 200 day moving averages and volume" />}
      </ChartCard>
      <ChartCard
        title="RSI (14)"
        tag="Above 70 = Overbought • Below 30 = Oversold"
        height={280}
        empty={rsi ? null : 'Not enough data for RSI'}
      >
        {rsi && <EChart option={rsi} height={280} ariaLabel="Relative strength index over the past year, with overbought and oversold bands" />}
      </ChartCard>
      <ChartCard
        title="MACD"
        tag="MACD line (blue) • Signal line (orange) • Histogram"
        height={300}
        empty={macd ? null : 'Not enough data for MACD'}
      >
        {macd && <EChart option={macd} height={300} ariaLabel="MACD line, signal line and histogram over the past year" />}
      </ChartCard>
    </div>
  )
}

const SIGNAL_STYLE = {
  bullish: { icon: '▲', row: 'border-emerald-500/20 bg-emerald-500/5', text: 'text-emerald-400' },
  bearish: { icon: '▼', row: 'border-rose-500/20 bg-rose-500/5', text: 'text-rose-400' },
  neutral: { icon: '●', row: 'border-surface-800 bg-surface-800/30', text: 'text-surface-200/60' },
} as const

function SignalList({ signals }: { signals: TechnicalSignal[] }) {
  if (!signals.length) return <p className="text-sm text-surface-200/50">No signals available.</p>
  return (
    <ul className="space-y-2">
      {signals.map((s) => {
        const style = SIGNAL_STYLE[s.status] ?? SIGNAL_STYLE.neutral
        return (
          <li key={s.name} className={clsx('flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-lg border px-3 py-2 text-sm', style.row)}>
            <span className={style.text} aria-label={s.status}>
              {style.icon}
            </span>
            <span className="font-medium text-white">{s.name}</span>
            <span className="text-surface-200/70">{s.value}</span>
            <span className={clsx('ml-auto text-xs font-medium', style.text)}>{s.label}</span>
          </li>
        )
      })}
    </ul>
  )
}

const LEVELS = [
  { key: 'r2', label: 'R2', tone: 'text-emerald-400' },
  { key: 'r1', label: 'R1', tone: 'text-emerald-400' },
  { key: 'pivot', label: 'Pivot', tone: 'text-brand-400' },
  { key: 's1', label: 'S1', tone: 'text-rose-400' },
  { key: 's2', label: 'S2', tone: 'text-rose-400' },
] as const

function SupportResistance({ levels, price }: { levels: TechnicalData['support_resistance']; price: number }) {
  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-white">Support & Resistance (Pivot Points)</h2>
      {levels.pivot == null ? (
        <p className="text-sm text-surface-200/50">Not enough data for pivot points.</p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2 text-center">
            {LEVELS.map((l) => (
              <div key={l.key} className="rounded-lg border border-surface-800 bg-surface-800/30 px-1 py-2.5">
                <p className="text-[11px] uppercase tracking-wider text-surface-200/50">{l.label}</p>
                <p className={clsx('mt-0.5 text-sm font-semibold', l.tone)}>{rupees(levels[l.key])}</p>
              </div>
            ))}
          </div>
          {price > 0 && <p className="mt-3 text-center text-xs text-surface-200/55">Current Price: {rupees(price)}</p>}
        </>
      )}
    </Card>
  )
}
