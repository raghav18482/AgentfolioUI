import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { ApiError } from '@/api/client'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { useEnroll } from '@/hooks/useSession'
import type { AuthConfig, PhoneValue } from '@/types'
import { AuthCard } from './AuthCard'
import { AuthConfigGate } from './AuthConfigGate'

export function EnrollPage() {
  return (
    <AuthCard
      wide
      title="Set up your account"
      sub="Enter your four Angel One credentials once. We verify them with Angel One, encrypt them, and from then on you log in with just your WhatsApp number and an app password."
    >
      <AuthConfigGate>{(config) => <EnrollForm config={config} />}</AuthConfigGate>

      <p className="mt-6 text-center text-sm text-surface-200/60">
        Already set up?{' '}
        <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
          Log in &rarr;
        </Link>
      </p>

      {/* The trade-off this form makes. Keep the wording: it is the user's informed consent. */}
      <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-surface-200/70">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
        <p>
          <strong className="text-amber-200">Read this before continuing:</strong> saving your
          credentials is a real trade-off. Until now they lived only in server memory and vanished on
          logout. From here they are encrypted in the database, and your app password is what unlocks
          them &mdash; so it protects a live trading account. Choose a strong, unique one. Running this
          again later will overwrite your stored credentials and password, which is also how you reset
          a forgotten one.
        </p>
      </div>
    </AuthCard>
  )
}

const emptyCredentials = { api_key: '', client_id: '', password: '', totp_secret: '' }

function EnrollForm({ config }: { config: AuthConfig }) {
  const enroll = useEnroll()
  const [credentials, setCredentials] = useState(emptyCredentials)
  const [phone, setPhone] = useState<PhoneValue>({ dial: config.default_dial_code, national: '' })
  const [appPassword, setAppPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [mismatch, setMismatch] = useState(false)

  const min = config.min_password_chars

  function setCredential(key: keyof typeof emptyCredentials, value: string) {
    setCredentials((c) => ({ ...c, [key]: value }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (appPassword !== confirm) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    enroll.mutate({
      ...credentials,
      country_code: phone.dial,
      whatsapp_number: phone.national,
      app_password: appPassword,
      app_password_confirm: confirm,
    })
  }

  // The server names the one field at fault when there is one; anything else
  // (a broker rejection, a database error) is about the form as a whole.
  const error = enroll.error
  const field = error instanceof ApiError ? error.field : undefined
  const fieldError = (name: string) => (field === name ? error?.message : undefined)
  const formError = error && !field ? error.message : null

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError && <Alert variant="error">{formError}</Alert>}

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Angel One credentials</h2>
          <p className="mt-1 text-sm text-surface-200/55">
            Not sure where to find these? Follow the{' '}
            <Link to="/setup" className="font-semibold text-brand-400 hover:text-brand-300">
              setup guide
            </Link>
            .
          </p>
        </div>
        <Input
          label="API Key"
          required
          autoComplete="off"
          placeholder="Your Angel One API key"
          value={credentials.api_key}
          onChange={(e) => setCredential('api_key', e.target.value)}
        />
        <Input
          label="Client ID"
          required
          autoComplete="off"
          placeholder="e.g. AB1234"
          value={credentials.client_id}
          onChange={(e) => setCredential('client_id', e.target.value)}
        />
        <Input
          label="PIN / Password"
          type="password"
          required
          autoComplete="off"
          placeholder="Your trading PIN"
          value={credentials.password}
          onChange={(e) => setCredential('password', e.target.value)}
        />
        <Input
          label="TOTP Secret"
          type="password"
          required
          autoComplete="off"
          placeholder="Base32 TOTP secret from Angel One"
          value={credentials.totp_secret}
          onChange={(e) => setCredential('totp_secret', e.target.value)}
        />
      </section>

      <section className="space-y-4 border-t border-surface-800/60 pt-6">
        <h2 className="text-base font-semibold text-white">How you'll log in from now on</h2>
        <PhoneInput
          label="WhatsApp Number"
          countries={config.countries}
          value={phone}
          onChange={setPhone}
          autoComplete="username"
          required
          error={fieldError('whatsapp_number')}
          hint="Pick your country code, then the number without it. This is also where premium briefings are sent."
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

      <Button type="submit" loading={enroll.isPending} className="w-full">
        {enroll.isPending ? 'Verifying with Angel One…' : 'Verify & Save'}
      </Button>
    </form>
  )
}
