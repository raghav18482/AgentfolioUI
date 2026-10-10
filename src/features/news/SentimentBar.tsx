interface Props {
  bullish: number
  neutral: number
  bearish: number
}

export function SentimentBar({ bullish, neutral, bearish }: Props) {
  const total = bullish + neutral + bearish
  if (total === 0) return null

  const bPct = (bullish / total) * 100
  const nPct = (neutral / total) * 100
  const rPct = (bearish / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-800">
        {bPct > 0 && (
          <div className="bg-emerald-500 transition-all" style={{ width: `${bPct}%` }} />
        )}
        {nPct > 0 && (
          <div className="bg-amber-500 transition-all" style={{ width: `${nPct}%` }} />
        )}
        {rPct > 0 && (
          <div className="bg-rose-500 transition-all" style={{ width: `${rPct}%` }} />
        )}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-emerald-400">Bullish {bPct.toFixed(0)}%</span>
        <span className="text-amber-400">Neutral {nPct.toFixed(0)}%</span>
        <span className="text-rose-400">Bearish {rPct.toFixed(0)}%</span>
      </div>
    </div>
  )
}
