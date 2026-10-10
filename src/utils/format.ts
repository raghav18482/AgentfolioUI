const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(n: number | string): string {
  const val = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(val)) return '---'
  return inr.format(val)
}

const wholeInr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** `₹1,23,457` — whole rupees, for chart labels and large totals. */
export function formatRupees(n: number | string | null | undefined): string {
  const val = typeof n === 'string' ? parseFloat(n) : n
  if (val == null || isNaN(val)) return '---'
  return `${val < 0 ? '-' : ''}₹${wholeInr.format(Math.abs(val))}`
}

/** `₹1.25 Cr`, `₹4.30 L`, `₹85,000` — Indian compact notation for amounts in badges. */
export function formatCompactInr(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`
  return `${sign}₹${wholeInr.format(abs)}`
}

export function formatPct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

export function formatNum(n: number, decimals = 2): string {
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function pnlColor(val: number): string {
  if (val > 0) return 'text-emerald-400'
  if (val < 0) return 'text-rose-400'
  return 'text-surface-200'
}

export function pnlBg(val: number): string {
  if (val > 0) return 'bg-emerald-500/10'
  if (val < 0) return 'bg-rose-500/10'
  return 'bg-surface-800'
}

/** `RELIANCE-EQ` → `RELIANCE`: the equity-series suffix is noise everywhere it is shown. */
export function displaySymbol(symbol: string): string {
  return symbol.replace(/-EQ$/, '')
}

/** `+1.25%` / `-0.40%` with a caller-chosen precision. */
export function signedPct(n: number, decimals = 2): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`
}

/**
 * A broker amount — Angel One sends numbers as strings, and "N/A" when it has
 * none — as a number, or `null` when there is nothing real to show.
 */
export function parseAmount(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : null
}
