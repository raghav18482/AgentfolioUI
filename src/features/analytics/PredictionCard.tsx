import { clsx } from 'clsx'
import { RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import { EChart } from '@/components/charts/EChart'
import { predictionBarsOption } from '@/components/charts/options/predictionBars'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { directionOf, engineLabel, HORIZONS, needsCalibrationNotice } from '@/lib/prediction'
import { usePrediction } from '@/hooks/usePortfolio'
import type { PredictionResult, PredictionSignal } from '@/types'
import { displaySymbol } from '@/utils/format'

const TONE = {
  bullish: { text: 'text-emerald-400', bar: 'bg-emerald-500', icon: '▲' },
  bearish: { text: 'text-rose-400', bar: 'bg-rose-500', icon: '▼' },
  neutral: { text: 'text-amber-400', bar: 'bg-amber-500', icon: '●' },
} as const

const DEFAULT_DISCLAIMER = 'Confidence shown is not a calibrated probability.'

export function PredictionCard({ symbol }: { symbol: string }) {
  const prediction = usePrediction(symbol)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">AI Price Prediction</h2>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-surface-200/45">Multi-timeframe direction forecast</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void prediction.refetch()}
            disabled={prediction.isFetching}
            aria-label="Refresh prediction"
          >
            <RefreshCw className={clsx('h-3.5 w-3.5', prediction.isFetching && 'animate-spin')} aria-hidden />
            Refresh
          </Button>
        </div>
      </div>

      <div aria-live="polite" aria-busy={prediction.isFetching}>
        {prediction.isFetching ? (
          <div className="flex flex-col items-center py-6 text-sm text-surface-200/55">
            <Spinner />
            Analyzing patterns for {displaySymbol(symbol)}…
          </div>
        ) : prediction.isError ? (
          <Alert variant="error">Prediction unavailable: {prediction.error.message}</Alert>
        ) : prediction.data ? (
          <PredictionBody data={prediction.data} />
        ) : null}
      </div>
    </Card>
  )
}

function PredictionBody({ data }: { data: PredictionResult }) {
  const outlook = directionOf(data.overall_outlook)
  const tone = TONE[outlook]
  const bars = useMemo(() => predictionBarsOption(data.predictions), [data.predictions])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-800 bg-surface-800/30 px-4 py-3">
        <div className={clsx('flex items-center gap-2.5', tone.text)}>
          <span aria-hidden className="text-lg">
            {tone.icon}
          </span>
          <span className="text-lg font-bold tracking-wide">{data.overall_outlook.toUpperCase()}</span>
          <span className="text-sm">{(data.overall_score * 100).toFixed(1)}%</span>
        </div>
        <p className="text-xs text-surface-200/60">
          {engineLabel(data)} • {displaySymbol(data.symbol)}
        </p>
      </div>

      {needsCalibrationNotice(data) && (
        <Alert variant="warning">{data.disclaimer || DEFAULT_DISCLAIMER}</Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {HORIZONS.map(({ key, label }) => {
          const p = data.predictions[key]
          if (!p) return null
          const t = TONE[directionOf(p.direction)]
          const pct = (p.confidence * 100).toFixed(0)
          return (
            <div key={key} className="rounded-xl border border-surface-800 bg-surface-800/30 p-4">
              <p className="text-xs font-medium text-surface-200/55">{label}</p>
              <p className={clsx('mt-1 flex items-center gap-1.5 text-lg font-bold', t.text)}>
                <span aria-hidden>{p.direction === 'neutral' ? '—' : p.direction === 'up' ? '▲' : '▼'}</span>
                {p.direction.toUpperCase()}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-800">
                  <div className={clsx('h-full rounded-full', t.bar)} style={{ width: `${Math.max(20, p.confidence * 100)}%` }} />
                </div>
                <span className="text-xs text-surface-200/70">{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <EChart option={bars} height={220} ariaLabel="Confidence that the price rises, for each of three time horizons" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Signals title="Bullish Signals" signals={data.top_bullish_signals} tone="good" />
          <Signals title="Bearish Signals" signals={data.top_bearish_signals} tone="bad" />
        </div>
      </div>
    </div>
  )
}

function Signals({ title, signals, tone }: { title: string; signals: PredictionSignal[]; tone: 'good' | 'bad' }) {
  const color = tone === 'good' ? 'text-emerald-400' : 'text-rose-400'
  return (
    <div>
      <p className={clsx('mb-2 text-xs font-semibold uppercase tracking-wider', color)}>{title}</p>
      {signals?.length ? (
        <ul className="space-y-1.5">
          {signals.map((s) => (
            <li key={s.feature} className="flex items-baseline justify-between gap-2 text-xs">
              <span className="text-surface-200/75">{s.feature}</span>
              <span className={color}>
                {tone === 'good' && s.value != null && s.value > 0 ? '+' : ''}
                {s.value ?? '—'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-surface-200/45">No strong signals</p>
      )}
    </div>
  )
}
