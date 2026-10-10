import { describe, expect, it } from 'vitest'
import type { Holding } from '@/types'
import { canReinvest, MAX_ROWS, rebalanceRows, simulate } from './rebalance'

const holding = (symbol: string, current: number): Holding => ({
  symbol,
  symboltoken: '1',
  qty: 1,
  avg_price: current,
  ltp: current,
  invested: current,
  current,
  pnl: 0,
  pnl_pct: 0,
})

describe('rebalanceRows', () => {
  it('keeps the largest holdings, biggest first, and drops empty ones', () => {
    const many = Array.from({ length: 15 }, (_, i) => holding(`S${i}-EQ`, (i + 1) * 100))
    many.push(holding('ZERO-EQ', 0))
    const rows = rebalanceRows(many)
    expect(rows).toHaveLength(MAX_ROWS)
    expect(rows[0]).toMatchObject({ symbol: 'S14-EQ', label: 'S14', original: 1500 })
    expect(rows.some((r) => r.symbol === 'ZERO-EQ')).toBe(false)
  })
})

describe('simulate', () => {
  const rows = rebalanceRows([holding('A-EQ', 1000), holding('B-EQ', 500)])

  it('frees cash in proportion to the percent sold', () => {
    const s = simulate(rows, { 'A-EQ': 50, 'B-EQ': 100 }, {}, 200)
    expect(s.freed).toBe(1000)
    expect(s.after).toEqual({ 'A-EQ': 500, 'B-EQ': 0 })
    expect(s.remaining).toBe(1200)
  })

  it('keeps reinvestments when a slider moves afterwards', () => {
    const buys = { 'B-EQ': 300 }
    const first = simulate(rows, { 'A-EQ': 50 }, buys, 0)
    const moved = simulate(rows, { 'A-EQ': 80 }, buys, 0)
    expect(first.after['B-EQ']).toBe(800)
    expect(moved.after['B-EQ']).toBe(800)
    expect(moved.remaining).toBe(500)
  })
})

describe('canReinvest', () => {
  it('rejects zero, negative, NaN and more than the cash that is left', () => {
    expect(canReinvest(100, 100)).toBe(true)
    expect(canReinvest(101, 100)).toBe(false)
    expect(canReinvest(0, 100)).toBe(false)
    expect(canReinvest(-5, 100)).toBe(false)
    expect(canReinvest(NaN, 100)).toBe(false)
  })
})
