import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Fonts ship with the build (no request to Google before text can render); each
// weight's file covers every script, and the browser fetches only the ranges a page uses.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import './index.css'
import App from './App'
import { onUnauthorized } from '@/api/client'
import { sessionQueryKey } from '@/hooks/useSession'
import { QUERY_SEED_ID, startedFromPrerender, type QuerySeed } from '@/lib/prerender'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// A signed-in request answered 401 means the session ended mid-visit. Re-ask the
// server who we are; the route guard sends an anonymous answer to /login.
onUnauthorized(() => {
  queryClient.invalidateQueries({ queryKey: sessionQueryKey })
})

// Data the page was prerendered with: rendering from it keeps the first render
// identical to the HTML. Refreshed once the page is live, in case it has changed since the build.
const seedScript = document.getElementById(QUERY_SEED_ID)
const seeds: QuerySeed[] = seedScript ? JSON.parse(seedScript.textContent ?? '[]') : []
for (const { key, data } of seeds) queryClient.setQueryData(key, data)

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)

// Public pages arrive as prerendered HTML (`scripts/prerender.ts`): adopt it
// rather than replace it, so there is no flash while the route's code loads.
if (startedFromPrerender) hydrateRoot(root, app)
else createRoot(root).render(app)

if (seeds.length) {
  window.addEventListener('load', () => {
    for (const { key } of seeds) void queryClient.invalidateQueries({ queryKey: key })
  })
}
