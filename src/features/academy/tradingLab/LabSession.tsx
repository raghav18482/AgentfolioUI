import { clsx } from 'clsx'
import { FastForward, Pause, RotateCcw, SkipForward, TrendingDown, TrendingUp } from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import type { SyntheticSeries } from '@/lib/tradingLab/data'
import {
  buyAndHold,
  canAct,
  equityAt,
  isDone,
  maxDrawdownPct,
  plannedUnits,
  runStrategy,
  startLab,
  step,
  strategyAction,
  summarise,
  type Action,
  type LabConfig,
  type LabState,
} from '@/lib/tradingLab/simulator'
import { crossoverSignals, sma, type Signal } from '@/lib/tradingLab/strategy'
import { formatRupees } from '@/utils/format'

const LabChart = lazy(() => import('./LabChart').then((m) => ({ default: m.LabChart })))

const price = (n: number) => `₹${n.toFixed(2)}`
const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

/** What changed between two states, in a sentence. */
function describeStep(prev: LabState, next: LabState, action: Action, bars: SyntheticSeries['bars']): string {
  const day = next.cursor + 1
  const newTrades = next.trades.slice(prev.trades.length)
  const parts: string[] = []
  if (!prev.position && next.position) {
    parts.push(`Bought ${next.position.units} units at day ${day}’s open, ${price(next.position.entryPrice)}. Stop set at ${price(next.position.stop)}.`)
  }
  for (const t of newTrades) {
    if (t.exit === 'sell') parts.push(`Sold ${t.units} units at day ${day}’s open, ${price(t.exitPrice)}: ${t.pnl >= 0 ? 'gain' : 'loss'} of ${formatRupees(Math.abs(t.pnl))} after costs.`)
    else parts.push(`Stopped out on day ${day} at ${price(t.exitPrice)}: ${t.pnl >= 0 ? 'gain' : 'loss'} of ${formatRupees(Math.abs(t.pnl))} after costs.`)
  }
  if (!parts.length) parts.push(action === 'wait' ? `Waited. Day ${day} closed at ${price(bars[next.cursor].close)}.` : 'No trade was possible.')
  return parts.join(' ')
}

function signalAt(series: SyntheticSeries, state: LabState, config: LabConfig): Signal {
  const visible = series.bars.slice(0, state.cursor + 1).map((b) => b.close)
  return crossoverSignals(visible, config.fast, config.slow)[state.cursor]
}

interface LabSessionProps {
  series: SyntheticSeries
  config: LabConfig
  onNewMarket: () => void
}

/** One run through one synthetic market. Remount (via `key`) to start over with new settings. */
export function LabSession({ series, config, onNewMarket }: LabSessionProps) {
  const { bars } = series
  const [state, setState] = useState(() => startLab(bars, config))
  const [event, setEvent] = useState<string | null>(null)

  const done = isDone(state, bars)
  const signal = signalAt(series, state, config)
  const ruleSays = strategyAction(signal, state)
  const visibleCloses = useMemo(() => bars.slice(0, state.cursor + 1).map((b) => b.close), [bars, state.cursor])
  const fast = useMemo(() => sma(visibleCloses, config.fast), [visibleCloses, config.fast])
  const slow = useMemo(() => sma(visibleCloses, config.slow), [visibleCloses, config.slow])

  function act(action: Action) {
    const next = step(state, bars, config, action)
    setEvent(describeStep(state, next, action, bars))
    setState(next)
  }

  /** Waits until the rule signals, a stop fires, or the series ends. */
  function waitForSignal() {
    let s = state
    do {
      const prevTrades = s.trades.length
      s = step(s, bars, config, 'wait')
      if (s.trades.length > prevTrades) break
    } while (!isDone(s, bars) && signalAt(series, s, config) === null)
    setEvent(
      s.trades.length > state.trades.length
        ? describeStep(state, s, 'wait', bars)
        : isDone(s, bars)
          ? 'Reached the last day with no further signal.'
          : `Skipped to day ${s.cursor + 1}: the averages crossed at today’s close.`,
    )
    setState(s)
  }

  function finishWithRule() {
    const s = runStrategy(bars, config, state)
    const closed = s.trades.length - state.trades.length
    setEvent(
      `Let the crossover rule run to the end: ${closed} trade${closed === 1 ? '' : 's'} closed${s.position ? ', and a position is still open at the last close' : ''}.`,
    )
    setState(s)
  }

  function restart() {
    setState(startLab(bars, config))
    setEvent(null)
  }

  const units = plannedUnits(state, bars, config)
  const today = bars[state.cursor]
  const equity = equityAt(state, bars)
  const unrealised = state.position ? (today.close - state.position.entryPrice) * state.position.units - state.position.entryCost : 0

  return (
    <div className="space-y-6">
      <Card className="space-y-4" padding={false}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 sm:px-6">
          <p className="text-sm font-semibold text-white">
            Day {today.day} of {bars.length}
            <span className="ml-2 text-xs font-normal text-surface-200/50">· synthetic market, seed shown in settings</span>
          </p>
          <p className="text-xs text-surface-200/55">
            Close {price(today.close)} · Equity <span className="font-semibold text-white">{formatRupees(equity)}</span>
          </p>
        </div>
        <div className="px-2 sm:px-3">
          <Suspense fallback={<Skeleton height={340} />}>
            <LabChart
              bars={bars}
              cursor={state.cursor}
              fast={fast}
              slow={slow}
              fastPeriod={config.fast}
              slowPeriod={config.slow}
              trades={state.trades}
              position={state.position}
            />
          </Suspense>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Card className="space-y-4">
          <StrategyHint signal={signal} ruleSays={ruleSays} holding={state.position !== null} config={config} done={done} />

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => act('buy')} disabled={!canAct('buy', state, bars, config)}>
              <TrendingUp className="h-4 w-4" aria-hidden />
              Buy
            </Button>
            <Button variant="danger" onClick={() => act('sell')} disabled={!canAct('sell', state, bars, config)}>
              <TrendingDown className="h-4 w-4" aria-hidden />
              Sell
            </Button>
            <Button variant="secondary" onClick={() => act('wait')} disabled={done}>
              <Pause className="h-4 w-4" aria-hidden />
              Wait a day
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={waitForSignal} disabled={done}>
              <SkipForward className="h-4 w-4" aria-hidden />
              Wait for the next signal
            </Button>
            <Button variant="ghost" size="sm" onClick={finishWithRule} disabled={done}>
              <FastForward className="h-4 w-4" aria-hidden />
              Let the rule finish
            </Button>
            <Button variant="ghost" size="sm" onClick={restart}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restart this market
            </Button>
          </div>

          {!state.position && !done && (
            <p className="text-xs leading-relaxed text-surface-200/60">
              {units >= 1
                ? `A Buy now would get about ${units} units — sized so the ${config.stopPct}% stop loses about ${config.riskPct}% of equity — filled at tomorrow’s open.`
                : 'A Buy is not possible: not enough cash for one unit at this price.'}
            </p>
          )}
          <p className="min-h-5 text-sm text-surface-200/80" role="status" aria-live="polite">
            {event ?? 'Decide at today’s close. Your order fills at the next day’s open.'}
          </p>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-sm font-bold text-white">Account</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Row label="Cash" value={formatRupees(state.cash)} />
            <Row label="Equity" value={formatRupees(equity)} />
            {state.position ? (
              <>
                <Row label="Units held" value={state.position.units.toLocaleString('en-IN')} />
                <Row label="Entry" value={price(state.position.entryPrice)} />
                <Row label="Stop" value={price(state.position.stop)} />
                <Row
                  label="Open P&L"
                  value={formatRupees(unrealised)}
                  className={unrealised >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                />
              </>
            ) : (
              <Row label="Position" value="None" />
            )}
          </dl>
        </Card>
      </div>

      <Summary series={series} state={state} config={config} done={done} onNewMarket={onNewMarket} />
      <TradeHistory state={state} bars={bars} />
    </div>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <>
      <dt className="text-surface-200/55">{label}</dt>
      <dd className={clsx('text-right font-semibold tabular-nums text-white', className)}>{value}</dd>
    </>
  )
}

function StrategyHint({
  signal,
  ruleSays,
  holding,
  config,
  done,
}: {
  signal: Signal
  ruleSays: Action
  holding: boolean
  config: LabConfig
  done: boolean
}) {
  if (done) return <p className="text-sm text-surface-200/75">The series has ended. See how your run compares below.</p>
  const pair = `${config.fast}-day average`
  const text =
    signal === 'buy'
      ? `The ${pair} crossed above the ${config.slow}-day average at today’s close.`
      : signal === 'sell'
        ? `The ${pair} crossed below the ${config.slow}-day average at today’s close.`
        : 'The averages did not cross today.'
  const verdict =
    ruleSays === 'buy'
      ? 'The rule says: Buy.'
      : ruleSays === 'sell'
        ? 'The rule says: Sell.'
        : signal === 'buy' && holding
          ? 'Buy signal, but you already hold a position — the rule waits.'
          : signal === 'sell' && !holding
            ? 'Sell signal, but you hold nothing — the rule waits.'
            : 'The rule says: Wait.'
  return (
    <div
      className={clsx(
        'rounded-xl border px-4 py-3',
        ruleSays === 'buy' ? 'border-emerald-500/40 bg-emerald-500/5' : ruleSays === 'sell' ? 'border-rose-500/40 bg-rose-500/5' : 'border-surface-800',
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-surface-200/50">Strategy signal</p>
      <p className="mt-1 text-sm text-surface-200/85">{text}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{verdict}</p>
      <p className="mt-1 text-xs text-surface-200/50">You can follow it or not — the comparison below shows both.</p>
    </div>
  )
}

function Summary({
  series,
  state,
  config,
  done,
  onNewMarket,
}: {
  series: SyntheticSeries
  state: LabState
  config: LabConfig
  done: boolean
  onNewMarket: () => void
}) {
  const { bars } = series
  const yours = summarise(state, bars, config)
  // Compare like with like: the rule and buy-and-hold up to the same day.
  const rule = useMemo(() => runStrategy(bars, config), [bars, config])
  const shown = state.equity.length
  const ruleEquity = rule.equity.slice(0, shown)
  const bh = useMemo(() => buyAndHold(bars, config), [bars, config])
  const bhEquity = bh.equity.slice(0, shown)
  const ruleTradesSoFar = rule.trades.filter((t) => t.exitIndex <= state.cursor)
  const exposure = Math.min(100, (config.riskPct / config.stopPct) * 100)

  const columns = [
    {
      name: 'Your decisions',
      ret: yours.returnPct,
      dd: yours.maxDrawdownPct,
      trades: yours.trades,
      win: yours.winRatePct,
    },
    {
      name: 'Crossover rule, followed exactly',
      ret: ((ruleEquity.at(-1) ?? config.startCash) / config.startCash - 1) * 100,
      dd: maxDrawdownPct(ruleEquity),
      trades: ruleTradesSoFar.length,
      win: ruleTradesSoFar.length ? (ruleTradesSoFar.filter((t) => t.pnl > 0).length / ruleTradesSoFar.length) * 100 : null,
    },
    {
      name: 'Buy and hold',
      ret: ((bhEquity.at(-1) ?? config.startCash) / config.startCash - 1) * 100,
      dd: maxDrawdownPct(bhEquity),
      trades: null,
      win: null,
    },
  ]

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-white">{done ? 'Final results' : 'Results so far'}</h2>
        <p className="text-xs text-surface-200/50">Simulated, after estimated costs · open positions valued at the latest close</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs text-surface-200/50">
              <th className="py-1.5 pr-3 font-medium" />
              <th className="py-1.5 pr-3 text-right font-medium">Return</th>
              <th className="py-1.5 pr-3 text-right font-medium">Max drawdown</th>
              <th className="py-1.5 pr-3 text-right font-medium">Closed trades</th>
              <th className="py-1.5 text-right font-medium">Win rate</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {columns.map((c) => (
              <tr key={c.name} className="border-t border-surface-800">
                <td className="py-2 pr-3 text-surface-200/85">{c.name}</td>
                <td className={clsx('py-2 pr-3 text-right font-semibold', c.ret >= 0 ? 'text-emerald-400' : 'text-rose-400')}>{pct(c.ret)}</td>
                <td className="py-2 pr-3 text-right text-surface-200/80">{c.dd.toFixed(2)}%</td>
                <td className="py-2 pr-3 text-right text-surface-200/80">{c.trades ?? '—'}</td>
                <td className="py-2 text-right text-surface-200/80">{c.win === null ? '—' : `${c.win.toFixed(0)}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-relaxed text-surface-200/60">
        Risking {config.riskPct}% of equity with a {config.stopPct}% stop puts roughly {exposure.toFixed(0)}% of the
        account into each trade, so the strategy’s gains and losses are smaller than buy-and-hold’s, which is fully
        invested. Compare drawdowns as well as returns. Costs paid so far: {formatRupees(yours.totalCosts)}.
      </p>
      {done && (
        <div className="space-y-3 rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
          <p className="text-sm font-semibold text-white">What this market was doing</p>
          <ul className="grid gap-1 text-xs text-surface-200/75 sm:grid-cols-2">
            {series.phases.map((p) => (
              <li key={p.name}>
                Days {p.from + 1}–{p.to + 1}: <span className="font-semibold text-surface-200">{p.name}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-surface-200/65">
            Crossover rules tend to profit in sustained trends and lose small amounts repeatedly in sideways markets,
            where the averages cross back and forth. One synthetic run proves nothing either way — try several markets.
          </p>
          <Button size="sm" onClick={onNewMarket}>
            Try a new market
          </Button>
        </div>
      )}
    </Card>
  )
}

function TradeHistory({ state, bars }: { state: LabState; bars: SyntheticSeries['bars'] }) {
  const rows = [
    ...state.trades.map((t, i) => ({ key: `t${i}`, n: i + 1, ...t, open: false })),
    ...(state.position
      ? [
          {
            key: 'open',
            n: state.trades.length + 1,
            entryIndex: state.position.entryIndex,
            entryPrice: state.position.entryPrice,
            exitIndex: state.cursor,
            exitPrice: bars[state.cursor].close,
            units: state.position.units,
            costs: state.position.entryCost,
            pnl: (bars[state.cursor].close - state.position.entryPrice) * state.position.units - state.position.entryCost,
            exit: 'open' as const,
            open: true,
          },
        ]
      : []),
  ]
  return (
    <Card className="space-y-3">
      <h2 className="text-base font-bold text-white">Trade history</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-surface-200/55">No trades yet. Buy when you think the setup is right — or follow the rule.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="text-left text-xs text-surface-200/50">
                {['#', 'Bought', 'Sold', 'Units', 'Costs', 'P&L after costs', 'Exit'].map((h) => (
                  <th key={h} className={clsx('py-1.5 pr-3 font-medium', h !== '#' && h !== 'Exit' && 'text-right')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-surface-800">
                  <td className="py-2 pr-3 text-surface-200/60">{r.n}</td>
                  <td className="py-2 pr-3 text-right">
                    Day {r.entryIndex + 1} · {price(r.entryPrice)}
                  </td>
                  <td className="py-2 pr-3 text-right">{r.open ? `Open · ${price(r.exitPrice)} close` : `Day ${r.exitIndex + 1} · ${price(r.exitPrice)}`}</td>
                  <td className="py-2 pr-3 text-right">{r.units.toLocaleString('en-IN')}</td>
                  <td className="py-2 pr-3 text-right text-surface-200/70">{formatRupees(r.costs)}</td>
                  <td className={clsx('py-2 pr-3 text-right font-semibold', r.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    {formatRupees(r.pnl)}
                  </td>
                  <td className="py-2 text-surface-200/70">{r.exit === 'stop' ? 'Stop' : r.exit === 'sell' ? 'Sell' : 'Still open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
