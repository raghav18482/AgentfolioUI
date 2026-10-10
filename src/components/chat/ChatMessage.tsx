import { clsx } from 'clsx'
import { Markdown } from '@/components/ui/Markdown'
import type { ChatMessage as ChatMessageModel } from '@/types'

export function ChatMessage({ message }: { message: ChatMessageModel }) {
  const mine = message.role === 'user'
  return (
    <div className={clsx('flex gap-3', mine && 'flex-row-reverse')}>
      <span
        aria-hidden
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
          mine ? 'bg-brand-600 text-white' : 'bg-surface-800 text-brand-300',
        )}
      >
        {mine ? 'You' : 'AI'}
      </span>
      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          mine && 'whitespace-pre-wrap bg-brand-600 text-white',
          !mine && !message.error && 'bg-surface-800 text-surface-200/90',
          message.error && 'border border-rose-500/30 bg-rose-500/10 text-rose-200',
        )}
      >
        <span className="sr-only">{mine ? 'You said:' : 'Assistant said:'}</span>
        {mine || message.error ? message.text : <Markdown content={message.text} />}
      </div>
    </div>
  )
}
