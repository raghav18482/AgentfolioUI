import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { fetchInsights } from '@/api/ai'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Markdown } from '@/components/ui/Markdown'
import { Spinner } from '@/components/ui/Spinner'
import { useAiKey } from '@/hooks/useAiKey'

export function AiInsightsCard() {
  const { hasKey, cacheKey, credentials } = useAiKey()

  // Each call spends the user's OpenRouter credit, so an answer is kept for the
  // visit and refreshed only on request. The model is deliberately not in the
  // key: switching models should not silently re-bill — Regenerate uses it.
  const insights = useQuery({
    queryKey: ['ai-insights', cacheKey],
    queryFn: async () => fetchInsights(await credentials()),
    enabled: hasKey,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    retry: false,
  })

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">AI Portfolio Insights</h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => insights.refetch()}
          disabled={!hasKey || insights.isFetching}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Regenerate
        </Button>
      </div>

      <div aria-live="polite" aria-busy={insights.isFetching}>
        {!hasKey ? (
          <p className="text-sm text-surface-200/50">Enter your OpenRouter API key above to unlock AI insights.</p>
        ) : insights.isFetching ? (
          <Spinner />
        ) : insights.isError ? (
          <Alert variant="error">{insights.error.message}</Alert>
        ) : insights.data ? (
          <div className="text-sm leading-relaxed text-surface-200/85">
            <Markdown content={insights.data} />
          </div>
        ) : null}
      </div>
    </Card>
  )
}
