/**
 * Chart colours and the ECharts theme, mapped onto the Tailwind tokens in
 * `src/index.css` so charts and the rest of the UI move together.
 *
 * This is the one module where raw hex is allowed: ECharts draws to a canvas
 * and cannot read CSS variables.
 */

export const COLORS = {
  bg: '#09090b', // surface-950
  surface: '#18181b', // surface-900
  surface2: '#27272a', // surface-800
  border: '#3f3f46', // surface-700
  text: '#e4e4e7', // surface-200
  muted: '#a1a1aa', // zinc-400
  faint: '#71717a', // zinc-500
  accent: '#6366f1', // brand-500
  accentSoft: '#818cf8', // brand-400
  green: '#10b981', // emerald-500
  greenSoft: '#34d399', // emerald-400
  red: '#f43f5e', // rose-500
  redSoft: '#fb7185', // rose-400
  yellow: '#f59e0b', // amber-500
  yellowSoft: '#fbbf24', // amber-400
  blue: '#3b82f6',
  cyan: '#06b6d4',
  orange: '#f97316',
  pink: '#ec4899',
} as const

export const SECTOR_PALETTE = [
  '#6366f1', '#22c55e', '#f97316', '#06b6d4', '#ec4899',
  '#eab308', '#8b5cf6', '#14b8a6', '#f43f5e', '#0ea5e9',
  '#a855f7', '#84cc16', '#ef4444', '#64748b', '#d946ef',
] as const

export const FONT_FAMILY = 'Inter, system-ui, sans-serif'

/** Translucent fill for a rising or falling bar, e.g. volume under a candlestick. */
export const UP_FILL = 'rgba(16, 185, 129, 0.3)'
export const DOWN_FILL = 'rgba(244, 63, 94, 0.3)'
/** Volume bars that are not split into up and down days. */
export const VOLUME_FILL = 'rgba(99, 102, 241, 0.25)'

export function pnlColor(value: number): string {
  if (value > 0) return COLORS.green
  if (value < 0) return COLORS.red
  return COLORS.muted
}

/**
 * A dark-to-saturated ramp for P&L tiles: `intensity` 0 is nearly background,
 * 1 is full green or red. The endpoints are the ones the server-rendered heatmap
 * was tuned with.
 */
export function pnlGradient(value: number, intensity: number): string {
  const t = Math.min(Math.abs(intensity), 1)
  if (value > 0) {
    return `rgb(${Math.round(15 + t * 19)},${Math.round(20 + t * 177)},${Math.round(25 + t * 69)})`
  }
  return `rgb(${Math.round(60 + t * 179)},${Math.round(20 + t * 20)},${Math.round(25 + t * 43)})`
}

/**
 * Escape text for an ECharts HTML tooltip. Formatter output is rendered as
 * HTML, so a symbol or headline must never be interpolated raw.
 */
export function escapeHtml(text: unknown): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const axis = {
  axisLine: { lineStyle: { color: COLORS.border } },
  axisTick: { show: false },
  axisLabel: { color: COLORS.faint, fontSize: 11, fontFamily: FONT_FAMILY },
  splitLine: { lineStyle: { color: COLORS.surface2, type: 'dashed' } },
  nameTextStyle: { color: COLORS.muted },
}

/**
 * Registered once by `EChart` as `agentfolio`. Component defaults live here so
 * each option builder only states what is particular to its chart.
 */
export const CHART_THEME = {
  color: [COLORS.accentSoft, COLORS.greenSoft, COLORS.orange, COLORS.pink, COLORS.cyan, COLORS.yellowSoft],
  backgroundColor: 'transparent',
  textStyle: { fontFamily: FONT_FAMILY, color: COLORS.text },
  tooltip: {
    backgroundColor: 'rgba(24, 24, 27, 0.96)',
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: COLORS.text, fontSize: 12, fontFamily: FONT_FAMILY },
    extraCssText: 'border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.45);',
  },
  legend: {
    textStyle: { color: COLORS.muted, fontSize: 12 },
    inactiveColor: COLORS.border,
  },
  categoryAxis: { ...axis, splitLine: { show: false } },
  valueAxis: { ...axis, axisLine: { show: false } },
  timeAxis: axis,
}
