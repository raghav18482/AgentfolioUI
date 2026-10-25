/**
 * True while rendering on the server, and in the browser when the page arrived
 * as prerendered HTML (`scripts/prerender.ts`). Such a page was rendered for an
 * anonymous visitor, so its first client render must match: the session reads
 * as signed out until the server says otherwise.
 */
export const startedFromPrerender =
  typeof document === 'undefined' || document.getElementById('root')?.hasChildNodes() === true
