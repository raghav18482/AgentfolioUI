import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ label, value, subValue, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-surface-800 bg-surface-900/60 backdrop-blur-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-surface-200/60">
          {label}
        </span>
        {icon && (
          <span className="text-brand-400">{icon}</span>
        )}
      </div>
      <div
        className={clsx(
          'text-2xl font-semibold font-display tracking-tight',
          trend === 'up' && 'text-emerald-400',
          trend === 'down' && 'text-rose-400',
          (!trend || trend === 'neutral') && 'text-white',
        )}
      >
        {value}
      </div>
      {subValue && (
        <span
          className={clsx(
            'text-sm font-medium',
            trend === 'up' && 'text-emerald-400/80',
            trend === 'down' && 'text-rose-400/80',
            (!trend || trend === 'neutral') && 'text-surface-200/60',
          )}
        >
          {subValue}
        </span>
      )}
    </div>
  )
}
