import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { Card } from './Card'

interface CollapsibleProps {
  title: string
  /** Badges beside the title. Inline content only — it renders inside the toggle button. */
  meta?: ReactNode
  defaultOpen?: boolean
  headingLevel?: 2 | 3
  children: ReactNode
  className?: string
}

/**
 * A card whose body toggles open, following the WAI-ARIA accordion pattern: a
 * heading wrapping a button that owns `aria-expanded`. The body mounts only
 * while open, so charts inside a closed section cost nothing.
 */
export function Collapsible({
  title,
  meta,
  defaultOpen = false,
  headingLevel = 3,
  children,
  className,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <Card padding={false} className={className}>
      <Heading className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            'flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-800/30 sm:px-6',
            open ? 'rounded-t-2xl' : 'rounded-2xl',
          )}
        >
          <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-base font-semibold text-white">{title}</span>
            {meta}
          </span>
          <ChevronDown
            aria-hidden
            className={clsx(
              'h-4 w-4 shrink-0 text-surface-200/50 transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </button>
      </Heading>
      <div id={bodyId} hidden={!open} className="border-t border-surface-800/60 px-5 pb-5 pt-4 sm:px-6">
        {open && children}
      </div>
    </Card>
  )
}
