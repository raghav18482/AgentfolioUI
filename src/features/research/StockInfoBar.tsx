import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'
import type { Holding } from '@/types'
import { displaySymbol, formatNum, signedPct } from '@/utils/format'

export function StockInfoBar({ holding }: { holding: Holding }) {
  const up = holding.pnl >= 0
  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-white">{displaySymbol(holding.symbol)}</h2>
        <p className="mt-0.5 text-xs text-surface-200/55">
          Qty: {holding.qty} · Avg: ₹{formatNum(holding.avg_price)} · Invested: ₹{formatNum(holding.invested)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xl font-semibold text-white">₹{formatNum(holding.ltp)}</p>
        <p className={clsx('text-sm font-medium', up ? 'text-emerald-400' : 'text-rose-400')}>
          {up ? '+' : '-'}₹{formatNum(Math.abs(holding.pnl))} ({signedPct(holding.pnl_pct)})
        </p>
      </div>
    </Card>
  )
}
