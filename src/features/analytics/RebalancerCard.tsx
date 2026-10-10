import { useMemo, useState, type FormEvent } from 'react'
import { RotateCcw } from 'lucide-react'
import { EChart } from '@/components/charts/EChart'
import { rebalancerOption } from '@/components/charts/options/rebalancer'
import { ChartCard } from '@/components/charts/ChartCard'
import { Button } from '@/components/ui/Button'
import { canReinvest, rebalanceRows, simulate, type BuyMap, type SellMap } from '@/lib/rebalance'
import type { Holding } from '@/types'
import { formatCurrency, parseAmount } from '@/utils/format'

interface RebalancerCardProps {
  holdings: Holding[]
  /** Cash already in the account, to which sold proceeds are added. */
  cash: number
}

const HEIGHT = 320

const fieldClass =
  'rounded-xl border border-surface-700 bg-surface-800/60 px-3 py-2 text-sm text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30'

/** A what-if tool: nothing here is ever sent to the broker. */
export function RebalancerCard({ holdings, cash }: RebalancerCardProps) {
  const rows = useMemo(() => rebalanceRows(holdings), [holdings])
  const [sells, setSells] = useState<SellMap>({})
  const [buys, setBuys] = useState<BuyMap>({})
  const [target, setTarget] = useState('')
  const [amount, setAmount] = useState('')
  const [problem, setProblem] = useState<string | null>(null)

  const sim = useMemo(() => simulate(rows, sells, buys, cash), [rows, sells, buys, cash])
  const option = useMemo(() => rebalancerOption(rows, sim.after), [rows, sim.after])

  function reset() {
    setSells({})
    setBuys({})
    setAmount('')
    setProblem(null)
  }

  function reinvest(e: FormEvent) {
    e.preventDefault()
    const value = parseAmount(amount) ?? 0
    if (!target) return setProblem('Choose a stock to reinvest in.')
    if (!canReinvest(value, sim.remaining)) {
      return setProblem(
        value > 0 ? `That is more than the ${formatCurrency(sim.remaining)} left to deploy.` : 'Enter an amount above zero.',
      )
    }
    setBuys((b) => ({ ...b, [target]: (b[target] ?? 0) + value }))
    setAmount('')
    setProblem(null)
  }

  return (
    <ChartCard
      title="What-If Rebalancer"
      tag="Simulate selling & reinvesting — drag the sliders"
      height={HEIGHT}
      empty={rows.length === 0 ? 'No holdings data to simulate' : null}
      actions={
        <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset the simulation">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs text-surface-200/55">Drag sliders to simulate selling</p>
            <p className="text-xs text-surface-200/55">
              Freed cash: <strong className="text-sm text-white">{formatCurrency(sim.freed)}</strong>
            </p>
          </div>
          <div className="space-y-2.5">
            {rows.map((r) => {
              const pct = sells[r.symbol] ?? 0
              return (
                <div key={r.symbol} className="grid grid-cols-[5.5rem_1fr_2.5rem_6rem] items-center gap-2 text-xs">
                  <label htmlFor={`sell-${r.symbol}`} className="truncate font-medium text-white">
                    {r.label}
                  </label>
                  <input
                    id={`sell-${r.symbol}`}
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    onChange={(e) => setSells((s) => ({ ...s, [r.symbol]: Number(e.target.value) }))}
                    aria-valuetext={`${pct}% sold`}
                    className="w-full cursor-pointer accent-brand-500"
                  />
                  <span className="text-right text-surface-200/60">{pct}%</span>
                  <span className="text-right text-surface-200/80">{formatCurrency(sim.after[r.symbol])}</span>
                </div>
              )
            })}
          </div>

          <form onSubmit={reinvest} className="space-y-2 border-t border-surface-800 pt-4">
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label htmlFor="rebalance-target" className="mb-1 block text-xs text-surface-200/60">
                  Reinvest in
                </label>
                <select id="rebalance-target" value={target} onChange={(e) => setTarget(e.target.value)} className={fieldClass}>
                  <option value="">Select stock</option>
                  {rows.map((r) => (
                    <option key={r.symbol} value={r.symbol}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="rebalance-amount" className="mb-1 block text-xs text-surface-200/60">
                  Amount (₹)
                </label>
                <input
                  id="rebalance-amount"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${fieldClass} w-32`}
                />
              </div>
              <Button type="submit" size="sm" variant="secondary">
                Apply
              </Button>
            </div>
            <p className="text-xs text-surface-200/55">
              Cash left to deploy: <strong className="text-white">{formatCurrency(sim.remaining)}</strong>
              <span className="text-surface-200/40"> · whatever you do not reinvest stays as cash</span>
            </p>
            {problem && (
              <p role="alert" className="text-xs text-rose-300">
                {problem}
              </p>
            )}
          </form>
        </div>

        <EChart option={option} height={HEIGHT} ariaLabel="Bar chart of each holding's value after the simulated sales and reinvestments" />
      </div>
    </ChartCard>
  )
}
