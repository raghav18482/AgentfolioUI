import { clsx } from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatPct } from '@/utils/format'
import type { Holding } from '@/types'

interface Props {
  holdings: Holding[]
}

export function HoldingsTable({ holdings }: Props) {
  if (!holdings.length) return null

  return (
    <Card padding={false}>
      <div className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
        <h2 className="text-lg font-semibold text-white">Holdings</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800 text-xs uppercase tracking-wider text-surface-200/50">
              <th className="px-5 py-3 text-left font-medium">Symbol</th>
              <th className="px-5 py-3 text-right font-medium">Qty</th>
              <th className="px-5 py-3 text-right font-medium hidden sm:table-cell">Avg Price</th>
              <th className="px-5 py-3 text-right font-medium">LTP</th>
              <th className="px-5 py-3 text-right font-medium">P&L</th>
              <th className="px-5 py-3 text-right font-medium hidden sm:table-cell">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const invested = h.qty * h.avg_price
              const current = h.qty * h.ltp
              const pnl = current - invested
              const pnlPct = invested ? (pnl / invested) * 100 : 0
              const up = pnl >= 0

              return (
                <tr
                  key={h.symbol}
                  className="border-b border-surface-800/50 last:border-0 hover:bg-surface-800/30 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={clsx(
                        'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold',
                        up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400',
                      )}>
                        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      </div>
                      <span className="font-medium text-white">{h.symbol}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-surface-200/80 tabular-nums">
                    {h.qty}
                  </td>
                  <td className="px-5 py-3.5 text-right text-surface-200/80 tabular-nums hidden sm:table-cell">
                    {formatCurrency(h.avg_price)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-white font-medium tabular-nums">
                    {formatCurrency(h.ltp)}
                  </td>
                  <td className={clsx(
                    'px-5 py-3.5 text-right font-medium tabular-nums',
                    up ? 'text-emerald-400' : 'text-rose-400',
                  )}>
                    {formatCurrency(pnl)}
                  </td>
                  <td className={clsx(
                    'px-5 py-3.5 text-right font-medium tabular-nums hidden sm:table-cell',
                    up ? 'text-emerald-400' : 'text-rose-400',
                  )}>
                    {formatPct(pnlPct)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
