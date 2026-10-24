import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * The element id in the URL hash, once the content that holds it has rendered —
 * outlined for a moment after scrolling to it. A Research popover links to the
 * metrics guide with `/learn/metrics#pe_ratio`; the glossary uses `#sif`.
 */
export function useHashTarget(ready: boolean): string | null {
  const { hash } = useLocation()
  // The hash whose outline has already faded, so the highlight is derived from the
  // URL rather than set from inside the effect.
  const [faded, setFaded] = useState<string | null>(null)
  const id = ready && hash ? decodeURIComponent(hash.slice(1)) : null

  useEffect(() => {
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    const timer = setTimeout(() => setFaded(id), 2400)
    return () => clearTimeout(timer)
  }, [id])

  return id && faded !== id ? id : null
}
