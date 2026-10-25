import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { headEntries, type HeadMeta } from '@/seo/head'
import { MetaCollectorContext } from '@/seo/metaCollector'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/seo/routes'

interface PageMetaProps {
  title: string
  description?: string
  /** Use `title` as the whole document title, without the `· Agentfolio` suffix. */
  fullTitle?: boolean
  /** Share image path, e.g. `/og/lessons/x.png`. Defaults to the site image. */
  image?: string
  /** Keep the page out of search results (sign-in forms, not-found). */
  noindex?: boolean
  /** schema.org structured data for the page. */
  jsonLd?: object
}

/**
 * Sets the document title, description, canonical URL, share tags and
 * structured data while the page is mounted, and restores the previous values
 * after. Set imperatively rather than with React 19's hoisted `<title>`:
 * `index.html` already has a `<title>`, and the browser reads whichever comes
 * first in the head. Prerendered pages get the same tags written into their
 * HTML by `scripts/prerender.ts`.
 */
export function PageMeta({ title, description, fullTitle, image, noindex = false, jsonLd }: PageMetaProps) {
  const { pathname } = useLocation()
  const meta: HeadMeta = {
    title: fullTitle ? title : `${title} · Agentfolio`,
    description,
    canonical: SITE_URL + pathname,
    image: SITE_URL + (image ?? DEFAULT_OG_IMAGE),
    noindex,
    jsonLd,
  }

  // Only set during a server render, where the effect below never runs.
  useContext(MetaCollectorContext)?.(meta)

  // Serialised so a fresh `jsonLd` object each render doesn't re-run the effect.
  const key = JSON.stringify(meta)
  useEffect(() => {
    const m = JSON.parse(key) as HeadMeta
    const previousTitle = document.title
    document.title = m.title

    const restores = headEntries(m).map(({ tag, selector, attrs, text }) => {
      let el = document.head.querySelector<HTMLElement>(selector)
      const created = !el
      if (!el) {
        el = document.createElement(tag)
        document.head.appendChild(el)
      }
      const previous = Object.fromEntries(Object.keys(attrs).map((k) => [k, el.getAttribute(k)]))
      const previousText = el.textContent
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
      if (text !== undefined) el.textContent = text

      return () => {
        if (created) return el.remove()
        for (const [k, v] of Object.entries(previous)) {
          if (v === null) el.removeAttribute(k)
          else el.setAttribute(k, v)
        }
        if (text !== undefined) el.textContent = previousText
      }
    })

    return () => {
      document.title = previousTitle
      for (const restore of restores.reverse()) restore()
    }
  }, [key])

  return null
}
