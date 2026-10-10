import type { Holding } from '@/types'
import { displaySymbol } from '@/utils/format'

export interface RebalanceRow {
  symbol: string
  label: string
  original: number
}

/** How many holdings the simulator offers: the biggest, since small ones barely move the picture. */
export const MAX_ROWS = 12

export function rebalanceRows(holdings: Holding[]): RebalanceRow[] {
  return holdings
    .filter((h) => h.current > 0)
    .sort((a, b) => b.current - a.current)
    .slice(0, MAX_ROWS)
    .map((h) => ({ symbol: h.symbol, label: displaySymbol(h.symbol), original: h.current }))
}

/** Percent of each holding sold, by symbol. */
export type SellMap = Record<string, number>
/** Rupees bought into each holding, by symbol. */
export type BuyMap = Record<string, number>

export interface Simulation {
  /** Each row's value after selling and reinvesting. */
  after: Record<string, number>
  freed: number
  /** Cash left to deploy: what was already there, plus what was freed, minus what was reinvested. */
  remaining: number
}

export function simulate(rows: RebalanceRow[], sells: SellMap, buys: BuyMap, cash: number): Simulation {
  const after: Record<string, number> = {}
  let freed = 0
  let bought = 0
  for (const r of rows) {
    const sold = r.original * ((sells[r.symbol] ?? 0) / 100)
    const added = buys[r.symbol] ?? 0
    freed += sold
    bought += added
    after[r.symbol] = r.original - sold + added
  }
  return { after, freed, remaining: cash + freed - bought }
}

/**
 * Whether `amount` can be reinvested. Checked against the cash that is still
 * unspent, so two reinvestments cannot together exceed what there is to spend.
 */
export function canReinvest(amount: number, remaining: number): boolean {
  return Number.isFinite(amount) && amount > 0 && amount <= remaining + 1e-6
}
