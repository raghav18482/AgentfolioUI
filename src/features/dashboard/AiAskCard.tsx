import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { askPortfolio } from '@/api/ai'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Markdown } from '@/components/ui/Markdown'
import { Spinner } from '@/components/ui/Spinner'
import { useAiKey } from '@/hooks/useAiKey'

const STARTER_QUESTIONS = [
  'How diversified is my portfolio?',
  'Which stocks are underperforming?',
  'What is my risk exposure?',
  'Suggest rebalancing strategies',
  'Summarize my portfolio health',
]

export function AiAskCard() {
  const { hasKey, credentials } = useAiKey()
  const [draft, setDraft] = useState('')
  const [asked, setAsked] = useState<string | null>(null)

  const ask = useMutation({
    mutationFn: async (question: string) => askPortfolio(question, await credentials()),
  })

  function submit(question: string) {
    const q = question.trim()
    if (!q || ask.isPending) return
    setAsked(q)
    setDraft('')
    ask.mutate(q)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit(draft)
  }

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-white">Ask AI About Your Portfolio</h2>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Suggested questions">
        {STARTER_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={!hasKey || ask.isPending}
            onClick={() => submit(q)}
            className="cursor-pointer rounded-full border border-surface-700 bg-surface-800/50 px-3 py-1.5 text-xs text-surface-200/80 transition-colors hover:border-brand-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          aria-label="Your question"
          placeholder={hasKey ? 'Ask anything about your portfolio...' : 'Save your OpenRouter key above to ask questions'}
          disabled={!hasKey}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-surface-700 bg-surface-800/60 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-surface-200/30 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 disabled:opacity-50"
        />
        <Button type="submit" size="md" disabled={!hasKey || !draft.trim()} loading={ask.isPending}>
          <Send className="h-4 w-4" aria-hidden />
          Ask
        </Button>
      </form>

      {asked && (
        <div className="mt-5 border-t border-surface-800/60 pt-4" aria-live="polite" aria-busy={ask.isPending}>
          <p className="mb-3 text-xs font-medium text-surface-200/50">{asked}</p>
          {ask.isPending ? (
            <Spinner />
          ) : ask.isError ? (
            <Alert variant="error">{ask.error.message}</Alert>
          ) : ask.data ? (
            <div className="text-sm leading-relaxed text-surface-200/85">
              <Markdown content={ask.data} />
            </div>
          ) : null}
        </div>
      )}
    </Card>
  )
}
