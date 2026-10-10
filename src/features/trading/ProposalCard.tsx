import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Copy, X } from 'lucide-react'
import { approveProposal, rejectProposal } from '@/api/trading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/hooks/useToast'
import { relativeTime } from '@/utils/time'
import type { ProposalStatus, TradeProposal } from '@/types'

const statusVariant: Record<ProposalStatus, 'warning' | 'success' | 'danger' | 'neutral' | 'info'> = {
  pending: 'warning',
  approved: 'info',
  executed: 'success',
  rejected: 'neutral',
  expired: 'neutral',
  failed: 'danger',
}

export function ProposalCard({ proposal }: { proposal: TradeProposal }) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['proposals'] })

  const approve = useMutation({
    mutationFn: () => approveProposal(proposal.proposal_id),
    onSuccess: (result) => {
      // A risk or compliance block is a 200 with ok: false — not a success.
      if (result.ok) toast.success(`Order placed${result.order_id ? ` — Order ID ${result.order_id}` : ''}`)
      else toast.error(result.error ?? 'The order was not placed.')
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => {
      setConfirming(false)
      void refresh()
    },
  })

  const reject = useMutation({
    mutationFn: () => rejectProposal(proposal.proposal_id),
    onSuccess: () => toast.info('Proposal rejected'),
    onError: (err) => toast.error(err.message),
    onSettled: () => void refresh(),
  })

  const pending = proposal.status === 'pending'

  return (
    <div className="space-y-2.5 rounded-xl border border-surface-800 bg-surface-900/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-sm font-medium text-white">{proposal.summary}</p>
        <Badge variant={statusVariant[proposal.status]} className="uppercase">
          {proposal.status}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-200/50">
        {/* The id is what `APPROVE <id>` in the chat expects, so it must be copyable. */}
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(proposal.proposal_id).then(() => toast.info('Proposal id copied'))}
          className="inline-flex cursor-pointer items-center gap-1 font-mono text-surface-200/70 hover:text-white"
          aria-label={`Copy proposal id ${proposal.proposal_id}`}
        >
          {proposal.proposal_id}
          <Copy className="h-3 w-3" aria-hidden />
        </button>
        <span>{relativeTime(new Date(proposal.created_at * 1000).toISOString())}</span>
      </div>

      {proposal.order_id && <p className="text-xs text-emerald-400">Order ID: {proposal.order_id}</p>}
      {proposal.error && <p className="text-xs text-rose-300">{proposal.error}</p>}

      {pending && (
        <div className="flex gap-2 border-t border-surface-800/50 pt-3">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => setConfirming(true)}>
            <Check className="h-3.5 w-3.5" aria-hidden /> Approve
          </Button>
          <Button size="sm" variant="danger" loading={reject.isPending} onClick={() => reject.mutate()}>
            <X className="h-3.5 w-3.5" aria-hidden /> Reject
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        title="Execute this trade?"
        confirmLabel="Place real order"
        tone="danger"
        busy={approve.isPending}
        onConfirm={() => approve.mutate()}
        onCancel={() => setConfirming(false)}
      >
        <p>
          This will place a <strong className="text-white">REAL order</strong> on Angel One.
        </p>
        <p className="mt-3 rounded-lg bg-surface-800/60 px-3 py-2 font-medium text-white">{proposal.summary}</p>
        <p className="mt-2 font-mono text-xs text-surface-200/50">Proposal {proposal.proposal_id}</p>
      </ConfirmDialog>
    </div>
  )
}
