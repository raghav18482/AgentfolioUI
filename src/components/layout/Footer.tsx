import { Shield } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-800/60 bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-surface-200/50 sm:flex-row">
          <Logo markClassName="h-7 w-7" wordmarkClassName="text-base" />
          <div className="flex items-center gap-1.5 text-center">
            <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              AI-powered portfolio insights. Angel One credentials are encrypted at rest and decrypted
              only in server memory.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
