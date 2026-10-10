import { useMemo, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { benchmarkOption } from '@/components/charts/options/benchmark'
import { InfoPopover, InfoSection } from '@/components/ui/InfoPopover'
import { useBenchmark } from '@/hooks/usePortfolio'
import { displaySymbol } from '@/utils/format'
import type { BenchmarkComparison } from '@/types'

const HEIGHT = 400
const DAYS = 90

/** What each statistic means, so a beginner can read the bar. */
const EXPLAINERS = {
  beta: {
    title: 'Portfolio Beta (β)',
    desc: 'Measures how sensitive your portfolio is to market (NIFTY 50) movements. A beta of 1.0 means your portfolio moves exactly with the market.',
    ideal: 'β < 0.8 = Defensive (less volatile)\nβ ≈ 1.0 = Moves with market\nβ > 1.2 = Aggressive (more volatile)',
    tip: 'For long-term wealth building, β between 0.8–1.2 is considered balanced. Lower beta during uncertain markets helps protect capital.',
  },
  alpha: {
    title: 'Alpha (α)',
    desc: "The excess daily return your portfolio generates beyond what the market movement explains. Positive alpha = you're beating the market after adjusting for risk.",
    ideal: 'α > 0 = Outperforming the market\nα = 0 = Matching the market\nα < 0 = Underperforming',
    tip: 'Even a small positive daily alpha compounds significantly over time. Consistent α > 0.01% daily is excellent.',
  },
  r2: {
    title: 'R-Squared (R²)',
    desc: "Shows what percentage of your portfolio's movement is explained by the market. R² of 1.0 means your portfolio perfectly tracks NIFTY 50.",
    ideal: 'R² > 0.7 = Closely tracks the market\nR² 0.4–0.7 = Moderate correlation\nR² < 0.4 = Largely independent of market',
    tip: 'High R² with low beta = diversified market tracker. Low R² = your returns come from stock-specific factors, not the broad market.',
  },
} as const

type Band = 'aggressive' | 'market' | 'defensive'

function band(beta: number): Band {
  if (beta > 1.2) return 'aggressive'
  if (beta > 0.8) return 'market'
  return 'defensive'
}

const bandText: Record<Band, string> = {
  aggressive: 'text-rose-400',
  market: 'text-amber-400',
  defensive: 'text-emerald-400',
}

const bandBorder: Record<Band, string> = {
  aggressive: 'border-rose-500/50',
  market: 'border-amber-500/50',
  defensive: 'border-emerald-500/50',
}

const bandLabel: Record<Band, string> = {
  aggressive: 'High volatility',
  market: 'Moves with market',
  defensive: 'Defensive',
}

function Explainer({ which }: { which: keyof typeof EXPLAINERS }) {
  const info = EXPLAINERS[which]
  return (
    <InfoPopover title={info.title}>
      <p>{info.desc}</p>
      <InfoSection heading="Ideal values">{info.ideal}</InfoSection>
      <InfoSection heading="Pro tip">{info.tip}</InfoSection>
    </InfoPopover>
  )
}

function Stat({ label, info, children }: { label: string; info?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-w-[7rem]">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-surface-200/50">
        {label}
        {info}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function BenchmarkStats({ data }: { data: BenchmarkComparison }) {
  const portfolioBand = band(data.beta)
  return (
    <div className="mt-4 flex flex-wrap items-start gap-x-8 gap-y-4 border-t border-surface-800/60 pt-4">
      <Stat label="Portfolio Beta" info={<Explainer which="beta" />}>
        <p className={clsx('font-display text-xl font-semibold tabular-nums', bandText[portfolioBand])}>
          {data.beta.toFixed(3)}
        </p>
        <p className={clsx('text-xs', bandText[portfolioBand])}>{bandLabel[portfolioBand]}</p>
      </Stat>
      <Stat label="Alpha (daily)" info={<Explainer which="alpha" />}>
        <p className="font-display text-xl font-semibold tabular-nums text-white">
          {(data.alpha * 100).toFixed(4)}%
        </p>
      </Stat>
      <Stat label="R-squared" info={<Explainer which="r2" />}>
        <p className="font-display text-xl font-semibold tabular-nums text-white">{data.r_squared.toFixed(3)}</p>
      </Stat>
      <Stat label="Days">
        <p className="font-display text-xl font-semibold tabular-nums text-white">{data.days_used || '—'}</p>
      </Stat>
      {data.stock_betas.length > 0 && (
        <ul className="flex flex-1 flex-wrap items-center gap-2 self-center" aria-label="Beta of each top holding">
          {data.stock_betas.map((s) => {
            const b = band(s.beta)
            return (
              <li
                key={s.symbol}
                className={clsx('flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs', bandBorder[b])}
              >
                <span className="font-medium text-surface-200/80">{displaySymbol(s.symbol)}</span>
                <span className={clsx('font-semibold tabular-nums', bandText[b])}>{s.beta.toFixed(2)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function BenchmarkCard() {
  const benchmark = useBenchmark(DAYS)
  const data = benchmark.data
  const option = useMemo(() => (data ? benchmarkOption(data) : null), [data])

  return (
    <ChartCard
      title="Portfolio vs NIFTY 50"
      tag={
        <>
          Cumulative returns · <span className="text-amber-400">▬ NIFTY 50</span> ·{' '}
          <span className="text-emerald-400">▬ My Portfolio</span> · {DAYS} days
        </>
      }
      height={HEIGHT}
      loading={benchmark.isPending}
      error={benchmark.isError ? benchmark.error.message : null}
      empty={data && !data.dates.length ? 'Not enough historical data to compute beta' : null}
    >
      {option && (
        <EChart
          option={option}
          height={HEIGHT}
          ariaLabel={`Cumulative return of the portfolio and NIFTY 50 over ${DAYS} days`}
        />
      )}
      {data && <BenchmarkStats data={data} />}
    </ChartCard>
  )
}
