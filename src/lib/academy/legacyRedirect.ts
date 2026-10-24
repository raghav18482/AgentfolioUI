/**
 * `/learn` used to be the metrics guide, and Research popovers and bookmarks
 * link into it as `/learn#pe_ratio` or `/learn#how-it-works`. The Academy home
 * uses no anchors of its own, so any hash on `/learn` belongs to the guide,
 * which now lives at `/learn/metrics`.
 */
export function legacyLearnRedirect(hash: string): string | null {
  if (!hash || hash === '#') return null
  return `/learn/metrics${hash.startsWith('#') ? hash : `#${hash}`}`
}
