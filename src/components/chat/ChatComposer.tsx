import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
  /** Focus on mount — right for a chat-first page, wrong where the chat sits below the fold. */
  autoFocus?: boolean
}

const MAX_HEIGHT = 140

/** A growing textarea: Enter sends, Shift+Enter adds a line. */
export function ChatComposer({ onSend, disabled, placeholder, autoFocus }: ChatComposerProps) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  // Grow with the content up to MAX_HEIGHT, then scroll.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`
  }, [text])

  // Hand focus back once a reply arrives, so the conversation keeps flowing.
  const wasDisabled = useRef(disabled)
  useLayoutEffect(() => {
    if (wasDisabled.current && !disabled) ref.current?.focus()
    wasDisabled.current = disabled
  }, [disabled])

  function submit() {
    const value = text.trim()
    if (!value || disabled) return
    onSend(value)
    setText('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex items-end gap-2">
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-input"
        ref={ref}
        rows={1}
        value={text}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        className="max-h-[140px] min-w-0 flex-1 resize-none rounded-xl border border-surface-700 bg-surface-800/60 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-surface-200/30 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 disabled:opacity-50"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
