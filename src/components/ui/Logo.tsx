import { useId } from 'react'
import { clsx } from 'clsx'

/**
 * The Agentfolio mark: a gradient-framed tile with three rising bars and a
 * trend line. Drawn as SVG so it stays sharp at any size; gradient ids are
 * per-instance so several logos can share a page.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId()
  const stroke = `${id}-stroke`
  const fill = `${id}-fill`

  return (
    <svg viewBox="0 0 64 64" fill="none" className={clsx('shrink-0', className)} aria-hidden>
      <defs>
        <linearGradient id={stroke} x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="0.5" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id={fill} x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d2b2b" />
          <stop offset="1" stopColor="#1a2347" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="15" fill={`url(#${fill})`} stroke={`url(#${stroke})`} strokeWidth="3" />
      <rect x="15" y="34" width="8" height="15" rx="2" fill="#10b981" />
      <rect x="27.5" y="27" width="8" height="22" rx="2" fill="#0ea5e9" />
      <rect x="40" y="19" width="8" height="30" rx="2" fill="#6366f1" />
      <path d="M19 33 L33 24 L43 18 L50 11" stroke="#cbd5e1" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50.5" cy="10.5" r="3.5" fill="#10b981" />
    </svg>
  )
}

/** Mark + wordmark, as used in the navbar and footer. */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <LogoMark className={clsx('h-9 w-9', markClassName)} />
      <span className={clsx('font-display text-lg font-semibold tracking-tight text-white', wordmarkClassName)}>
        Agent<span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-brand-400 bg-clip-text text-transparent">folio</span>
      </span>
    </span>
  )
}
