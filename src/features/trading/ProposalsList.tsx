import { FileText } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useProposals } from '@/hooks/useTrading'
import { ProposalCard } from './ProposalCard'

export function ProposalsList() {
  const proposals = useProposals()
  // The server's `count` covers every status, so count pending here.
  const pending = proposals.data?.filter((p) => p.status === 'pending').length ?? 0
  const newestFirst = proposals.data ? [...proposals.data].sort((a, b) => b.created_at - a.created_at) : []

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <FileText className="h-4 w-4 text-brand-400" aria-hidden />
          Trade Proposals
        </h2>
        {pending > 0 && <Badge variant="warning">{pending} pending</Badge>}
      </div>

      {proposals.isPending ? (
        <Spinner />
      ) : proposals.isError ? (
        <Alert variant="error">Could not load proposals: {proposals.error.message}</Alert>
      ) : newestFirst.length === 0 ? (
        <EmptyState
          compact
          icon={FileText}
          title="No proposals yet."
          hint="Chat with the trading agent to get trade ideas."
        />
      ) : (
        <div className="space-y-3">
          {newestFirst.map((p) => (
            <ProposalCard key={p.proposal_id} proposal={p} />
          ))}
        </div>
      )}
    </Card>
  )
}
