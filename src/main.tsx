import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { onUnauthorized } from '@/api/client'
import { sessionQueryKey } from '@/hooks/useSession'
import { startedFromPrerender } from '@/lib/prerender'

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
