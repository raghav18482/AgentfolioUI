import { describe, expect, it } from 'vitest'
import { normalize, searchTerms } from './glossarySearch'

const items = [
  { term: 'NAV (Net Asset Value)', aka: ['Net Asset Value'], definition: 'Value of one unit of a fund.', category: 'Funds' },
  { term: 'Inflation', definition: 'Prices rising over time.', category: 'Money basics' },
  { term: 'Equity (shares)', aka: ['Stock'], definition: 'Ownership in a company.', category: 'Investing' },
  { term: 'Index fund', definition: 'A fund that copies an index such as the Nifty 50.', category: 'Funds' },
]
const names = (list: typeof items) => list.map((t) => t.term)

describe('normalize', () => {
  it('folds case, accents and punctuation', () => {
    expect(normalize('P/E')).toBe('pe')
    expect(normalize('  F&O  ')).toBe('fo')
    expect(normalize('Café')).toBe('cafe')
  })
})

describe('searchTerms', () => {
  it('returns everything alphabetically for an empty query', () => {
    expect(names(searchTerms(items, '', null))).toEqual(['Equity (shares)', 'Index fund', 'Inflation', 'NAV (Net Asset Value)'])
  })

  it('ranks a name match above an alias match above a definition match', () => {
    const terms = [
      { term: 'Unit trust', definition: 'Holds stock for investors.', category: 'Funds' },
      { term: 'Equity', aka: ['Stock'], definition: 'Ownership.', category: 'Investing' },
      { term: 'Stock exchange', definition: 'Where shares trade.', category: 'Markets' },
    ]
    expect(searchTerms(terms, 'stock', null).map((t) => t.term)).toEqual(['Stock exchange', 'Equity', 'Unit trust'])
  })

  it('matches aliases and ignores case and punctuation', () => {
    expect(names(searchTerms(items, 'STOCK', null))).toEqual(['Equity (shares)'])
    expect(names(searchTerms(items, 'net asset', null))).toEqual(['NAV (Net Asset Value)'])
  })

  it('filters by category', () => {
    expect(names(searchTerms(items, '', 'Funds'))).toEqual(['Index fund', 'NAV (Net Asset Value)'])
    expect(names(searchTerms(items, 'nifty', 'Money basics'))).toEqual([])
  })

  it('returns nothing when no term matches', () => {
    expect(searchTerms(items, 'zzz', null)).toEqual([])
  })

  it('does not reorder the input array', () => {
    const before = names(items)
    searchTerms(items, '', null)
    expect(names(items)).toEqual(before)
  })
})
