import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Small uppercase line above the title, e.g. "Live from Angel One". */
  kicker?: string
  title: string
  sub?: ReactNode
  /** Page-level controls aligned to the right, e.g. a "New conversation" button. */
  actions?: ReactNode
}

export function PageHeader({ kicker, title, sub, actions }: PageHeaderProps) {
  return (
    <header className="animate-fade-in flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {kicker && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
            {kicker}
          </p>
        )}
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-surface-200/60">{sub}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
