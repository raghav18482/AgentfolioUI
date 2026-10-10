import type { EChartsOption } from 'echarts'
import type { TechnicalData } from '@/types'
import { COLORS } from '../theme'
import { paramList, seriesDot, tooltipTitle } from './tooltip'
import { initialZoomStart } from './priceDma'

const shortDate = (v: string) => v.slice(5)

/** MACD and signal lines over a histogram that turns red below zero. */
export function macdOption(cd: TechnicalData['chart_data']): EChartsOption {
  const zoomStart = initialZoomStart(cd.dates.length)
  return {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params) => {
        const list = paramList(params)
        const rows = list
          .filter((p) => p.value != null)
          .map((p) => `<div style="color:${COLORS.muted}">${seriesDot(p.color)}${p.seriesName}: <b>${Number(p.value).toFixed(2)}</b></div>`)
          .join('')
        return tooltipTitle(cd.dates[list[0].dataIndex]) + rows
      },
    },
    legend: { data: ['MACD', 'Signal', 'Histogram'], top: 0, left: 'center' },
    grid: { top: 30, right: 30, bottom: 40, left: 30, containLabel: true },
    xAxis: { type: 'category', data: cd.dates, boundaryGap: true, axisLabel: { rotate: 30, formatter: shortDate } },
    yAxis: { type: 'value', scale: true },
    dataZoom: [{ type: 'inside', start: zoomStart, end: 100 }],
    series: [
      {
        name: 'Histogram',
        type: 'bar',
        data: cd.macd_histogram.map((v) => ({
          value: v,
          itemStyle: { color: v != null && v < 0 ? 'rgba(244,63,94,.5)' : 'rgba(16,185,129,.5)' },
        })),
      },
      { name: 'MACD', type: 'line', data: cd.macd_line, symbol: 'none', lineStyle: { color: COLORS.blue, width: 1.5 }, itemStyle: { color: COLORS.blue } },
      { name: 'Signal', type: 'line', data: cd.macd_signal, symbol: 'none', lineStyle: { color: COLORS.orange, width: 1.5 }, itemStyle: { color: COLORS.orange } },
    ],
  }
}
