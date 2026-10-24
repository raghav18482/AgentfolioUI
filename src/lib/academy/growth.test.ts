import { describe, expect, it } from 'vitest'
import { compoundSeries, monthlyInvestmentFor, monthlyRate } from './growth'

describe('compoundSeries', () => {
  it('starts at the original amount and has years + 1 points', () => {
    const s = compoundSeries(10_000, 10, 3)
    expect(s[0]).toBe(10_000)
    expect(s).toHaveLength(4)
    expect(s.map((v) => Math.round(v))).toEqual([10_000, 11_000, 12_100, 13_310])
  })

  it('matches the goal lesson’s future-cost example', () => {
    // ₹20 lakh today at an assumed 8% a year for 12 years ≈ ₹50.4 lakh.
    expect(Math.round(compoundSeries(20, 8, 12)[12] * 10) / 10).toBe(50.4)
  })
})

describe('monthlyRate', () => {
  it('compounds back to the annual rate over twelve months', () => {
    expect((1 + monthlyRate(10)) ** 12).toBeCloseTo(1.1, 12)
    expect(monthlyRate(0)).toBe(0)
  })
})

describe('monthlyInvestmentFor', () => {
  it('matches the goal lesson’s required monthly investment at 10% and 8%', () => {
    const gapAt10 = 50.3634e5 - 3e5 * 1.1 ** 12
    const gapAt8 = 50.3634e5 - 3e5 * 1.08 ** 12
    expect(Math.round(monthlyInvestmentFor(gapAt10, 10, 144) / 10) * 10).toBe(15_150)
    expect(Math.round(monthlyInvestmentFor(gapAt8, 8, 144) / 10) * 10).toBe(18_030)
  })

  it('divides evenly at a zero return and needs nothing for a met target', () => {
    expect(monthlyInvestmentFor(1_20_000, 0, 12)).toBe(10_000)
    expect(monthlyInvestmentFor(0, 10, 12)).toBe(0)
  })

  it('rejects a horizon of no months', () => {
    expect(() => monthlyInvestmentFor(1_00_000, 10, 0)).toThrow()
  })
})
