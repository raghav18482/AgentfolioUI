import type { DefaultLabelFormatterCallbackParams, TooltipComponentFormatterCallbackParams } from 'echarts'
import { COLORS, escapeHtml } from '../theme'

type Params = DefaultLabelFormatterCallbackParams

/** Tooltip params are one entry for item triggers and a list for axis triggers. */
export function paramList(p: TooltipComponentFormatterCallbackParams): Params[] {
  return Array.isArray(p) ? p : [p]
}

/** The bold first line of a tooltip. */
export function tooltipTitle(text: unknown): string {
  return `<div style="font-weight:600;color:${COLORS.text};margin-bottom:4px">${escapeHtml(text)}</div>`
}

/** One `label: value` line; `value` is trusted markup built by the caller. */
export function tooltipRow(label: string, value: string, color?: string): string {
  const styled = color ? `<span style="color:${color};font-weight:600">${value}</span>` : value
  return `<div style="color:${COLORS.muted}">${escapeHtml(label)}: ${styled}</div>`
}

/** A series marker dot, as ECharts draws beside a legend entry. */
export function seriesDot(color: unknown): string {
  return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${escapeHtml(color)};margin-right:6px"></span>`
}
