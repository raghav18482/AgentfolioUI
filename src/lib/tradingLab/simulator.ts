import type { Bar } from './data'
import { crossoverSignals, firstSignalBar, type Signal } from './strategy'

/**
 * A long-only paper-trading simulator over synthetic bars. Purely in-memory:
 * it has no connection to any broker and cannot place an order.
 *
 * Timing: you decide after bar t closes; the order fills at bar t + 1's open.
 * A protective stop, set at entry, closes the position during a later bar if
 * its low reaches the stop — at the stop, or at the open if the bar gaps below it.
 */

export interface LabConfig {
  fast: number
  slow: number
  /** Estimated cost per side (brokerage, taxes, slippage), % of trade value. */
  costPct: number
  /** Share of current equity risked per trade, %. */
  riskPct: number
  /** Stop distance below the entry price, %. */
  stopPct: number
  startCash: number
}

export const DEFAULT_CONFIG: LabConfig = { fast: 10, slow: 30, costPct: 0.1, riskPct: 1, stopPct: 5, startCash: 1_00_000 }

export interface Position {
  units: number
  entryIndex: number
  entryPrice: number
  entryCost: number
  stop: number
}

export interface Trade {
  entryIndex: number
  entryPrice: number
  exitIndex: number
  exitPrice: number
  units: number
  /** Entry plus exit costs. */
  costs: number
  /** After costs. */
  pnl: number
  exit: 'sell' | 'stop'
}

export interface LabState {
  /** Index of the last bar you can see; decisions are made at its close. */
  cursor: number
  cash: number
  position: Position | null
  trades: Trade[]
  /** Equity at each bar's close from the first decision bar up to `cursor`. */
  equity: number[]
}

export type Action = 'buy' | 'sell' | 'wait'

/**
 * Units for a trade that loses `riskPct` of `equity` if the stop is hit:
 * floor(equity × risk ÷ (entry − stop)). The same rule as the position-size tool.
 */
export function riskSizedUnits(equity: number, riskPct: number, entry: number, stop: number): number {
  if (!(entry > stop) || stop < 0 || equity <= 0 || riskPct <= 0) return 0
  return Math.floor((equity * (riskPct / 100)) / (entry - stop))
}

export function startLab(bars: readonly Bar[], config: LabConfig): LabState {
  const cursor = firstSignalBar(config.slow)
  if (cursor >= bars.length - 1) throw new Error('Not enough bars for these moving averages')
  return { cursor, cash: config.startCash, position: null, trades: [], equity: [config.startCash] }
}

export function isDone(state: LabState, bars: readonly Bar[]): boolean {
  return state.cursor >= bars.length - 1
}

export function equityAt(state: LabState, bars: readonly Bar[]): number {
  return state.cash + (state.position ? state.position.units * bars[state.cursor].close : 0)
}

/** Units a Buy now would get, estimated on today's close; 0 means a Buy is not possible. */
export function plannedUnits(state: LabState, bars: readonly Bar[], config: LabConfig): number {
  if (state.position || isDone(state, bars)) return 0
  const estimate = bars[state.cursor].close
  const byRisk = riskSizedUnits(equityAt(state, bars), config.riskPct, estimate, estimate * (1 - config.stopPct / 100))
  const byCash = Math.floor(state.cash / (estimate * (1 + config.costPct / 100)))
  return Math.min(byRisk, byCash)
}

export function canAct(action: Action, state: LabState, bars: readonly Bar[], config: LabConfig): boolean {
  if (isDone(state, bars)) return false
  if (action === 'buy') return plannedUnits(state, bars, config) >= 1
  if (action === 'sell') return state.position !== null
  return true
}

function close(position: Position, exitIndex: number, exitPrice: number, costPct: number, exit: Trade['exit']) {
  const exitCost = position.units * exitPrice * (costPct / 100)
  const trade: Trade = {
    entryIndex: position.entryIndex,
    entryPrice: position.entryPrice,
    exitIndex,
    exitPrice,
    units: position.units,
    costs: position.entryCost + exitCost,
    pnl: (exitPrice - position.entryPrice) * position.units - position.entryCost - exitCost,
    exit,
  }
  return { trade, proceeds: position.units * exitPrice - exitCost }
}

/**
 * Applies the decision made at the close of `state.cursor` and advances one bar.
 * An action that is not possible (Buy while holding, Sell while flat) is treated
 * as Wait, so the state can never become inconsistent.
 */
export function step(state: LabState, bars: readonly Bar[], config: LabConfig, action: Action): LabState {
  if (isDone(state, bars)) return state
  const next = state.cursor + 1
  const bar = bars[next]
  let { cash, position } = state
  const trades = [...state.trades]

  if (action === 'buy' && canAct('buy', state, bars, config)) {
    const estimate = bars[state.cursor].close
    const byRisk = riskSizedUnits(equityAt(state, bars), config.riskPct, estimate, estimate * (1 - config.stopPct / 100))
    // Re-check cash against the actual fill: the open can gap above yesterday's close.
    const units = Math.min(byRisk, Math.floor(cash / (bar.open * (1 + config.costPct / 100))))
    if (units >= 1) {
      const entryCost = units * bar.open * (config.costPct / 100)
      cash -= units * bar.open + entryCost
      position = { units, entryIndex: next, entryPrice: bar.open, entryCost, stop: bar.open * (1 - config.stopPct / 100) }
    }
  } else if (action === 'sell' && position) {
    const { trade, proceeds } = close(position, next, bar.open, config.costPct, 'sell')
    trades.push(trade)
    cash += proceeds
    position = null
  }

  // The stop works during the bar for any position still open after the open.
  if (position && bar.low <= position.stop) {
    const exitPrice = Math.min(bar.open, position.stop)
    const { trade, proceeds } = close(position, next, exitPrice, config.costPct, 'stop')
    trades.push(trade)
    cash += proceeds
    position = null
  }

  const equity = cash + (position ? position.units * bar.close : 0)
  return { cursor: next, cash, position, trades, equity: [...state.equity, equity] }
}

/** What the crossover rule says to do at the close of the current bar. */
export function strategyAction(signal: Signal, state: LabState): Action {
  if (signal === 'buy' && !state.position) return 'buy'
  if (signal === 'sell' && state.position) return 'sell'
  return 'wait'
}

/**
 * Runs the rule from `from` to the last bar. Signals are recomputed from the
 * bars visible at each step, so the run can never use a later price.
 */
export function runStrategy(bars: readonly Bar[], config: LabConfig, from: LabState = startLab(bars, config)): LabState {
  let state = from
  while (!isDone(state, bars)) {
    const visible = bars.slice(0, state.cursor + 1).map((b) => b.close)
    const signal = crossoverSignals(visible, config.fast, config.slow)[state.cursor]
    state = step(state, bars, config, strategyAction(signal, state))
  }
  return state
}

/** Biggest fall from a running peak, as a positive percentage. */
export function maxDrawdownPct(values: readonly number[]): number {
  let peak = -Infinity
  let worst = 0
  for (const v of values) {
    peak = Math.max(peak, v)
    if (peak > 0) worst = Math.max(worst, (peak - v) / peak)
  }
  return worst * 100
}

export interface BuyAndHold {
  units: number
  /** Value at each close from the first decision bar, matching `LabState.equity`. */
  equity: number[]
}

/** Spend the whole starting cash at the first possible fill, then hold — same costs, marked to market. */
export function buyAndHold(bars: readonly Bar[], config: LabConfig): BuyAndHold {
  const start = firstSignalBar(config.slow)
  const entry = bars[start + 1].open
  const units = Math.floor(config.startCash / (entry * (1 + config.costPct / 100)))
  const cash = config.startCash - units * entry * (1 + config.costPct / 100)
  const equity = [config.startCash, ...bars.slice(start + 1).map((b) => cash + units * b.close)]
  return { units, equity }
}

export interface LabSummary {
  equity: number
  returnPct: number
  trades: number
  wins: number
  winRatePct: number | null
  maxDrawdownPct: number
  totalCosts: number
}

/** Open positions are marked to the latest close, without an exit cost. */
export function summarise(state: LabState, bars: readonly Bar[], config: LabConfig): LabSummary {
  const equity = equityAt(state, bars)
  const wins = state.trades.filter((t) => t.pnl > 0).length
  return {
    equity,
    returnPct: (equity / config.startCash - 1) * 100,
    trades: state.trades.length,
    wins,
    winRatePct: state.trades.length ? (wins / state.trades.length) * 100 : null,
    maxDrawdownPct: maxDrawdownPct(state.equity),
    totalCosts: state.trades.reduce((s, t) => s + t.costs, 0) + (state.position?.entryCost ?? 0),
  }
}
