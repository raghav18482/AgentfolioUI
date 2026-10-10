import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { fetchFundamentalSummary } from '@/api/ai'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Markdown } from '@/components/ui/Markdown'
import { Spinner } from '@/components/ui/Spinner'

/**
 * A plain-English reading of one stock, written by the server with its own
 * OpenRouter key — nothing for the user to set up. Cached per stock for the visit;
 * Regenerate also asks the server to skip its own cache.
 */
export function AiSummaryCard({ symbol }: { symbol: string }) {
  // The query key carries the symbol, so a slow reply for a stock the user has
  // already left lands in that stock's cache entry, never on screen.
  const refreshNext = useRef(false)

  const summary = useQuery({
    queryKey: ['fundamental-summary', symbol],
    queryFn: async () => {
      const refresh = refreshNext.current
      refreshNext.current = false
      return fetchFundamentalSummary(symbol, refresh)
    },
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    retry: false,
  })

  function regenerate() {
    refreshNext.current = true
    void summary.refetch()
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">What this means, in plain English</h2>
        <Button size="sm" variant="secondary" onClick={regenerate} disabled={summary.isFetching}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Regenerate
        </Button>
      </div>
      <div aria-live="polite" aria-busy={summary.isFetching}>
        {summary.isFetching ? (
          <Spinner />
        ) : summary.isError ? (
          <Alert variant="error">{summary.error.message}</Alert>
        ) : summary.data ? (
          <div className="text-sm leading-relaxed text-surface-200/85">
            <Markdown content={summary.data.summary} />
          </div>
        ) : null}
      </div>
    </Card>
  )
}
