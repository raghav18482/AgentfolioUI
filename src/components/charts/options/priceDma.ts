import type { EChartsOption } from 'echarts'
import type { TechnicalData } from '@/types'
import { formatRupees } from '@/utils/format'
import { COLORS, VOLUME_FILL } from '../theme'
import { paramList, seriesDot, tooltipRow, tooltipTitle } from './tooltip'

type ChartData = TechnicalData['chart_data']

/** Show roughly the last six months first; the slider and wheel reach the rest. */
const VISIBLE_BARS = 120

export function initialZoomStart(bars: number): number {
  return bars > VISIBLE_BARS ? Math.round((1 - VISIBLE_BARS / bars) * 100) : 0
}

/** `MM-DD` for the axis; the year is implied by the one-year window. */
const shortDate = (v: string) => v.slice(5)

/**
 * The server sends `[open, high, low, close]`; ECharts draws `[open, close, low, high]`.
 */
export function toEChartsOhlc(ohlc: ChartData['ohlc']): Array<[number, number, number, number]> {
  return ohlc.map(([open, high, low, close]) => [open, close, low, high])
}

/** Candles with the 50/200-day averages, the buy average and a volume overlay. */
export function priceDmaOption(cd: ChartData, avgPrice: number | null): EChartsOption {
  const zoomStart = initialZoomStart(cd.dates.length)
  const ohlc = toEChartsOhlc(cd.ohlc)

  const line = (name: string, data: (number | null)[], color: string, extra: object = {}) => ({
    name,
    type: 'line' as const,
    data,
    symbol: 'none',
    smooth: true,
    lineStyle: { color, width: 1.5, ...extra },
    itemStyle: { color },
  })

  const series: NonNullable<EChartsOption['series']> = [
    {
      name: 'Price',
      type: 'candlestick',
      data: ohlc,
      itemStyle: { color: COLORS.green, color0: COLORS.red, borderColor: COLORS.green, borderColor0: COLORS.red },
    },
    {
      name: 'Volume',
      type: 'bar',
      yAxisIndex: 1,
      data: cd.volume,
      barWidth: '60%',
      itemStyle: { color: VOLUME_FILL },
    },
  ]
  if (cd.sma_50.length) series.push(line('50 DMA', cd.sma_50, COLORS.blue))
  if (cd.sma_200.length) series.push(line('200 DMA', cd.sma_200, COLORS.orange))
  if (avgPrice) series.push(line('Avg Buy', cd.dates.map(() => avgPrice), COLORS.yellow, { type: 'dashed' }))

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: COLORS.muted } },
      confine: true,
      formatter: (params) => {
        const list = paramList(params)
        const candle = list.find((p) => p.seriesType === 'candlestick')
        let html = tooltipTitle(cd.dates[list[0].dataIndex])
        if (candle) {
          // Read the source array, not `candle.data`: ECharts prepends the category index to it.
          const [open, close, low, high] = ohlc[candle.dataIndex]
          const change = close - open
          html +=
            tooltipRow('Open', formatRupees(open)) +
            tooltipRow('High', formatRupees(high)) +
            tooltipRow('Low', formatRupees(low)) +
            tooltipRow('Close', formatRupees(close), change >= 0 ? COLORS.green : COLORS.red)
        }
        for (const p of list) {
          if (p.seriesType === 'candlestick' || p.seriesName === 'Volume' || p.value == null) continue
          html += `<div style="color:${COLORS.muted}">${seriesDot(p.color)}${p.seriesName}: ${formatRupees(Number(p.value))}</div>`
        }
        const volume = cd.volume[list[0].dataIndex]
        if (volume != null) html += tooltipRow('Volume', volume.toLocaleString('en-IN'))
        return html
      },
    },
    legend: {
      data: series.map((s) => s.name as string).filter((n) => n !== 'Volume'),
      top: 0,
      left: 'center',
    },
    grid: { top: 35, right: 50, bottom: 65, left: 50, containLabel: true },
    xAxis: { type: 'category', data: cd.dates, boundaryGap: true, axisLabel: { rotate: 30, formatter: shortDate } },
    yAxis: [
      { type: 'value', scale: true, position: 'left' },
      // Volume rides on a hidden second axis, stretched so the bars stay under the candles.
      {
        type: 'value',
        scale: true,
        position: 'right',
        axisLabel: { show: false },
        splitLine: { show: false },
        axisPointer: { label: { show: false } },
        max: (v) => v.max * 4,
      },
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, start: zoomStart, end: 100 },
      {
        type: 'slider',
        xAxisIndex: 0,
        start: zoomStart,
        end: 100,
        height: 22,
        bottom: 8,
        borderColor: COLORS.border,
        fillerColor: 'rgba(99,102,241,.2)',
        textStyle: { color: COLORS.muted, fontSize: 10 },
      },
    ],
    series,
  }
}
