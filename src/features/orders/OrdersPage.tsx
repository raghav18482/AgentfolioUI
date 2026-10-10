import { useState, type ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { CheckCircle2, ClipboardList, Clock, Receipt, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { useOrders, useTrades } from '@/hooks/usePortfolio'
import { formatCurrency } from '@/utils/format'
import type { Order, Trade } from '@/types'

function sideBadge(side: string) {
  if (side === 'BUY') return <Badge variant="success">BUY</Badge>
  if (side === 'SELL') return <Badge variant="danger">SELL</Badge>
  return <Badge>{side}</Badge>
}

function statusBadge(status: string) {
  const s = status.toLowerCase()
  if (s === 'complete' || s === 'executed') {
    return (
      <Badge variant="success">
        <CheckCircle2 className="h-3 w-3" aria-hidden /> {status}
      </Badge>
    )
  }
  if (s === 'rejected' || s === 'cancelled') {
    return (
      <Badge variant="danger">
        <XCircle className="h-3 w-3" aria-hidden /> {status}
      </Badge>
    )
  }
  return (
    <Badge variant="warning">
      <Clock className="h-3 w-3" aria-hidden /> {status}
    </Badge>
  )
}

const mono = 'font-mono text-xs text-surface-200/60'

const orderColumns: Column<Order>[] = [
  { header: 'Order ID', cell: (o) => o.orderid, className: mono, hideBelow: 'md' },
  { header: 'Symbol', cell: (o) => <span className="font-medium text-white">{o.symbol}</span> },
  { header: 'Type', cell: (o) => sideBadge(o.txn_type) },
  { header: 'Qty', align: 'right', cell: (o) => o.qty, className: 'text-surface-200/80' },
  { header: 'Price', align: 'right', cell: (o) => formatCurrency(o.price), className: 'text-white' },
  { header: 'Status', cell: (o) => statusBadge(o.status) },
  { header: 'Time', align: 'right', hideBelow: 'sm', cell: (o) => o.time, className: 'text-xs text-surface-200/50' },
]

const tradeColumns: Column<Trade>[] = [
  { header: 'Trade ID', cell: (t) => t.tradeid, className: mono, hideBelow: 'md' },
  { header: 'Order ID', cell: (t) => t.orderid, className: mono, hideBelow: 'md' },
  { header: 'Symbol', cell: (t) => <span className="font-medium text-white">{t.symbol}</span> },
  { header: 'Exchange', cell: (t) => t.exchange, hideBelow: 'sm', className: 'text-surface-200/70' },
  { header: 'Type', cell: (t) => sideBadge(t.txn_type) },
  {
    header: 'Product',
    hideBelow: 'sm',
    cell: (t) => <span className="rounded-md bg-surface-800 px-2 py-0.5 text-xs text-surface-200/70">{t.product}</span>,
  },
  { header: 'Qty', align: 'right', cell: (t) => t.qty, className: 'text-surface-200/80' },
  { header: 'Fill Price', align: 'right', cell: (t) => formatCurrency(t.price), className: 'text-white' },
  { header: 'Time', align: 'right', hideBelow: 'sm', cell: (t) => t.time, className: 'text-xs text-surface-200/50' },
]

/** One tab's body: its own loading, failure and empty states, so one book failing never hides the other. */
function BookPanel<T>({
  query,
  what,
  empty,
  emptyIcon,
  children,
}: {
  query: UseQueryResult<T[]>
  what: string
  empty: string
  emptyIcon: typeof ClipboardList
  children: (rows: T[]) => ReactNode
}) {
  if (query.isPending) return <Spinner size="lg" />
  if (query.isError) {
    return (
      <Alert
        variant="error"
        title={`Could not load the ${what}`}
        action={
          <Button size="sm" variant="secondary" loading={query.isFetching} onClick={() => query.refetch()}>
            Retry
          </Button>
        }
      >
        {query.error.message}
      </Alert>
    )
  }
  if (query.data.length === 0) {
    return (
      <Card>
        <EmptyState icon={emptyIcon} title={empty} />
      </Card>
    )
  }
  return (
    <Card padding={false} className="animate-slide-up">
      {children(query.data)}
    </Card>
  )
}

export function OrdersPage() {
  const [tab, setTab] = useState('orders')
  const orders = useOrders()
  const trades = useTrades()

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <PageHeader title="Orders & Trades" sub="Today's order book and executed trades" />

      <Tabs
        ariaLabel="Orders and trades"
        items={[
          { key: 'orders', label: 'Orders', count: orders.data?.length },
          { key: 'trades', label: 'Executed Trades', count: trades.data?.length },
        ]}
        activeKey={tab}
        onChange={setTab}
      />

      {tab === 'orders' ? (
        <BookPanel query={orders} what="order book" empty="No orders placed today." emptyIcon={ClipboardList}>
          {(rows) => <DataTable caption="Today's orders" columns={orderColumns} rows={rows} rowKey={(o) => o.orderid} />}
        </BookPanel>
      ) : (
        <BookPanel query={trades} what="trade book" empty="No executed trades today." emptyIcon={Receipt}>
          {(rows) => (
            <DataTable caption="Today's executed trades" columns={tradeColumns} rows={rows} rowKey={(t) => t.tradeid} />
          )}
        </BookPanel>
      )}
    </div>
  )
}
