import { LESSONS } from '@/features/academy/content'

/** The public origin: canonical URLs, the sitemap and share-image links all point here. */
export const SITE_URL = 'https://agentfolio.in'

/** Share image used when a page doesn't name its own. Generated at build by `scripts/prerender.ts`. */
export const DEFAULT_OG_IMAGE = '/og-image.png'

/** Per-lesson share image, generated alongside the default one. */
export function lessonOgImage(slug: string): string {
  return `/og/lessons/${slug}.png`
}

/**
 * Pages built to static HTML for search engines and link previews. Everything
 * here is public and renders the same for every visitor before sign-in.
 */
export function prerenderedPaths(): string[] {
  return [
    '/',
    '/setup',
    '/connect',
    '/learn',
    '/learn/glossary',
    '/learn/calculators',
    '/learn/trading-lab',
    '/learn/metrics',
    ...LESSONS.map((l) => `/learn/lessons/${l.slug}`),
  ]
}

/**
 * Pages that only work in the browser (sign-in forms and the signed-in app).
 * `vercel.json` rewrites each to `index.html`; anything neither prerendered nor
 * listed here gets a real 404. `routes.test.ts` keeps the three in step.
 */
export const CLIENT_ONLY_PATHS = [
  '/login',
  '/enroll',
  '/dashboard',
  '/positions',
  '/orders',
  '/analytics',
  '/agent',
  '/news',
  '/research',
  '/sectors',
  '/trading',
] as const
