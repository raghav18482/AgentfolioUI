import { clsx } from 'clsx'
import { useId } from 'react'
import type { CountryOption, PhoneValue } from '@/types'

interface PhoneInputProps {
  label: string
  countries: CountryOption[]
  value: PhoneValue
  onChange: (value: PhoneValue) => void
  error?: string
  hint?: string
  /** `username` where the number is the login identifier, so password managers pair it. */
  autoComplete?: string
  required?: boolean
  disabled?: boolean
}

const fieldClass =
  'rounded-xl border border-surface-700 bg-surface-800/60 py-2.5 text-sm text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 disabled:opacity-50'

/**
 * A dial-code dropdown beside the national number. The server combines and
 * normalises the two (`web/country_codes.normalize_whatsapp`), so spacing,
 * dashes and a leading zero are all fine to type.
 */
export function PhoneInput({
  label,
  countries,
  value,
  onChange,
  error,
  hint,
  autoComplete = 'tel',
  required,
  disabled,
}: PhoneInputProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-surface-200/80">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          aria-label="Country dialling code"
          value={value.dial}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, dial: e.target.value })}
          className={clsx(fieldClass, 'w-32 shrink-0 cursor-pointer px-3')}
        >
          {countries.map((c) => (
            <option key={c.iso} value={c.dial} title={c.name}>
              {c.label} · {c.name}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          placeholder="98765 43210"
          required={required}
          disabled={disabled}
          value={value.national}
          onChange={(e) => onChange({ ...value, national: e.target.value })}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={clsx(
            fieldClass,
            'min-w-0 flex-1 px-4 placeholder:text-surface-200/30',
            error && 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30',
          )}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-rose-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-surface-200/50">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
