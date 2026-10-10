import { describe, expect, it } from 'vitest'
import { formatIst, istClockTime, parseServerTime, relativeTime } from './time'

describe('parseServerTime', () => {
  it('reads an offset-less timestamp as UTC, not local time', () => {
    expect(parseServerTime('2025-01-08T03:00:00')?.toISOString()).toBe('2025-01-08T03:00:00.000Z')
  })

  it('respects an explicit offset', () => {
    expect(parseServerTime('2025-01-08T03:00:00+00:00')?.toISOString()).toBe('2025-01-08T03:00:00.000Z')
    expect(parseServerTime('2025-01-08T08:30:00+05:30')?.toISOString()).toBe('2025-01-08T03:00:00.000Z')
  })

  it('returns null for nothing or garbage', () => {
    expect(parseServerTime(null)).toBeNull()
    expect(parseServerTime('not a date')).toBeNull()
  })
})

describe('India-time formatting', () => {
  it('shows the IST wall clock of a UTC schedule', () => {
    // 03:00 UTC is 08:30 IST — the briefing default.
    expect(istClockTime('2025-01-08T03:00:00')).toBe('08:30')
    expect(istClockTime(null)).toBeNull()
  })

  it('formats a full IST date and time', () => {
    expect(formatIst('2025-01-08T03:00:00+00:00')).toMatch(/08 Jan.*08:30/i)
    expect(formatIst(undefined)).toBe('—')
  })
})

describe('relativeTime', () => {
  const now = Date.parse('2025-01-08T12:00:00Z')

  it.each([
    ['2025-01-08T11:59:30Z', 'just now'],
    ['2025-01-08T11:55:00Z', '5m ago'],
    ['2025-01-08T09:00:00Z', '3h ago'],
    ['2025-01-06T12:00:00Z', '2d ago'],
  ])('%s → %s', (iso, expected) => {
    expect(relativeTime(iso, now)).toBe(expected)
  })
})
