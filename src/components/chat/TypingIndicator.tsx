export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-800 text-[11px] font-semibold text-brand-300"
      >
        AI
      </span>
      <div className="flex items-center gap-1 rounded-2xl bg-surface-800 px-4 py-3" role="status" aria-label="Assistant is typing">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-200/60"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
