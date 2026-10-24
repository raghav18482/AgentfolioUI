interface Searchable {
  term: string
  aka?: string[]
  definition: string
  category: string
}

/** Lowercase with accents and punctuation folded away, so "P/E", "pe" and "P.E." compare equal. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Lower is better: a match on the name outranks one on an alias, which outranks the definition. */
function rank(item: Searchable, q: string): number | null {
  const term = normalize(item.term)
  if (term.startsWith(q)) return 0
  if (term.includes(q)) return 1
  if (item.aka?.some((a) => normalize(a).includes(q))) return 2
  if (normalize(item.definition).includes(q)) return 3
  return null
}

/**
 * Terms matching `query` (empty matches everything) within `category` (`null`
 * for all), best matches first and alphabetical within a rank.
 */
export function searchTerms<T extends Searchable>(items: readonly T[], query: string, category: string | null): T[] {
  const q = normalize(query)
  const inCategory = category ? items.filter((t) => t.category === category) : [...items]
  const byName = (a: T, b: T) => a.term.localeCompare(b.term)
  if (!q) return inCategory.sort(byName)

  return inCategory
    .map((item) => ({ item, r: rank(item, q) }))
    .filter((x): x is { item: T; r: number } => x.r !== null)
    .sort((a, b) => a.r - b.r || byName(a.item, b.item))
    .map((x) => x.item)
}
