import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'

interface Props {
  data: Array<{ name: string; change: number }>
}

export function SectorHeatmap({ data }: Props) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.change)), 1)

  return (
    <Card>
      <h3 className="text-sm font-medium text-white mb-4">Sector Heatmap</h3>
      <div className="space-y-2">
        {data.map((sector) => {
          const widthPct = Math.max((Math.abs(sector.change) / maxAbs) * 100, 8)
          const positive = sector.change >= 0

          return (
            <div key={sector.name} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-surface-200/70 truncate">{sector.name}</span>
              <div className="flex-1 relative h-6">
                <div
                  className={clsx(
                    'h-full rounded-md transition-all',
                    positive ? 'bg-emerald-500/30' : 'bg-rose-500/30',
                  )}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className={clsx(
                'w-16 text-right text-xs font-medium tabular-nums',
                positive ? 'text-emerald-400' : 'text-rose-400',
              )}>
                {positive ? '+' : ''}{sector.change.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
