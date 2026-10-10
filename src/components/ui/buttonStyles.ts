import { clsx } from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20',
  secondary: 'bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700',
  ghost: 'hover:bg-surface-800 text-surface-200',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

/**
 * The button look, shared by `Button` and `ButtonLink` so a link can look like a
 * button without nesting a `<button>` inside an `<a>`.
 */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className,
  )
}
