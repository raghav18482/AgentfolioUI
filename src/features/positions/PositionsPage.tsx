import { clsx } from 'clsx'
import { ArrowLeftRight, TrendingDown, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { StatCard } from '@/components/ui/StatCard'
import { usePositions } from '@/hooks/usePortfolio'
import { formatCurrency, pnlColor } from '@/utils/format'
import type { Position } from '@/types'

const columns: Column<Position>[] = [
  { header: 'Symbol', cell: (p) => <span className="font-medium text-white">{p.symbol}</span> },
  {
    header: 'Product',
    cell: (p) => <span className="rounded-md bg-surface-800 px-2 py-0.5 text-xs text-surface-200/70">{p.product}</span>,
  },
  { header: 'Net Qty', align: 'right', cell: (p) => p.net_qty, className: 'text-surface-200/80' },
  {
    header: 'Buy Avg',
    align: 'right',
    hideBelow: 'sm',
    cell: (p) => formatCurrency(p.buy_avg),
    className: 'text-surface-200/80',
  },
  {
    header: 'Sell Avg',
    align: 'right',
    hideBelow: 'sm',
    cell: (p) => formatCurrency(p.sell_avg),
    className: 'text-surface-200/80',
  },
  { header: 'LTP', align: 'right', cell: (p) => formatCurrency(p.ltp), className: 'font-medium text-white' },
  {
    header: 'P&L',
    align: 'right',
    cell: (p) => <span className={clsx('font-medium', pnlColor(p.pnl))}>{formatCurrency(p.pnl)}</span>,
  },
]

export function PositionsPage() {
  const positions = usePositions()

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <PageHeader title="Positions" sub="Open intraday and delivery positions" />

      {positions.isPending ? (
        <Spinner size="lg" />
      ) : positions.isError ? (
        <Alert
          variant="error"
          title="Could not load positions"
          action={
            <Button size="sm" variant="secondary" loading={positions.isFetching} onClick={() => positions.refetch()}>
              Retry
            </Button>
          }
        >
          {positions.error.message}
        </Alert>
      ) : positions.data.positions.length === 0 ? (
        <Card>
          <EmptyState icon={ArrowLeftRight} title="No open positions today." />
        </Card>
      ) : (
        <>
          <div className="grid animate-slide-up gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Day P&L"
              value={formatCurrency(positions.data.total_pnl)}
              trend={positions.data.total_pnl >= 0 ? 'up' : 'down'}
              icon={
                positions.data.total_pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
              }
            />
            <StatCard
              label="Open Positions"
              value={String(positions.data.positions.length)}
              icon={<ArrowLeftRight className="h-4 w-4" />}
            />
          </div>
          <Card padding={false} className="animate-slide-up">
            <DataTable
              caption="Open positions"
              columns={columns}
              rows={positions.data.positions}
              rowKey={(p, i) => `${p.symbol}-${p.product}-${i}`}
            />
          </Card>
        </>
      )}
    </div>
  )
}
