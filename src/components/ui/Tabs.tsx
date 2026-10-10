import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface TabItem {
  key: string
  label: string
  icon?: ReactNode
  /** Shown muted beside the label, e.g. how many rows the tab holds. */
  count?: number
}

interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  /** Names the tab list for screen readers. */
  ariaLabel?: string
}

export function Tabs({ items, activeKey, onChange, ariaLabel }: TabsProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex gap-1 border-b border-surface-800">
      {items.map((item) => {
        const active = activeKey === item.key
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={clsx(
              '-mb-px flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              active ? 'border-b-2 border-brand-500 text-brand-400' : 'text-surface-200/60 hover:text-white',
            )}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span className="text-xs font-normal text-surface-200/45">({item.count})</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
