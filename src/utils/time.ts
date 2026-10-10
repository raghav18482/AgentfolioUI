/**
 * Server timestamps are UTC ISO strings. Most carry an offset (`+00:00`); some
 * older paths write naive UTC with none, which `new Date()` would wrongly read
 * as local time. Treat an offset-less value as UTC.
 */
export function parseServerTime(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(iso)
  const date = new Date(hasZone ? iso : `${iso}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

const IST = 'Asia/Kolkata'

const istDateTime = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST,
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

const istClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: IST,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** `08 Jan, 08:30 am` in India time, or `—`. */
export function formatIst(iso: string | null | undefined): string {
  const date = parseServerTime(iso)
  return date ? istDateTime.format(date) : '—'
}

/** `HH:MM` in India time — the wall-clock time a daily schedule fires at. */
export function istClockTime(iso: string | null | undefined): string | null {
  const date = parseServerTime(iso)
  return date ? istClock.format(date) : null
}

/** `just now`, `5m ago`, `3h ago`, `2d ago`, then a date. */
export function relativeTime(iso: string | null | undefined, now = Date.now()): string {
  const date = parseServerTime(iso)
  if (!date) return ''
  const seconds = (now - date.getTime()) / 1000
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604_800) return `${Math.floor(seconds / 86_400)}d ago`
  return date.toLocaleDateString('en-IN')
}
