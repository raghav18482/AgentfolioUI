import { clsx } from 'clsx'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthCardProps {
  title: string
  sub: string
  /** Room for a two-section form (enroll) rather than a short one (login). */
  wide?: boolean
  children: ReactNode
}

/** The centred card the login and enroll forms sit in. */
export function AuthCard({ title, sub, wide, children }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-12 sm:items-center">
      <div className={clsx('w-full', wide ? 'max-w-xl' : 'max-w-md')}>
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-surface-200/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
        <div className="animate-fade-in rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm sm:p-8">
          <h1 className="mb-2 font-display text-2xl font-bold text-white">{title}</h1>
          <p className="mb-8 text-sm leading-relaxed text-surface-200/60">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
