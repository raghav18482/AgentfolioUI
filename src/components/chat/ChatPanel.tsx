import { useEffect, useRef, type ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { ChatMessage as ChatMessageModel } from '@/types'
import { ChatComposer } from './ChatComposer'
import { ChatMessage } from './ChatMessage'
import { TypingIndicator } from './TypingIndicator'

export interface ChatStarter {
  label: string
  prompt: string
}

interface ChatPanelProps {
  messages: ChatMessageModel[]
  busy: boolean
  /** A saved conversation is being fetched. */
  loading?: boolean
  onSend: (text: string) => void
  emptyTitle: string
  emptyDescription: ReactNode
  starters: ChatStarter[]
  placeholder: string
  footnote?: ReactNode
  /** CSS height of the whole panel, e.g. `calc(100vh - 14rem)`. */
  height: string
  autoFocus?: boolean
}

/** The conversation surface: empty state with starters, messages, composer, footnote. */
export function ChatPanel({
  messages,
  busy,
  loading,
  onSend,
  emptyTitle,
  emptyDescription,
  starters,
  placeholder,
  footnote,
  height,
  autoFocus,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, busy])

  const empty = messages.length === 0 && !busy

  return (
    <Card padding={false} className="flex flex-col overflow-hidden">
      <div style={{ height }} className="flex min-h-[24rem] flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5" aria-live="polite">
          {loading ? (
            <Spinner />
          ) : empty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <MessagesSquare className="h-10 w-10 text-surface-200/25" aria-hidden />
              <h2 className="text-base font-semibold text-white">{emptyTitle}</h2>
              <p className="max-w-sm text-sm text-surface-200/55">{emptyDescription}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2" role="group" aria-label="Suggested questions">
                {starters.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => onSend(s.prompt)}
                    className="cursor-pointer rounded-full border border-surface-700 bg-surface-800/50 px-3 py-1.5 text-xs text-surface-200/80 transition-colors hover:border-brand-500/50 hover:text-white"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}
              {busy && <TypingIndicator />}
            </div>
          )}
        </div>
        <div className="border-t border-surface-800 p-4">
          <ChatComposer onSend={onSend} disabled={busy} placeholder={placeholder} autoFocus={autoFocus} />
          {footnote && <p className="mt-2 text-[11px] text-surface-200/45">{footnote}</p>}
        </div>
      </div>
    </Card>
  )
}
