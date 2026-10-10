import { clsx } from 'clsx'
import { useState, type ReactNode } from 'react'
import { Popover } from './Popover'

interface InfoPopoverProps {
  /** What the ⓘ explains — the popover's heading and the button's accessible name. */
  title: string
  children: ReactNode
  className?: string
}

/** A small ⓘ that opens an explanation beside it. */
export function InfoPopover({ title, children, className }: InfoPopoverProps) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        ref={setAnchor}
        type="button"
        aria-label={`About ${title}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-surface-700 align-middle font-serif text-[10px] font-semibold italic leading-none text-surface-200/60 transition-colors hover:border-brand-500 hover:text-brand-300',
          open && 'border-brand-500 text-brand-300',
          className,
        )}
      >
        i
      </button>
      <Popover anchor={anchor} open={open} onClose={() => setOpen(false)} label={title}>
        <p className="mb-2 text-sm font-semibold text-white">{title}</p>
        <div className="space-y-2.5 text-xs leading-relaxed text-surface-200/75">{children}</div>
      </Popover>
    </>
  )
}

/** A labelled block inside an InfoPopover, e.g. "Ideal values". */
export function InfoSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-300/80">{heading}</p>
      <div className="whitespace-pre-line">{children}</div>
    </div>
  )
}
