import { useQuery } from '@tanstack/react-query'
import { fetchFundamental, fetchGlossary, fetchTechnical } from '@/api/research'

/** Valuation, financial health and the score. Yahoo-backed and slow, so kept for the visit. */
export function useFundamental(symbol: string | null) {
  return useQuery({
    queryKey: ['fundamental', symbol],
    queryFn: () => fetchFundamental(symbol!),
    enabled: !!symbol,
    staleTime: 10 * 60_000,
    retry: false,
  })
}

export function useTechnical(symbol: string | null) {
  return useQuery({
    queryKey: ['technical', symbol],
    queryFn: () => fetchTechnical(symbol!),
    enabled: !!symbol,
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export const glossaryQueryKey = ['glossary'] as const

/** Fetched once per visit; the Research popovers and the Learn page share it. */
export function useGlossary() {
  return useQuery({
    queryKey: glossaryQueryKey,
    queryFn: fetchGlossary,
    staleTime: Infinity,
  })
}
