import { describe, expect, it } from 'vitest'
import { planPosition } from './positionSize'
import { parseSettings } from './settings'

const base = { capital: '1,00,000', riskPct: '1', entry: '500', stop: '475', rewardRatio: '2' }

describe('planPosition', () => {
  it('sizes so that hitting the stop loses the chosen share of capital', () => {
    const r = planPosition(base)
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.units).toBe(40) // ₹1,000 risk ÷ ₹25 per unit
    expect(r.result.amountAtRisk).toBe(1_000)
    expect(r.result.positionValue).toBe(20_000)
    expect(r.result.positionPctOfCapital).toBe(20)
    expect(r.result.target).toBe(550)
    expect(r.result.cappedByCapital).toBe(false)
  })

  it('rounds units down, so the risk never exceeds the limit', () => {
    const r = planPosition({ ...base, stop: '470' })
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.units).toBe(33) // ₹1,000 ÷ ₹30 = 33.3
    expect(r.result.riskPctOfCapital).toBeLessThanOrEqual(1)
  })

  it('caps the size at what the capital can buy when the stop is very tight', () => {
    const r = planPosition({ ...base, stop: '499.9' })
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.units).toBe(200)
    expect(r.result.cappedByCapital).toBe(true)
    expect(r.result.positionValue).toBeLessThanOrEqual(1_00_000)
  })

  it('rejects a stop at or above the entry for a long trade', () => {
    for (const stop of ['500', '510']) {
      const r = planPosition({ ...base, stop })
      expect(r.ok).toBe(false)
      if (!r.ok) expect(r.errors.stop).toMatch(/below the entry/)
    }
  })

  it('rejects capital too small for one unit, and invalid fields', () => {
    const tiny = planPosition({ ...base, capital: '400' })
    expect(tiny.ok).toBe(false)
    const bad = planPosition({ capital: '0', riskPct: '150', entry: 'x', stop: '-1', rewardRatio: '' })
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(['capital', 'entry', 'rewardRatio', 'riskPct', 'stop'])
  })
})

describe('parseSettings', () => {
  const ok = { seed: '42', fast: '10', slow: '30', costPct: '0.1', riskPct: '1', stopPct: '5', startCash: '1,00,000' }

  it('accepts the defaults', () => {
    const r = parseSettings(ok)
    expect(r.ok && r.result).toEqual({ seed: 42, config: { fast: 10, slow: 30, costPct: 0.1, riskPct: 1, stopPct: 5, startCash: 1_00_000 } })
  })

  it('needs the slow average to be longer than the fast one', () => {
    const r = parseSettings({ ...ok, fast: '30', slow: '30' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.slow).toMatch(/longer/)
  })

  it('rejects out-of-range or non-numeric settings', () => {
    const r = parseSettings({ seed: '0', fast: '1', slow: '500', costPct: '5', riskPct: '0', stopPct: '60', startCash: 'lots' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(Object.keys(r.errors)).toHaveLength(7)
  })
})
