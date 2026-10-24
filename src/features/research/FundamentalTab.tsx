import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChartCard } from '@/components/charts/ChartCard'
import { EChart } from '@/components/charts/EChart'
import { financialsTrendOption } from '@/components/charts/options/financialsTrend'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFundamental } from '@/hooks/useResearch'
import type { FundamentalData, ScoreMetric } from '@/types'
import { formatCompactInr, formatNum } from '@/utils/format'
import { AiSummaryCard } from './AiSummaryCard'
import { MetricList, type MetricItem } from './MetricList'
import { ScoreCard } from './ScoreCard'

const dash = '—'
const num = (v: number | null | undefined) => (v == null ? dash : formatNum(v))
const pct = (v: number | null | undefined) => (v == null ? dash : `${v}%`)

function valuationItems(v: FundamentalData['valuation']): MetricItem[] {
  return [
    { key: 'pe_ratio', label: 'P/E Ratio', value: num(v.pe_ratio), sub: v.forward_pe ? `Forward: ${formatNum(v.forward_pe)}` : undefined },
    { key: 'pb_ratio', label: 'P/B Ratio', value: num(v.pb_ratio) },
    { key: 'ev_ebitda', label: 'EV/EBITDA', value: num(v.ev_ebitda) },
    { key: 'peg_ratio', label: 'PEG Ratio', value: num(v.peg_ratio) },
    { key: 'dividend_yield', label: 'Dividend Yield', value: pct(v.dividend_yield) },
    { key: 'trailing_eps', label: 'Trailing EPS', value: num(v.trailing_eps) },
  ]
}

function healthItems(h: FundamentalData['health']): MetricItem[] {
  return [
    { key: 'roe', label: 'ROE', value: pct(h.roe) },
    { key: 'roce', label: 'ROCE', value: pct(h.roce) },
    { key: 'debt_to_equity', label: 'Debt to Equity', value: num(h.debt_to_equity) },
    { key: 'free_cash_flow', label: 'Free Cash Flow', value: h.free_cash_flow == null ? dash : formatCompactInr(h.free_cash_flow) },
    { key: 'profit_margin', label: 'Profit Margin', value: pct(h.profit_margin) },
    { key: 'operating_margin', label: 'Operating Margin', value: pct(h.operating_margin) },
    { key: 'revenue_growth', label: 'Revenue Growth', value: pct(h.revenue_growth) },
    { key: 'earnings_growth', label: 'Earnings Growth', value: pct(h.earnings_growth) },
    { key: 'promoter_holding', label: 'Promoter Holding', value: pct(h.promoter_holding) },
  ]
}

const CHART_HEIGHT = 340

export function FundamentalTab({ symbol }: { symbol: string }) {
  const { data, isPending, isError, error } = useFundamental(symbol)

  if (isPending) {
    return (
      <div className="space-y-6" aria-busy>
        <Skeleton height={260} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton height={300} />
          <Skeleton height={300} />
        </div>
      </div>
    )
  }
  if (isError) return <Alert variant="error">{error.message}</Alert>

  return <FundamentalContent symbol={symbol} data={data} />
}

function FundamentalContent({ symbol, data }: { symbol: string; data: FundamentalData }) {
  // Flattened once so each metric row finds its verdict without walking the pillars.
  const verdicts = useMemo(() => {
    const out: Record<string, ScoreMetric> = {}
    for (const pillar of data.score?.pillars ?? []) for (const m of pillar.metrics) out[m.key] = m
    return out
  }, [data.score])

  const option = useMemo(
    () => financialsTrendOption(data.revenue_trend ?? [], data.profit_trend ?? []),
    [data.revenue_trend, data.profit_trend],
  )
  const noTrend = !data.revenue_trend?.length && !data.profit_trend?.length

  return (
    <div className="space-y-6">
      <ScoreCard score={data.score} />
      <AiSummaryCard symbol={symbol} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold text-white">Valuation Metrics</h2>
          <p className="mb-2 mt-0.5 text-xs text-surface-200/50">
            Tap any <span className="font-serif italic">i</span> to see what the metric means and its ideal range.
          </p>
          <MetricList items={valuationItems(data.valuation ?? {})} verdicts={verdicts} />
        </Card>
        <Card>
          <h2 className="text-base font-semibold text-white">Financial Health</h2>
          <p className="mb-2 mt-0.5 text-xs text-surface-200/50">
            New to these? Start with the{' '}
            <Link to="/learn/metrics" className="text-brand-400 hover:underline">
              metrics guide
            </Link>
            .
          </p>
          <MetricList items={healthItems(data.health ?? {})} verdicts={verdicts} />
        </Card>
      </div>

      <ChartCard
        title="Revenue & Profit Trend"
        tag="Annual financials from Yahoo Finance"
        height={CHART_HEIGHT}
        empty={noTrend ? 'No financial trend data available' : null}
      >
        <EChart option={option} height={CHART_HEIGHT} ariaLabel="Annual revenue as bars and net profit as a line" />
      </ChartCard>
    </div>
  )
}
