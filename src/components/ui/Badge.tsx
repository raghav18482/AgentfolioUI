import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info'
  children: ReactNode
  className?: string
}

const variants = {
  success: 'bg-emerald-500/10 text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-400',
  danger: 'bg-rose-500/10 text-rose-400',
  neutral: 'bg-surface-800 text-surface-200/70',
  info: 'bg-brand-500/10 text-brand-400',
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
