import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description?: string
}

/**
 * Sets the document title and meta description while the page is mounted and
 * restores the previous values after. Set imperatively rather than with React
 * 19's hoisted `<title>`: `index.html` already has a `<title>`, and the browser
 * reads whichever comes first in the head.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} · Agentfolio`

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const created = !meta
    const previousDescription = meta?.content ?? ''
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    return () => {
      document.title = previousTitle
      if (!meta) return
      if (created) meta.remove()
      else meta.content = previousDescription
    }
  }, [title, description])

  return null
}
