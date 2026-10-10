import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { ShieldCheck } from 'lucide-react'
import { saveRiskProfile } from '@/api/trading'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { useRiskProfile } from '@/hooks/useTrading'
import { useToast } from '@/hooks/useToast'
import { formatRupees } from '@/utils/format'
import type { InvestmentGoal, ProductType, RiskProfile, RiskTolerance } from '@/types'

const GOALS: Array<{ value: InvestmentGoal; label: string }> = [
  { value: 'wealth creation', label: 'Wealth Creation' },
  { value: 'income', label: 'Income' },
  { value: 'preservation', label: 'Preservation' },
  { value: 'speculation', label: 'Speculation' },
]

const TOLERANCES: Array<{ value: RiskTolerance; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const PRODUCTS: Array<{ value: ProductType; label: string }> = [
  { value: 'DELIVERY', label: 'Delivery' },
  { value: 'INTRADAY', label: 'Intraday' },
]

/** What a first-time form starts with — the same defaults the server-rendered page used. */
const STARTER: RiskProfile = {
  age: 24,
  goal: 'wealth creation',
  horizon_years: 10,
  risk_tolerance: 'high',
  tax_bracket: '20%',
  max_single_order_value: 500_000,
  max_position_pct: 35,
  max_daily_trades: 25,
  allowed_products: ['DELIVERY', 'INTRADAY'],
}

type NumericField = 'age' | 'horizon_years' | 'max_single_order_value' | 'max_position_pct' | 'max_daily_trades'

function titleCase(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function RiskProfileForm() {
  const profile = useRiskProfile()
  const [editing, setEditing] = useState(false)

  const saved = profile.data ?? null
  const showForm = editing || saved === null

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <ShieldCheck className="h-4 w-4 text-brand-400" aria-hidden />
          Risk Profile
        </h2>
        {saved && !editing && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {profile.isPending ? (
        <Spinner />
      ) : profile.isError ? (
        <Alert variant="error">Could not load your risk profile: {profile.error.message}</Alert>
      ) : (
        <>
          <p className={clsx('mb-4 text-sm', saved ? 'text-emerald-400' : 'text-rose-300')}>
            {saved ? 'Profile loaded.' : 'No risk profile set. Fill in below before trading.'}
          </p>
          {showForm ? (
            <ProfileEditor
              initial={saved ?? STARTER}
              onCancel={saved ? () => setEditing(false) : undefined}
              onSaved={() => setEditing(false)}
            />
          ) : (
            saved && <ProfileSummary profile={saved} />
          )}
        </>
      )}
    </Card>
  )
}

function ProfileSummary({ profile }: { profile: RiskProfile }) {
  const rows: Array<[string, string]> = [
    ['Age', String(profile.age)],
    ['Goal', titleCase(profile.goal)],
    ['Horizon', `${profile.horizon_years} years`],
    ['Risk tolerance', titleCase(profile.risk_tolerance)],
    ['Tax bracket', profile.tax_bracket || '—'],
    ['Max order value', formatRupees(profile.max_single_order_value)],
    ['Max position', `${profile.max_position_pct}%`],
    ['Max daily trades', String(profile.max_daily_trades)],
    ['Products', profile.allowed_products.map((p) => titleCase(p.toLowerCase())).join(', ')],
  ]
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-surface-200/50">{label}</dt>
          <dd className="font-medium text-white">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function ProfileEditor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: RiskProfile
  onCancel?: () => void
  onSaved: () => void
}) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [goal, setGoal] = useState(initial.goal)
  const [tolerance, setTolerance] = useState(initial.risk_tolerance)
  const [taxBracket, setTaxBracket] = useState(initial.tax_bracket)
  const [products, setProducts] = useState<ProductType[]>(initial.allowed_products)
  // Numbers are edited as text, so clearing a field does not snap it to 0.
  const [numbers, setNumbers] = useState<Record<NumericField, string>>({
    age: String(initial.age),
    horizon_years: String(initial.horizon_years),
    max_single_order_value: String(initial.max_single_order_value),
    max_position_pct: String(initial.max_position_pct),
    max_daily_trades: String(initial.max_daily_trades),
  })

  const save = useMutation({
    mutationFn: saveRiskProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(['risk-profile'], profile)
      toast.success('Risk profile saved')
      onSaved()
    },
  })

  function setNumber(field: NumericField, value: string) {
    setNumbers((n) => ({ ...n, [field]: value }))
  }

  function toggleProduct(product: ProductType, on: boolean) {
    setProducts((current) => (on ? [...current, product] : current.filter((p) => p !== product)))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate({
      age: parseInt(numbers.age, 10),
      goal,
      horizon_years: parseInt(numbers.horizon_years, 10),
      risk_tolerance: tolerance,
      tax_bracket: taxBracket,
      max_single_order_value: parseFloat(numbers.max_single_order_value),
      max_position_pct: parseFloat(numbers.max_position_pct),
      max_daily_trades: parseInt(numbers.max_daily_trades, 10),
      allowed_products: products,
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {save.isError && <Alert variant="error">{save.error.message}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Age" type="number" min={18} max={120} required value={numbers.age} onChange={(e) => setNumber('age', e.target.value)} />
        <Select label="Goal" options={GOALS} value={goal} onChange={(e) => setGoal(e.target.value as InvestmentGoal)} />
        <Input
          label="Horizon (years)"
          type="number"
          min={1}
          max={50}
          required
          value={numbers.horizon_years}
          onChange={(e) => setNumber('horizon_years', e.target.value)}
        />
        <Select
          label="Risk Tolerance"
          options={TOLERANCES}
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value as RiskTolerance)}
        />
        <Input label="Tax Bracket" placeholder="e.g. 30%" value={taxBracket} onChange={(e) => setTaxBracket(e.target.value)} />
        <Input
          label="Max Order Value (₹)"
          type="number"
          min={1000}
          step={1000}
          required
          value={numbers.max_single_order_value}
          onChange={(e) => setNumber('max_single_order_value', e.target.value)}
        />
        <Input
          label="Max Position %"
          type="number"
          min={1}
          max={100}
          step={1}
          required
          value={numbers.max_position_pct}
          onChange={(e) => setNumber('max_position_pct', e.target.value)}
        />
        <Input
          label="Max Daily Trades"
          type="number"
          min={1}
          max={100}
          required
          value={numbers.max_daily_trades}
          onChange={(e) => setNumber('max_daily_trades', e.target.value)}
        />
      </div>

      <fieldset className="flex flex-wrap items-center gap-4 text-sm text-surface-200/80">
        <legend className="sr-only">Products the agent may trade</legend>
        <span className="text-surface-200/60">Products:</span>
        {PRODUCTS.map((p) => (
          <label key={p.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={products.includes(p.value)}
              onChange={(e) => toggleProduct(p.value, e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-brand-500"
            />
            {p.label}
          </label>
        ))}
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" loading={save.isPending}>
          Save Risk Profile
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
