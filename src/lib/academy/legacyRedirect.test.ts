import { describe, expect, it } from 'vitest'
import { legacyLearnRedirect } from './legacyRedirect'

describe('legacyLearnRedirect', () => {
  it('sends old metric anchors to the metrics guide', () => {
    expect(legacyLearnRedirect('#pe_ratio')).toBe('/learn/metrics#pe_ratio')
    expect(legacyLearnRedirect('#how-it-works')).toBe('/learn/metrics#how-it-works')
  })

  it('leaves /learn alone when there is no hash', () => {
    expect(legacyLearnRedirect('')).toBeNull()
    expect(legacyLearnRedirect('#')).toBeNull()
  })

  it('accepts a hash without the leading #', () => {
    expect(legacyLearnRedirect('roe')).toBe('/learn/metrics#roe')
  })
})
