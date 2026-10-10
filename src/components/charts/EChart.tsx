import { useEffect, useLayoutEffect, useRef } from 'react'
// Aliased: a bare `use` reads as React's hook to the rules-of-hooks lint.
import { init, registerTheme, use as registerModules, type ECharts } from 'echarts/core'
import {
  BarChart,
  CandlestickChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  ScatterChart,
  TreemapChart,
} from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { CHART_THEME } from './theme'

// Register only what the app draws, so the bundle carries nothing else.
registerModules([
  BarChart,
  CandlestickChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  ScatterChart,
  TreemapChart,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])
registerTheme('agentfolio', CHART_THEME)

interface EChartProps {
  /**
   * The full chart definition, from a builder in `charts/options`. Memoise it:
   * a new object identity redraws the chart from scratch.
   */
  option: EChartsOption
  height?: number | string
  /** What the chart shows, for screen readers — the canvas itself is opaque to them. */
  ariaLabel: string
  className?: string
  /**
   * Receives the live instance once mounted, for charts updated imperatively
   * between renders — live ticks, slider-driven what-ifs.
   */
  onReady?: (chart: ECharts) => void
}

/**
 * The only component that touches ECharts. Owns init, resize and dispose, so a
 * chart can never leak an instance or an observer however its page re-renders.
 */
export function EChart({ option, height = 320, ariaLabel, className, onReady }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)
  const onReadyRef = useRef(onReady)

  useLayoutEffect(() => {
    onReadyRef.current = onReady
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const chart = init(el, 'agentfolio', { renderer: 'canvas' })
    chartRef.current = chart
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(el)
    onReadyRef.current?.(chart)
    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true })
  }, [option])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ width: '100%', height }}
    />
  )
}
