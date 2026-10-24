import { describe, expect, it } from 'vitest'
import { comparePrepayment, compareSipLumpSum, parseNumberInput, planGoal, projectInflation } from './calculators'
import { amortize, emi } from './loans'

describe('parseNumberInput', () => {
  it('reads plain and formatted numbers', () => {
    expect(parseNumberInput('100000')).toBe(100000)
    expect(parseNumberInput('₹1,00,000')).toBe(100000)
    expect(parseNumberInput(' 8.5 ')).toBe(8.5)
    expect(parseNumberInput('.5')).toBe(0.5)
    expect(parseNumberInput('-3')).toBe(-3)
  })

  it('rejects anything that is not wholly a number', () => {
    for (const bad of ['', ' ', 'abc', '12abc', '1.2.3', '1e5', '₹', '--1', '5%']) expect(parseNumberInput(bad), bad).toBeNull()
  })
})

const goal = { costToday: '2000000', years: '12', inflationPct: '8', savedSoFar: '300000', returnPct: '10' }

describe('planGoal', () => {
  it('reproduces the goals lesson example', () => {
    const r = planGoal(goal)
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.futureCost).toBeCloseTo(50_36_340.23, 0)
    expect(Math.round(r.result.monthlyNeeded / 10) * 10).toBe(15_150)
    expect(r.result.costByYear).toHaveLength(13)
  })

  it('projects a corpus that lands exactly on the future cost', () => {
    const r = planGoal(goal)
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.corpusByYear[0]).toBe(3_00_000)
    expect(r.result.corpusByYear[12]).toBeCloseTo(r.result.futureCost, 2)
    expect(r.result.totalToInvest).toBeCloseTo(r.result.monthlyNeeded * 144, 6)
  })

  it('needs nothing more when savings already cover the goal', () => {
    const r = planGoal({ ...goal, savedSoFar: '10000000' })
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.gap).toBe(0)
    expect(r.result.monthlyNeeded).toBe(0)
  })

  it('handles zero inflation and zero return', () => {
    const r = planGoal({ costToday: '120000', years: '1', inflationPct: '0', savedSoFar: '0', returnPct: '0' })
    if (!r.ok) throw new Error('expected a plan')
    expect(r.result.futureCost).toBe(1_20_000)
    expect(r.result.monthlyNeeded).toBe(10_000)
  })

  it('reports one error per invalid field', () => {
    const r = planGoal({ costToday: '0', years: '2.5', inflationPct: '-1', savedSoFar: 'abc', returnPct: '45' })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(Object.keys(r.errors).sort()).toEqual(['costToday', 'inflationPct', 'returnPct', 'savedSoFar', 'years'])
    expect(r.errors.years).toMatch(/whole number/)
    expect(r.errors.returnPct).toMatch(/at most 30/)
  })

  it('rejects horizons outside 1–50 years', () => {
    expect(planGoal({ ...goal, years: '0' }).ok).toBe(false)
    expect(planGoal({ ...goal, years: '51' }).ok).toBe(false)
  })
})

describe('compareSipLumpSum', () => {
  it('grows a lump sum of ₹1 lakh at 10% for 10 years to ₹2,59,374.25', () => {
    const r = compareSipLumpSum({ total: '100000', years: '10', returnPct: '10' })
    if (!r.ok) throw new Error('expected a projection')
    expect(r.result.lumpSumValue).toBeCloseTo(2_59_374.25, 2)
    expect(r.result.monthlyInstalment).toBeCloseTo(100000 / 120, 10)
  })

  it('ends the SIP with exactly the total invested at a 0% return', () => {
    const r = compareSipLumpSum({ total: '120000', years: '5', returnPct: '0' })
    if (!r.ok) throw new Error('expected a projection')
    expect(r.result.sipValue).toBeCloseTo(1_20_000, 6)
    expect(r.result.lumpSumValue).toBe(1_20_000)
    expect(r.result.sipInvestedByYear.at(-1)).toBeCloseTo(1_20_000, 6)
  })

  it('puts the lump sum ahead whenever the assumed return is positive', () => {
    const r = compareSipLumpSum({ total: '600000', years: '3', returnPct: '8' })
    if (!r.ok) throw new Error('expected a projection')
    expect(r.result.lumpSumValue).toBeGreaterThan(r.result.sipValue)
    expect(r.result.sipByYear[0]).toBe(0)
  })

  it('validates inputs', () => {
    const r = compareSipLumpSum({ total: '', years: '60', returnPct: 'x' })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(Object.keys(r.errors).sort()).toEqual(['returnPct', 'total', 'years'])
  })
})

describe('projectInflation', () => {
  const base = { amount: '100000', years: '10', inflationPct: '6', returnPct: '8' }

  it('reproduces the inflation figures used in the lessons and glossary', () => {
    const r = projectInflation(base)
    if (!r.ok) throw new Error('expected a projection')
    expect(r.result.futureCost).toBeCloseTo(1_79_084.77, 1)
    expect(Math.round(r.result.todaysValueOfFutureAmount)).toBe(55_839)
    expect(r.result.realReturnPct).toBeCloseTo(1.8868, 4)
  })

  it('values the invested amount in today’s money at the real return', () => {
    const r = projectInflation(base)
    if (!r.ok) throw new Error('expected a projection')
    expect(r.result.nominalValue).toBeCloseTo(100000 * 1.08 ** 10, 4)
    expect(r.result.realValue).toBeCloseTo(100000 * (1.08 / 1.06) ** 10, 4)
    expect(r.result.realByYear[0]).toBe(100000)
  })

  it('shows a negative real return when inflation beats the return', () => {
    const r = projectInflation({ ...base, inflationPct: '7', returnPct: '5' })
    if (!r.ok) throw new Error('expected a projection')
    expect(r.result.realReturnPct).toBeLessThan(0)
    expect(r.result.realValue).toBeLessThan(100000)
  })

  it('validates inputs', () => {
    expect(projectInflation({ ...base, amount: '-5' }).ok).toBe(false)
    expect(projectInflation({ ...base, inflationPct: '31' }).ok).toBe(false)
  })
})

describe('comparePrepayment', () => {
  // The debt lesson's loan, three years in: ₹40 lakh at 8.5% over 20 years, 204 months left.
  const fullEmi = emi(40_00_000, 8.5, 240)
  const outstanding = amortize(40_00_000, 8.5, fullEmi).balances[36]
  const base = {
    outstanding: String(Math.round(outstanding * 100) / 100),
    ratePct: '8.5',
    months: '204',
    prepayment: '500000',
    returnPct: '10',
    mode: 'tenure' as const,
  }
  const loanEffectiveRate = ((1 + 8.5 / 1200) ** 12 - 1) * 100

  it('reproduces the debt lesson: 50 months and about ₹12.6 lakh of interest saved', () => {
    const r = comparePrepayment(base)
    if (!r.ok) throw new Error('expected a comparison')
    expect(r.result.currentEmi).toBeCloseTo(fullEmi, 2)
    expect(r.result.newEmi).toBeCloseTo(fullEmi, 2)
    expect(r.result.monthsSaved).toBe(50)
    expect(Math.round(r.result.interestSaved / 10_000) * 10_000).toBe(12_60_000)
  })

  it('breaks even at the loan’s own effective rate, in either mode', () => {
    for (const mode of ['tenure', 'emi'] as const) {
      const r = comparePrepayment({ ...base, mode })
      if (!r.ok) throw new Error('expected a comparison')
      expect(r.result.breakEvenReturnPct).toBeCloseTo(loanEffectiveRate, 3)
      const level = comparePrepayment({ ...base, mode, returnPct: String(r.result.breakEvenReturnPct) })
      if (!level.ok) throw new Error('expected a comparison')
      expect(level.result.prepayThenInvest / level.result.investInstead).toBeCloseTo(1, 6)
    }
  })

  it('favours prepaying below the break-even return and investing above it', () => {
    const low = comparePrepayment({ ...base, returnPct: '6' })
    const high = comparePrepayment({ ...base, returnPct: '12' })
    if (!low.ok || !high.ok) throw new Error('expected comparisons')
    expect(low.result.prepayThenInvest).toBeGreaterThan(low.result.investInstead)
    expect(high.result.investInstead).toBeGreaterThan(high.result.prepayThenInvest)
  })

  it('lowers the EMI instead of the tenure when asked, saving less interest', () => {
    const tenure = comparePrepayment(base)
    const lowerEmi = comparePrepayment({ ...base, mode: 'emi' })
    if (!tenure.ok || !lowerEmi.ok) throw new Error('expected comparisons')
    expect(lowerEmi.result.monthsSaved).toBe(0)
    expect(lowerEmi.result.newEmi).toBeLessThan(lowerEmi.result.currentEmi)
    expect(lowerEmi.result.interestSaved).toBeGreaterThan(0)
    expect(lowerEmi.result.interestSaved).toBeLessThan(tenure.result.interestSaved)
  })

  it('closes the loan when the prepayment equals the outstanding amount', () => {
    const r = comparePrepayment({ ...base, outstanding: '500000', months: '60' })
    if (!r.ok) throw new Error('expected a comparison')
    expect(r.result.newEmi).toBe(0)
    expect(r.result.newMonths).toBe(0)
    expect(r.result.monthsSaved).toBe(60)
    expect(r.result.balanceByYear[0]).toBe(5_00_000)
    expect(r.result.prepaidBalanceByYear.every((b) => b === 0)).toBe(true)
  })

  it('shows balances at each year-end, ending at zero', () => {
    const r = comparePrepayment(base)
    if (!r.ok) throw new Error('expected a comparison')
    expect(r.result.balanceByYear).toHaveLength(18)
    expect(r.result.balanceByYear.at(-1)).toBe(0)
    expect(r.result.prepaidBalanceByYear[0]).toBeCloseTo(outstanding - 5_00_000, 2)
  })

  it('rejects a prepayment larger than the loan, and invalid fields', () => {
    const tooBig = comparePrepayment({ ...base, prepayment: '1,00,00,000' })
    expect(tooBig.ok).toBe(false)
    if (!tooBig.ok) expect(tooBig.errors.prepayment).toMatch(/more than the outstanding/)
    const bad = comparePrepayment({ ...base, months: '12.5', ratePct: '40', outstanding: '' })
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(['months', 'outstanding', 'ratePct'])
  })
})
