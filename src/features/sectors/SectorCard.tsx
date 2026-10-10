import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatPct } from '@/utils/format'
import type { SectorOverview } from '@/types'

interface Props {
  sector: SectorOverview
}

const timeframes = ['1w', '1m', '3m', '6m', '1y'] as const

export function SectorCard({ sector }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white text-left">{sector.name}</h3>
            <p className="text-xs text-surface-200/50 text-left">
              {sector.holdings_count} holdings &middot; {formatCurrency(sector.invested)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">{sector.weight.toFixed(1)}%</Badge>
          {open ? <ChevronUp className="h-4 w-4 text-surface-200/50" /> : <ChevronDown className="h-4 w-4 text-surface-200/50" />}
        </div>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-surface-800/50 space-y-4 animate-fade-in">
          {sector.index_name && (
            <p className="text-xs text-surface-200/50">Index: {sector.index_name}</p>
          )}

          {sector.index_performance && (
            <div className="flex flex-wrap gap-2">
              {timeframes.map((tf) => {
                const val = sector.index_performance?.[tf]
                if (val == null) return null
                return (
                  <Badge key={tf} variant={val >= 0 ? 'success' : 'danger'}>
                    {tf}: {formatPct(val)}
                  </Badge>
                )
              })}
            </div>
          )}

          {sector.holdings.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-surface-200/50 uppercase tracking-wider">Your Holdings</p>
              {sector.holdings.map((h) => (
                <div key={h.symbol} className="flex items-center justify-between py-1">
                  <span className="text-sm text-white">{h.symbol}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-surface-200/70 tabular-nums">{formatCurrency(h.ltp)}</span>
                    <span className={clsx('tabular-nums font-medium', h.pnl_pct >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                      {formatPct(h.pnl_pct)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sector.driver && (
            <p className="text-xs text-surface-200/50 italic">{sector.driver}</p>
          )}
        </div>
      )}
    </Card>
  )
}
