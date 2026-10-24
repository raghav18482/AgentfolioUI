import { describe, expect, it } from 'vitest'
import { LESSONS } from '../content'
import { CALCULATORS, calculatorFrom, calculatorPath } from './ids'

describe('calculator ids', () => {
  it('selects the tab named in ?tool=, and the goal planner otherwise', () => {
    expect(calculatorFrom('sip')).toBe('sip')
    expect(calculatorFrom('inflation')).toBe('inflation')
    expect(calculatorFrom(null)).toBe('goal')
    expect(calculatorFrom('prepay')).toBe('prepay')
    expect(calculatorFrom('trading')).toBe('goal')
  })

  it('builds the links lessons use', () => {
    expect(calculatorPath('sip')).toBe('/learn/calculators?tool=sip')
  })

  it('are unique, and every lesson link points at one that exists', () => {
    const ids = CALCULATORS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const l of LESSONS) for (const id of l.calculators ?? []) expect(ids, l.slug).toContain(id)
    expect(LESSONS.some((l) => l.calculators?.length)).toBe(true)
  })
})
