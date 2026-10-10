import { clsx } from 'clsx'
import type { Holding } from '@/types'
import { displaySymbol, signedPct } from '@/utils/format'

interface HoldingPillsProps {
  holdings: Holding[]
  selected: string | null
  onSelect: (symbol: string) => void
  /** Names the group for screen readers, e.g. "Choose a stock to research". */
  ariaLabel: string
}

/** One pill per holding, each with its P&L so the picker doubles as a scan of the portfolio. */
export function HoldingPills({ holdings, selected, onSelect, ariaLabel }: HoldingPillsProps) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {holdings.map((h) => {
        const active = h.symbol === selected
        return (
          <button
            key={h.symbol}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(h.symbol)}
            className={clsx(
              'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
              active
                ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                : 'border-surface-700 bg-surface-800/60 text-surface-200/70 hover:bg-surface-800 hover:text-white',
            )}
          >
            {displaySymbol(h.symbol)}
            <span
              className={clsx(
                'text-xs',
                active ? 'text-white/80' : h.pnl_pct >= 0 ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {signedPct(h.pnl_pct, 1)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
