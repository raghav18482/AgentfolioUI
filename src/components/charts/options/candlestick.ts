import type { EChartsOption } from 'echarts'
import type { Candle } from '@/types'
import { formatRupees } from '@/utils/format'
import { COLORS, DOWN_FILL, UP_FILL } from '../theme'
import { paramList, tooltipRow, tooltipTitle } from './tooltip'

/**
 * Daily bars in ECharts' candlestick order. The broker sends
 * `[time, open, high, low, close, volume]`; ECharts wants `[open, close, low, high]`.
 * Passing the broker order straight through — as the old charts did — draws
 * every candle with the day's high as its close.
 */
export interface CandleSeries {
  dates: string[]
  ohlc: Array<[open: number, close: number, low: number, high: number]>
  volumes: number[]
}

export function toCandleSeries(candles: Candle[]): CandleSeries {
  return {
    dates: candles.map((c) => c[0].slice(0, 10)),
    ohlc: candles.map((c) => [c[1], c[4], c[3], c[2]]),
    volumes: candles.map((c) => c[5] || 0),
  }
}

/** Today's date in India, `YYYY-MM-DD` — the date the exchange is trading. */
export function indiaToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now)
}

/**
 * Fold a live price into the series: extend today's bar, or open one if the
 * history ends before today. Returns a new series; the input is untouched.
 */
export function applyTick(series: CandleSeries, ltp: number, today = indiaToday()): CandleSeries {
  const dates = [...series.dates]
  const ohlc = series.ohlc.map((bar) => [...bar] as CandleSeries['ohlc'][number])
  const volumes = [...series.volumes]

  if (dates[dates.length - 1] === today) {
    const bar = ohlc[ohlc.length - 1]
    bar[1] = ltp
    bar[2] = Math.min(bar[2], ltp)
    bar[3] = Math.max(bar[3], ltp)
  } else {
    dates.push(today)
    ohlc.push([ltp, ltp, ltp, ltp])
    volumes.push(0)
  }
  return { dates, ohlc, volumes }
}

function volumeBars(series: CandleSeries) {
  return series.volumes.map((value, i) => ({
    value,
    itemStyle: { color: series.ohlc[i][1] >= series.ohlc[i][0] ? UP_FILL : DOWN_FILL },
  }))
}

/** Just the data, for merging into a live chart with `setOption` on every tick. */
export function candleDataUpdate(series: CandleSeries): EChartsOption {
  return {
    xAxis: [{ data: series.dates }, { data: series.dates }],
    series: [{ data: series.ohlc }, { data: volumeBars(series) }],
  }
}

interface CandlestickOptions {
  /** Draws a dashed "Buy Avg" line at this price. */
  avgBuyPrice?: number | null
  /** Percent of the history initially in view (scroll/pinch to see more). */
  zoomStart?: number
}

/** Price candles over a volume pane, sharing one zoom. */
export function candlestickOption(series: CandleSeries, { avgBuyPrice, zoomStart = 60 }: CandlestickOptions = {}): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: COLORS.muted } },
      formatter: (params) => {
        const candle = paramList(params).find((p) => p.seriesType === 'candlestick')
        if (!candle) return ''
        // Read the source array, not `candle.data`: ECharts prepends the category index to it.
        const [open, close, low, high] = series.ohlc[candle.dataIndex]
        const change = close - open
        const pct = open ? (change / open) * 100 : 0
        const color = change >= 0 ? COLORS.green : COLORS.red
        return (
          tooltipTitle(series.dates[candle.dataIndex]) +
          tooltipRow('Open', formatRupees(open)) +
          tooltipRow('High', formatRupees(high)) +
          tooltipRow('Low', formatRupees(low)) +
          tooltipRow('Close', formatRupees(close)) +
          tooltipRow('Change', `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${pct.toFixed(2)}%)`, color)
        )
      },
    },
    grid: [
      { left: 65, right: 20, top: 20, height: '62%' },
      { left: 65, right: 20, top: '76%', height: '17%' },
    ],
    xAxis: [
      { type: 'category', data: series.dates, gridIndex: 0, axisLabel: { fontSize: 10 } },
      { type: 'category', data: series.dates, gridIndex: 1, axisLabel: { show: false } },
    ],
    yAxis: [
      { scale: true, gridIndex: 0 },
      { scale: true, gridIndex: 1, axisLabel: { show: false }, splitLine: { show: false }, axisPointer: { label: { show: false } } },
    ],
    dataZoom: [{ type: 'inside', xAxisIndex: [0, 1], start: zoomStart, end: 100 }],
    series: [
      {
        type: 'candlestick',
        data: series.ohlc,
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: { color: COLORS.green, color0: COLORS.red, borderColor: COLORS.green, borderColor0: COLORS.red },
        markLine: avgBuyPrice
          ? {
              silent: true,
              symbol: 'none',
              lineStyle: { color: COLORS.yellow, type: 'dashed', width: 2 },
              label: {
                formatter: `Buy Avg: ${formatRupees(avgBuyPrice)}`,
                color: COLORS.yellow,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: 'rgba(245,158,11,.12)',
                padding: [4, 8],
                borderRadius: 4,
              },
              data: [{ yAxis: avgBuyPrice }],
            }
          : undefined,
      },
      {
        type: 'bar',
        data: volumeBars(series),
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 6,
      },
    ],
  }
}
