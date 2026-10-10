import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { onUnauthorized } from '@/api/client'
import { sessionQueryKey } from '@/hooks/useSession'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
