import { Activity, BarChart3, IndianRupee, Landmark, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { formatCurrency, formatPct, parseAmount } from '@/utils/format'
import type { PortfolioFunds, PortfolioSummary } from '@/types'

interface PortfolioStatsProps {
  summary: PortfolioSummary
  funds: PortfolioFunds
}

/** "—" rather than ₹0 when the broker call behind a figure failed. */
function money(n: number | null | undefined): string {
  return n == null ? '—' : formatCurrency(n)
}

function trendOf(n: number | null | undefined): 'up' | 'down' | undefined {
  if (n == null) return undefined
  return n >= 0 ? 'up' : 'down'
}

export function PortfolioStats({ summary, funds }: PortfolioStatsProps) {
  // Absent when there are no open positions today, which is a real ₹0.
  const dayPnl = summary.day_pnl ?? 0
  const overallTrend = trendOf(summary.overall_pnl)

  return (
    <div className="grid animate-slide-up gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total Investment" value={money(summary.total_invested)} icon={<Wallet className="h-4 w-4" />} />
      <StatCard label="Current Value" value={money(summary.current_value)} icon={<BarChart3 className="h-4 w-4" />} />
      <StatCard
        label="Overall P&L"
        value={money(summary.overall_pnl)}
        subValue={summary.overall_pnl_pct != null ? formatPct(summary.overall_pnl_pct) : undefined}
        trend={overallTrend}
        icon={overallTrend === 'down' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
      />
      <StatCard label="Day P&L" value={money(dayPnl)} trend={trendOf(dayPnl)} icon={<Activity className="h-4 w-4" />} />
      <StatCard
        label="Available Cash"
        value={money(parseAmount(funds.available_cash))}
        icon={<IndianRupee className="h-4 w-4" />}
      />
      <StatCard label="Net Value" value={money(parseAmount(funds.net))} icon={<Landmark className="h-4 w-4" />} />
    </div>
  )
}
