import { clsx } from 'clsx'
import { useRef, type KeyboardEvent } from 'react'

interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Names the group for screen readers, e.g. "Time period". */
  ariaLabel: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * A row of mutually exclusive options — a period picker, a view toggle. Distinct
 * from `Tabs`, which switches between panels. Keyboard follows the radio-group
 * pattern: one tab stop, arrow keys move the selection.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const current = options.findIndex((o) => o.value === value)
    const next = (current + step + options.length) % options.length
    onChange(options[next].value)
    buttons.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={clsx('inline-flex rounded-xl border border-surface-800 bg-surface-900/60 p-1', className)}
    >
      {options.map((opt, i) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            ref={(el) => {
              buttons.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'cursor-pointer rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
              active ? 'bg-brand-600 text-white shadow-sm' : 'text-surface-200/60 hover:text-white',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
