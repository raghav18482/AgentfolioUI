/** Everything a page says about itself in `<head>`: for search results, link previews and structured data. */
export interface HeadMeta {
  /** The full document title, suffix included. */
  title: string
  description?: string
  /** Absolute URL. */
  canonical: string
  /** Absolute URL of the share image. */
  image: string
  noindex: boolean
  jsonLd?: object
}

/** One managed `<head>` element. `selector` finds it; `attrs` (or `text`) is what the page sets. */
export interface HeadEntry {
  tag: 'meta' | 'link' | 'script'
  selector: string
  attrs: Record<string, string>
  text?: string
}

function meta(key: 'name' | 'property', name: string, content: string): HeadEntry {
  return { tag: 'meta', selector: `meta[${key}="${name}"]`, attrs: { [key]: name, content } }
}

/**
 * The tags for one page, in the order they are written. Shared by `PageMeta` in
 * the browser and by the prerender script, so both always emit the same set.
 */
export function headEntries(m: HeadMeta): HeadEntry[] {
  const entries: HeadEntry[] = [
    { tag: 'link', selector: 'link[rel="canonical"]', attrs: { rel: 'canonical', href: m.canonical } },
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', 'Agentfolio'),
    meta('property', 'og:title', m.title),
    meta('property', 'og:url', m.canonical),
    meta('property', 'og:image', m.image),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', m.title),
    meta('name', 'twitter:image', m.image),
  ]
  if (m.description) {
    entries.unshift(meta('name', 'description', m.description))
    entries.push(meta('property', 'og:description', m.description), meta('name', 'twitter:description', m.description))
  }
  if (m.noindex) entries.push(meta('name', 'robots', 'noindex'))
  if (m.jsonLd) {
    entries.push({
      tag: 'script',
      selector: 'script[type="application/ld+json"]',
      attrs: { type: 'application/ld+json' },
      // `<` escaped so text inside the data can never close the script element.
      text: JSON.stringify(m.jsonLd).replace(/</g, '\\u003c'),
    })
  }
  return entries
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** The `<head>` markup for a prerendered page, title included. */
export function renderHeadTags(m: HeadMeta): string {
  const tags = headEntries(m).map(({ tag, attrs, text }) => {
    const attrText = Object.entries(attrs)
      .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
      .join(' ')
    if (tag === 'script') return `<script ${attrText}>${text ?? ''}</script>`
    return `<${tag} ${attrText} />`
  })
  return [`<title>${escapeHtml(m.title)}</title>`, ...tags].join('\n    ')
}
