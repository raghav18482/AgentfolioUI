import { clsx } from 'clsx'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PopoverProps {
  /** The element the popover points at; focus returns here on close. */
  anchor: HTMLElement | null
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. */
  label: string
  children: ReactNode
  className?: string
}

const MARGIN = 8

/**
 * A non-modal dialog anchored to a trigger: below it when there is room, above
 * when not, always clamped inside the viewport. Escape or a click elsewhere
 * closes it and focus goes back to the trigger.
 *
 * Positioning writes straight to the element's style instead of going through
 * state — it tracks scroll and resize, and a re-render per scroll event would be
 * wasted work.
 */
export function Popover({ anchor, open, onClose, label, children, className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useLayoutEffect(() => {
    onCloseRef.current = onClose
  })

  useLayoutEffect(() => {
    const el = ref.current
    if (!open || !anchor || !el) return

    function place() {
      if (!anchor || !el) return
      const a = anchor.getBoundingClientRect()
      const p = el.getBoundingClientRect()
      let top = a.bottom + MARGIN
      const roomBelow = window.innerHeight - MARGIN - top
      if (p.height > roomBelow && a.top - MARGIN - p.height > MARGIN) top = a.top - MARGIN - p.height
      const centred = a.left + a.width / 2 - p.width / 2
      const left = Math.max(MARGIN, Math.min(centred, window.innerWidth - p.width - MARGIN))
      el.style.top = `${top}px`
      el.style.left = `${left}px`
    }

    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, anchor])

  useEffect(() => {
    const el = ref.current
    if (!open || !el) return
    el.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (el?.contains(target) || anchor?.contains(target)) return
      onCloseRef.current()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      anchor?.focus()
    }
  }, [open, anchor])

  if (!open) return null

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label={label}
      tabIndex={-1}
      style={{ top: -9999, left: -9999 }}
      className={clsx(
        'fixed z-[70] w-80 max-w-[calc(100vw-1rem)] rounded-2xl border border-surface-700 bg-surface-900 p-4 shadow-2xl shadow-black/40 outline-none',
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  )
}
