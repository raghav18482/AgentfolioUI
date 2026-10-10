import { clsx } from 'clsx'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CodeBlockProps {
  code: string
  label?: string
  /** Substrings the reader must replace or should notice, e.g. a server URL or a path. */
  highlight?: string[]
  className?: string
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function split(code: string, highlight: string[]): Array<{ text: string; marked: boolean }> {
  const terms = highlight.filter(Boolean)
  if (!terms.length) return [{ text: code, marked: false }]
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g')
  return code
    .split(pattern)
    .filter(Boolean)
    .map((text) => ({ text, marked: terms.includes(text) }))
}

export function CodeBlock({ code, label, highlight = [], className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  // The Clipboard API exists only in secure contexts (HTTPS, localhost).
  const canCopy = typeof navigator !== 'undefined' && navigator.clipboard !== undefined

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      // Permission denied: the code is still selectable by hand.
    }
  }

  return (
    <div className={clsx('overflow-hidden rounded-xl border border-surface-800 bg-surface-950/80', className)}>
      {(label || canCopy) && (
        <div className="flex items-center justify-between gap-3 border-b border-surface-800 px-4 py-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-surface-200/50">
            {label}
          </span>
          {canCopy && (
            <button
              type="button"
              onClick={copy}
              aria-label={label ? `Copy ${label}` : 'Copy code'}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-surface-200/60 transition-colors hover:bg-surface-800 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-surface-200/90">
        <code>
          {split(code, highlight).map((part, i) =>
            part.marked ? (
              <mark key={i} className="rounded bg-amber-400/15 px-0.5 text-amber-300">
                {part.text}
              </mark>
            ) : (
              part.text
            ),
          )}
        </code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  )
}
