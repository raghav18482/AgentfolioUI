import { ArrowLeft } from 'lucide-react'
import type { ComponentType } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { Tabs } from '@/components/ui/Tabs'
import { EducationNotice } from '../EducationNotice'
import { CALCULATORS, calculatorFrom, type CalculatorId } from './ids'
import { GoalPlanner } from './GoalPlanner'
import { InflationCalculator } from './InflationCalculator'
import { PrepayVsInvest } from './PrepayVsInvest'
import { SipVsLumpSum } from './SipVsLumpSum'

const PANELS: Record<CalculatorId, ComponentType> = {
  goal: GoalPlanner,
  sip: SipVsLumpSum,
  prepay: PrepayVsInvest,
  inflation: InflationCalculator,
}

/** The Academy calculators, one per tab. `?tool=` selects a tab, so lessons can link straight to one. */
export function CalculatorsPage() {
  const [params, setParams] = useSearchParams()
  const active = calculatorFrom(params.get('tool'))
  const Panel = PANELS[active]
  const current = CALCULATORS.find((c) => c.id === active)!

  return (
    <div className="mx-auto max-w-[1080px] space-y-8 px-4 py-8 sm:px-6">
      <PageMeta
        title={`${current.label} calculator`}
        description="Free goal planner, SIP vs lump-sum projection, loan prepay-vs-invest comparison and inflation calculator. Projections use your own assumptions and are hypothetical, not forecasts."
      />
      <div className="space-y-4">
        <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Academy
        </Link>
        <PageHeader
          kicker="Financial Learning Academy"
          title="Calculators"
          sub="Put numbers on a decision using your own assumptions. Every result is a hypothetical projection at constant rates — not a forecast, and not a recommendation."
        />
      </div>

      {/* On narrow screens the tabs keep one line each and the row scrolls sideways. */}
      <div className="overflow-x-auto [&_[role=tab]]:shrink-0 [&_[role=tab]]:whitespace-nowrap [&_[role=tablist]]:min-w-max">
        <Tabs
          ariaLabel="Calculators"
          items={CALCULATORS.map((c) => ({ key: c.id, label: c.label }))}
          activeKey={active}
          onChange={(key) => setParams({ tool: key }, { replace: true, preventScrollReset: true })}
        />
      </div>

      <section role="tabpanel" aria-label={current.label}>
        <p className="mb-5 max-w-[70ch] text-sm leading-relaxed text-surface-200/70">{current.description}</p>
        <Panel key={active} />
      </section>

      <EducationNotice />
    </div>
  )
}
