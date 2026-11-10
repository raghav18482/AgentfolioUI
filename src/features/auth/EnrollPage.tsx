import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { ApiError } from '@/api/client'
import { PageMeta } from '@/components/layout/PageMeta'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { BrokerCredentialFields } from '@/features/brokerage/BrokerCredentialFields'
import { useEnroll } from '@/hooks/useSession'
import { BROKER_FIELDS, EMPTY_BROKER_CREDENTIALS, brokerFields } from '@/lib/brokerage'
import type { AuthConfig, BrokerCredentials, PhoneValue } from '@/types'
import { AuthCard } from './AuthCard'
import { AuthConfigGate } from './AuthConfigGate'

export function EnrollPage() {
  return (
    <AuthCard
      wide
      title="Create your account"
      sub="All you need is your WhatsApp number and a password. Learning is open straight away; connect your Angel One account now or whenever you want your portfolio in the app."
    >
      <PageMeta title="Create your account" noindex />
      <AuthConfigGate>{(config) => <EnrollForm config={config} />}</AuthConfigGate>

      <p className="mt-6 text-center text-sm text-surface-200/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
          Log in &rarr;
        </Link>
      </p>
    </AuthCard>
  )
}

function EnrollForm({ config }: { config: AuthConfig }) {
  const enroll = useEnroll()
  const [phone, setPhone] = useState<PhoneValue>({ dial: config.default_dial_code, national: '' })
  const [appPassword, setAppPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [mismatch, setMismatch] = useState(false)
  const [credentials, setCredentials] = useState<BrokerCredentials>(EMPTY_BROKER_CREDENTIALS)
  const [partial, setPartial] = useState<keyof BrokerCredentials | null>(null)
  const [showBroker, setShowBroker] = useState(false)

  const min = config.min_password_chars
  const broker = brokerFields(credentials)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (appPassword !== confirm) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    if (broker.kind === 'partial') {
      setPartial(broker.missing)
      setShowBroker(true)
      return
    }
    setPartial(null)
    enroll.mutate({
      country_code: phone.dial,
      whatsapp_number: phone.national,
      app_password: appPassword,
      app_password_confirm: confirm,
      ...(broker.kind === 'all' ? broker.credentials : {}),
    })
  }

  // The server names the one field at fault when there is one; anything else
  // (a broker rejection, a database error) is about the form as a whole.
  const error = enroll.error
  const field = error instanceof ApiError ? error.field : undefined
  const fieldError = (name: string) => (field === name ? error?.message : undefined)
  const formError = error && !field ? error.message : null
  const brokerError = (name: keyof BrokerCredentials) =>
    partial === name ? 'Fill in all four Angel One fields, or leave them all empty and connect later.' : fieldError(name)
  // Stays open once opened, and opens itself when an error points into it.
  const brokerOpen = showBroker || BROKER_FIELDS.some((k) => field === k)

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError && <Alert variant="error">{formError}</Alert>}

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Your account</h2>
        <PhoneInput
          label="WhatsApp Number"
          countries={config.countries}
          value={phone}
          onChange={setPhone}
          autoComplete="username"
          required
          error={fieldError('whatsapp_number')}
          hint="Pick your country code, then the number without it. You log in with it, and premium briefings go to it."
        />
        <Input
          label="App Password"
          type="password"
          required
          minLength={min}
          autoComplete="new-password"
          placeholder={`At least ${min} characters`}
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
          error={fieldError('app_password')}
          hint="Choose something new — not your trading PIN."
        />
        <Input
          label="Confirm App Password"
          type="password"
          required
          minLength={min}
          autoComplete="new-password"
          placeholder="Type it again"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value)
            setMismatch(false)
          }}
          error={mismatch ? 'The two passwords do not match.' : fieldError('app_password_confirm')}
        />
      </section>

      <section className="rounded-xl border border-surface-800/80">
        <h2 className="m-0">
          <button
            type="button"
            aria-expanded={brokerOpen}
            aria-controls="enroll-broker"
            onClick={() => setShowBroker(!brokerOpen)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-base font-semibold text-white"
          >
            Connect Angel One now <span className="text-sm font-normal text-surface-200/55">(optional)</span>
            <ChevronDown
              className={clsx('ml-auto h-4 w-4 shrink-0 transition-transform', brokerOpen && 'rotate-180')}
              aria-hidden
            />
          </button>
        </h2>
        {brokerOpen && (
          <div id="enroll-broker" className="space-y-4 border-t border-surface-800/80 p-4">
            <p className="text-sm text-surface-200/60">
              Skip this to start with learning; you can connect from your account later. If you registered
              before app passwords existed, fill these in to claim your account.
            </p>
            <BrokerCredentialFields
              value={credentials}
              onChange={(key, value) => {
                setCredentials((c) => ({ ...c, [key]: value }))
                setPartial(null)
              }}
              errorFor={brokerError}
            />
            {/* The trade-off this section makes. Keep the wording: it is the user's informed consent. */}
            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-surface-200/70">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
              <p>
                <strong className="text-amber-200">Read this before connecting:</strong> saving your credentials
                is a real trade-off. They are encrypted in the database, and your app password is what unlocks
                them &mdash; so it protects a live trading account. Choose a strong, unique one.
              </p>
            </div>
          </div>
        )}
      </section>

      <Button type="submit" loading={enroll.isPending} className="w-full">
        {enroll.isPending
          ? broker.kind === 'all'
            ? 'Verifying with Angel One…'
            : 'Creating your account…'
          : broker.kind === 'all'
            ? 'Verify & create account'
            : 'Create account'}
      </Button>
    </form>
  )
}
