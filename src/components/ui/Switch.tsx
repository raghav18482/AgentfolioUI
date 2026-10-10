import { clsx } from 'clsx'
import { useId } from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
  className?: string
}

/** An on/off toggle. A `role="switch"` button, so it reads as on/off rather than checked. */
export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  const id = useId()
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-emerald-500' : 'bg-surface-700',
        )}
      >
        <span
          aria-hidden
          className={clsx(
            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5.5' : 'translate-x-0.5',
          )}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer select-none text-sm text-surface-200/80">
        {label}
      </label>
    </div>
  )
}
