import { clsx } from 'clsx'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'

interface AlertProps {
  variant?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  children?: ReactNode
  /** A button or link shown at the trailing edge, e.g. "Try again". */
  action?: ReactNode
  className?: string
}

const variants = {
  error: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
  info: 'border-brand-500/20 bg-brand-500/10 text-brand-100',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
}

const iconStyles = {
  error: 'text-rose-400',
  warning: 'text-amber-400',
  info: 'text-brand-400',
  success: 'text-emerald-400',
}

const icons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
}

export function Alert({ variant = 'info', title, children, action, className }: AlertProps) {
  const Icon = icons[variant]
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={clsx('flex gap-3 rounded-2xl border px-4 py-3 text-sm', variants[variant], className)}
    >
      <Icon className={clsx('mt-0.5 h-4 w-4 shrink-0', iconStyles[variant])} aria-hidden />
      <div className="min-w-0 flex-1 leading-relaxed">
        {title && <p className="font-medium text-white">{title}</p>}
        {children && <div className={clsx(title && 'mt-0.5')}>{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  )
}
