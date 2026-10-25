// Never hot-reloaded: this module only runs in Node, from scripts/prerender.ts.
/* oxlint-disable react/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { LESSONS } from '@/features/academy/content'
import { glossaryQueryKey } from '@/hooks/useResearch'
import type { QuerySeed } from '@/lib/prerender'
import type { HeadMeta } from '@/seo/head'
import { MetaCollectorContext } from '@/seo/metaCollector'

export { renderHeadTags } from '@/seo/head'
export { prerenderedPaths, SITE_URL } from '@/seo/routes'
export { QUERY_SEED_ID } from '@/lib/prerender'
export { glossaryQueryKey }

/** Lesson titles for the per-lesson share images. */
export const lessonCards = LESSONS.map((l) => ({ slug: l.slug, title: l.title, minutes: l.minutes }))

/**
 * Render one public page to HTML for an anonymous visitor, waiting for its
 * lazy-loaded route. Used only by `scripts/prerender.ts` at build time.
 */
export async function renderPage(url: string, seeds: QuerySeed[] = []): Promise<{ html: string; meta?: HeadMeta }> {
  let meta: HeadMeta | undefined
  // Nothing is fetched on the server: queries are pending unless the script seeded
  // their data, and the session reads as signed out.
  const queryClient = new QueryClient()
  for (const { key, data } of seeds) queryClient.setQueryData(key, data)

  const { prelude } = await prerender(
    <MetaCollectorContext.Provider value={(m) => (meta = m)}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </QueryClientProvider>
    </MetaCollectorContext.Provider>,
  )

  const html = await new Response(prelude).text()
  return { html, meta }
}
