import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { HoldingPills } from '@/components/ui/HoldingPills'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { usePortfolio } from '@/hooks/usePortfolio'
import { FundamentalTab } from './FundamentalTab'
import { StockInfoBar } from './StockInfoBar'
import { TechnicalTab } from './TechnicalTab'

type TabKey = 'fundamental' | 'technical'

const TABS = [
  { key: 'fundamental', label: 'Fundamental' },
  { key: 'technical', label: 'Technical' },
]

export function ResearchPage() {
  const portfolio = usePortfolio()
  const [picked, setPicked] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>('fundamental')

  const holdings = portfolio.data?.holdings ?? []
  // The first holding until the user picks one — derived, so no effect to sync it.
  const symbol = picked && holdings.some((h) => h.symbol === picked) ? picked : (holdings[0]?.symbol ?? null)
  const holding = holdings.find((h) => h.symbol === symbol)

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        kicker="Fundamental & technical"
        title="Stock Research"
        sub="Fundamental & technical analysis for your portfolio holdings"
      />

      {portfolio.isPending ? (
        <Skeleton height={40} />
      ) : portfolio.isError ? (
        <Alert variant="error">{portfolio.error.message}</Alert>
      ) : !holding || !symbol ? (
        <Card>
          <EmptyState icon={FlaskConical} title="No holdings found." />
        </Card>
      ) : (
        <>
          <HoldingPills holdings={holdings} selected={symbol} onSelect={setPicked} ariaLabel="Choose a stock to research" />
          <StockInfoBar holding={holding} />
          <Tabs items={TABS} activeKey={tab} onChange={(k) => setTab(k as TabKey)} ariaLabel="Analysis type" />
          {/* Keyed by symbol so the previous stock's popovers and zoom never carry over. */}
          <div key={symbol} role="tabpanel">
            {tab === 'fundamental' ? <FundamentalTab symbol={symbol} /> : <TechnicalTab symbol={symbol} />}
          </div>
        </>
      )}
    </div>
  )
}
