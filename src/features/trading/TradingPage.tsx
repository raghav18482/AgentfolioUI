import { Lock } from 'lucide-react'
import { PremiumGate } from '@/components/auth/PremiumGate'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { BriefingScheduler } from './BriefingScheduler'
import { LivePriceCard } from './LivePriceCard'
import { PremiumActivation } from './PremiumActivation'
import { ProposalsList } from './ProposalsList'
import { RiskProfileForm } from './RiskProfileForm'
import { TradingChat } from './TradingChat'

export function TradingPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        kicker="Risk-aware trading"
        title="Trading agent"
        sub="Chat with the AI trading assistant. It proposes trades based on your risk profile — you approve or reject before any order is placed."
      />

      <PremiumActivation />

      <PremiumGate
        fallback={
          <Card>
            <EmptyState
              icon={Lock}
              title="Activate Premium above to unlock your risk profile, real-time charts, trade proposals, and the AI trading assistant."
            />
          </Card>
        }
      >
        <BriefingScheduler />
        <RiskProfileForm />
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <LivePriceCard />
            <ProposalsList />
          </div>
          <div className="lg:sticky lg:top-20">
            <TradingChat />
          </div>
        </div>
      </PremiumGate>
    </div>
  )
}
