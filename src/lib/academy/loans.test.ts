import { describe, expect, it } from 'vitest'
import { amortize, emi } from './loans'

describe('emi', () => {
  it('matches the standard reducing-balance formula', () => {
    expect(emi(40_00_000, 8.5, 240)).toBeCloseTo(34_712.93, 2)
    expect(emi(10_00_000, 9, 60)).toBeCloseTo(20_758.36, 2)
  })

  it('splits the principal evenly at a zero rate', () => {
    expect(emi(1_20_000, 0, 12)).toBe(10_000)
  })

  it('rejects a non-positive principal or tenure', () => {
    expect(() => emi(0, 8, 12)).toThrow()
    expect(() => emi(1_00_000, 8, 0)).toThrow()
  })
})

describe('amortize', () => {
  const P = 40_00_000
  const RATE = 8.5
  const EMI = emi(P, RATE, 240)

  it('repays the loan in exactly the tenure the EMI was set for', () => {
    const s = amortize(P, RATE, EMI)
    expect(s.months).toBe(240)
    expect(s.balances[0]).toBe(P)
    expect(s.balances.at(-1)).toBe(0)
    expect(s.totalInterest).toBeCloseTo(EMI * 240 - P, 0)
  })

  it('reproduces the debt lesson’s prepayment example', () => {
    const base = amortize(P, RATE, EMI)
    const prepaid = amortize(P, RATE, EMI, [{ afterMonth: 36, amount: 5_00_000 }])
    expect(base.months - prepaid.months).toBe(50)
    expect(Math.round((base.totalInterest - prepaid.totalInterest) / 10_000) * 10_000).toBe(12_60_000)
  })

  it('never lets the balance go negative, even when a prepayment clears the loan', () => {
    const s = amortize(1_00_000, 10, emi(1_00_000, 10, 12), [{ afterMonth: 2, amount: 5_00_000 }])
    expect(s.months).toBe(2)
    expect(Math.min(...s.balances)).toBe(0)
  })

  it('rejects an EMI that cannot cover the interest', () => {
    expect(() => amortize(10_00_000, 12, 10_000)).toThrow()
  })
})
