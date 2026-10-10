import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  hint?: ReactNode
  action?: ReactNode
  /** Tighter spacing, for empty states inside a card section rather than a page. */
  compact?: boolean
  className?: string
}

export function EmptyState({ icon: Icon, title, hint, action, compact, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center text-center',
        compact ? 'gap-2 py-6' : 'gap-3 py-12',
        className,
      )}
    >
      {Icon && (
        <Icon className={clsx('text-surface-200/30', compact ? 'h-7 w-7' : 'h-10 w-10')} aria-hidden />
      )}
      <p className="text-sm font-medium text-surface-200/70">{title}</p>
      {hint && <p className="max-w-sm text-xs leading-relaxed text-surface-200/45">{hint}</p>}
      {action}
    </div>
  )
}
