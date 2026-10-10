import { clsx } from 'clsx'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-surface-200/80">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-xl border border-surface-700 bg-surface-800/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all appearance-none cursor-pointer',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
