import { clsx } from 'clsx'
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
  /** Guidance under the field; replaced by `error` when there is one. */
  hint?: string
}

export function Input({ label, icon, error, hint, className, id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-surface-200/80">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200/40">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={clsx(
            'w-full rounded-xl border border-surface-700 bg-surface-800/60 py-2.5 pr-4 text-sm text-white placeholder:text-surface-200/30 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all disabled:opacity-50',
            icon ? 'pl-10' : 'pl-4',
            error && 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30',
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-rose-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-surface-200/50">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
