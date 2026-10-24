import { ArrowLeft, Dices, FlaskConical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Collapsible } from '@/components/ui/Collapsible'
import { generateSeries } from '@/lib/tradingLab/data'
import { parseSettings, type SettingsField, type SettingsInputs } from '@/lib/tradingLab/settings'
import { DEFAULT_CONFIG, type LabConfig } from '@/lib/tradingLab/simulator'
import { NumberField } from '../calculators/parts'
import { EducationNotice } from '../EducationNotice'
import { LabSession } from './LabSession'
import { PositionSizeTool } from './PositionSizeTool'

const DEFAULT_SEED = 42

const SETTING_FIELDS: Array<{ key: SettingsField; label: string; hint?: string }> = [
  { key: 'seed', label: 'Market seed', hint: 'The same seed always draws the same market.' },
  { key: 'fast', label: 'Fast average (days)' },
  { key: 'slow', label: 'Slow average (days)' },
  { key: 'costPct', label: 'Estimated cost per side (%)', hint: 'Brokerage, taxes and slippage on each buy and each sell.' },
  { key: 'riskPct', label: 'Risk per trade (% of equity)' },
  { key: 'stopPct', label: 'Stop distance below entry (%)' },
  { key: 'startCash', label: 'Starting cash (₹)' },
]

function toInputs(seed: number, c: LabConfig): SettingsInputs {
  return {
    seed: String(seed),
    fast: String(c.fast),
    slow: String(c.slow),
    costPct: String(c.costPct),
    riskPct: String(c.riskPct),
    stopPct: String(c.stopPct),
    startCash: c.startCash.toLocaleString('en-IN'),
  }
}

const randomSeed = () => 1 + Math.floor(Math.random() * 999_999_998)

/**
 * The Trading Lab: practise a moving-average crossover on synthetic prices.
 * Everything is simulated in the browser — nothing here can reach a broker.
 */
export function TradingLabPage() {
  const [seed, setSeed] = useState(DEFAULT_SEED)
  const [config, setConfig] = useState<LabConfig>(DEFAULT_CONFIG)
  const [draft, setDraft] = useState<SettingsInputs>(() => toInputs(DEFAULT_SEED, DEFAULT_CONFIG))
  const parsed = useMemo(() => parseSettings(draft), [draft])
  const series = useMemo(() => generateSeries(seed), [seed])

  function apply() {
    if (!parsed.ok) return
    setSeed(parsed.result.seed)
    setConfig(parsed.result.config)
  }

  function newMarket() {
    const next = randomSeed()
    setSeed(next)
    setDraft((d) => ({ ...d, seed: String(next) }))
  }

  return (
    <div className="mx-auto max-w-[1080px] space-y-8 px-4 py-8 sm:px-6">
      <PageMeta
        title="Trading Lab"
        description="Practise a moving-average crossover strategy on synthetic prices: simulated buy, sell and wait decisions, position sizing, costs and a buy-and-hold comparison. No real money or orders."
      />
      <div className="space-y-4">
        <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Academy
        </Link>
        <PageHeader
          kicker="Financial Learning Academy"
          title="Trading Lab"
          sub="Practise one documented strategy — a moving-average crossover — day by day on a synthetic market. Decide at each close, see what the rule would do, and compare your run with the rule and with simply buying and holding."
          actions={
            <Button variant="secondary" size="sm" onClick={newMarket}>
              <Dices className="h-4 w-4" aria-hidden />
              New market
            </Button>
          }
        />
      </div>

      <Alert variant="warning" title="Simulation only">
        Synthetic prices, not a real security, and no real orders — nothing here connects to a broker. Results say
        nothing about real trading outcomes.
      </Alert>

      <Collapsible title="Settings" meta={<span className="text-xs text-surface-200/50">Seed {seed} · {config.fast}/{config.slow}-day averages</span>}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SETTING_FIELDS.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                hint={f.hint}
                value={draft[f.key]}
                onChange={(value) => setDraft((prev) => ({ ...prev, [f.key]: value }))}
                error={parsed.ok ? undefined : parsed.errors[f.key]}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={apply} disabled={!parsed.ok}>
              Apply and restart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDraft(toInputs(DEFAULT_SEED, DEFAULT_CONFIG))
                setSeed(DEFAULT_SEED)
                setConfig(DEFAULT_CONFIG)
              }}
            >
              Reset to defaults
            </Button>
            <span className="text-xs text-surface-200/50">Applying settings starts the market again from day {config.slow + 1}.</span>
          </div>
        </div>
      </Collapsible>

      <LabSession key={`${seed}:${JSON.stringify(config)}`} series={series} config={config} onNewMarket={newMarket} />

      <Card className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <FlaskConical className="h-4 w-4 text-brand-400" aria-hidden />
          How the simulation works
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-surface-200/70">
          <li>
            Prices are synthetic: a seeded random walk through four phases — a rise, a range, a fall and a recovery —
            revealed only when the run ends. They do not describe any real security.
          </li>
          <li>
            Signals use closing prices up to and including today only. The {config.fast}-day average crossing above the{' '}
            {config.slow}-day average is a Buy signal; crossing below is a Sell signal.
          </li>
          <li>You decide after today’s close. Every order fills at the next day’s open — never at a price you have already seen.</li>
          <li>
            Long only: Buy opens a position when you hold none, Sell closes the whole position, Wait does nothing. There
            is no short selling and no leverage.
          </li>
          <li>
            Each Buy is sized so that hitting the stop loses about {config.riskPct}% of equity, capped by cash. The stop
            sits {config.stopPct}% below the entry and fills at the stop — or at the open if the price gaps below it.
          </li>
          <li>
            Estimated costs of {config.costPct}% are charged on each buy and each sell. There is no further slippage,
            no dividends and no tax.
          </li>
          <li>
            Buy-and-hold spends all the starting cash at the first possible fill, with the same costs. Open positions
            are valued at the latest close.
          </li>
        </ul>
      </Card>

      <PositionSizeTool />

      <EducationNotice />
    </div>
  )
}
