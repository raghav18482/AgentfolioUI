import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { HoldingPills } from '@/components/ui/HoldingPills'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePortfolio } from '@/hooks/usePortfolio'
import { parseAmount } from '@/utils/format'
import { CandlestickCard } from './CandlestickCard'
import { PredictionCard } from './PredictionCard'
import { RebalancerCard } from './RebalancerCard'

export function AnalyticsPage() {
  const portfolio = usePortfolio()
  const [picked, setPicked] = useState<string | null>(null)

  const holdings = portfolio.data?.holdings ?? []
  const holding = holdings.find((h) => h.symbol === picked) ?? holdings[0]

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        kicker="Per-stock tools"
        title="Analytics"
        sub="Price history, an AI direction forecast and a what-if rebalancer for your holdings"
      />

      {portfolio.isPending ? (
        <div className="space-y-6">
          <Skeleton height={40} />
          <Skeleton height={480} />
        </div>
      ) : portfolio.isError ? (
        <Alert variant="error">{portfolio.error.message}</Alert>
      ) : !holding ? (
        <Card>
          <EmptyState icon={BarChart3} title="No holdings to analyse yet." />
        </Card>
      ) : (
        <>
          <HoldingPills
            holdings={holdings}
            selected={holding.symbol}
            onSelect={setPicked}
            ariaLabel="Choose a holding to analyse"
          />
          <CandlestickCard holding={holding} />
          <PredictionCard symbol={holding.symbol} />
          <RebalancerCard holdings={holdings} cash={parseAmount(portfolio.data.funds.available_cash) ?? 0} />
        </>
      )}
    </div>
  )
}
