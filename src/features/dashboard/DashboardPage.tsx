import { Briefcase, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { usePortfolio } from '@/hooks/usePortfolio'
import { AiAskCard } from './AiAskCard'
import { AiInsightsCard } from './AiInsightsCard'
import { AiKeyBar } from './AiKeyBar'
import { BenchmarkCard } from './BenchmarkCard'
import { CashGauge } from './CashGauge'
import { HoldingsTable } from './HoldingsTable'
import { PnlHeatmap } from './PnlHeatmap'
import { PortfolioStats } from './PortfolioStats'
import { SectorAllocation } from './SectorAllocation'
import { TopMovers } from './TopMovers'

function PortfolioOverview() {
  const portfolio = usePortfolio()

  if (portfolio.isPending) return <Spinner size="lg" />

  if (portfolio.isError) {
    return (
      <Alert
        variant="error"
        title="Could not load your portfolio"
        action={
          <Button size="sm" variant="secondary" loading={portfolio.isFetching} onClick={() => portfolio.refetch()}>
            Retry
          </Button>
        }
      >
        {portfolio.error.message}
      </Alert>
    )
  }

  const { summary, funds, holdings } = portfolio.data

  return (
    <>
      <PortfolioStats summary={summary} funds={funds} />
      {holdings.length === 0 ? (
        <Card>
          <EmptyState
            icon={Briefcase}
            title="No holdings yet"
            hint="Stocks you hold with Angel One appear here, with their charts and P&L."
          />
        </Card>
      ) : (
        <>
          <PnlHeatmap holdings={holdings} />
          <TopMovers holdings={holdings} />
          <div className="grid gap-6 lg:grid-cols-2">
            <SectorAllocation holdings={holdings} />
            <CashGauge summary={summary} funds={funds} />
          </div>
          <BenchmarkCard />
          <HoldingsTable holdings={holdings} />
        </>
      )}
    </>
  )
}

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        kicker="Live from Angel One"
        title="Portfolio dashboard"
        sub="Holdings, cash, and P&L at a glance — plus AI when you add your key."
      />

      <PortfolioOverview />

      {/* Independent of the portfolio fetch: the key can be managed even if Angel One is down. */}
      <section aria-labelledby="ai-heading" className="space-y-4 pt-2">
        <h2 id="ai-heading" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Sparkles className="h-4 w-4 text-brand-400" aria-hidden />
          AI insights
        </h2>
        <AiKeyBar />
        <AiInsightsCard />
        <AiAskCard />
      </section>
    </div>
  )
}
