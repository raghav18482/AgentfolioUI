import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { ApiError } from '@/api/client'
import { PageMeta } from '@/components/layout/PageMeta'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { useLogin } from '@/hooks/useSession'
import { LINKS } from '@/lib/links'
import type { AuthConfig, PhoneValue } from '@/types'
import { AuthCard } from './AuthCard'
import { AuthConfigGate } from './AuthConfigGate'

export function LoginPage() {
  return (
    <AuthCard
      title="Log in"
      sub="Your Angel One credentials are already stored, encrypted. Just your number and app password."
    >
      <PageMeta title="Log in" noindex />
      <AuthConfigGate>{(config) => <LoginForm config={config} />}</AuthConfigGate>

      <p className="mt-6 text-center text-sm text-surface-200/60">
        First time here, or registered before app passwords existed?{' '}
        <Link to="/enroll" className="font-semibold text-brand-400 hover:text-brand-300">
          Set up your account &rarr;
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-surface-200/60">
        Don't have an Angel One account?{' '}
        <a
          href={LINKS.angelOneSignup}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-400 hover:text-brand-300"
        >
          Open a free Demat account &rarr;
        </a>
      </p>

      <div className="mt-6 rounded-xl bg-surface-800/40 p-4 text-xs leading-relaxed text-surface-200/55">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-400/80" aria-hidden />
        <strong className="text-surface-200/80">Security notice:</strong> Your Angel One credentials
        are encrypted at rest and decrypted only in server memory, for the duration of your session.
        Your app password is stored as a one-way hash and cannot be read back by anyone, including us.
      </div>
    </AuthCard>
  )
}

function LoginForm({ config }: { config: AuthConfig }) {
  const login = useLogin()
  const [phone, setPhone] = useState<PhoneValue>({ dial: config.default_dial_code, national: '' })
  const [password, setPassword] = useState('')

  // Signing in only refreshes the session; GuestOnlyRoute then moves the user on.
  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login.mutate(
      { country_code: phone.dial, whatsapp_number: phone.national, app_password: password },
      { onError: () => setPassword('') },
    )
  }

  const error = login.error
  const phoneError = error instanceof ApiError && error.field === 'whatsapp_number' ? error.message : undefined

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && !phoneError && <Alert variant="error">{error.message}</Alert>}

      <PhoneInput
        label="WhatsApp Number"
        countries={config.countries}
        value={phone}
        onChange={setPhone}
        error={phoneError}
        autoComplete="username"
        required
      />
      <Input
        label="App Password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="The password you chose during setup"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" loading={login.isPending} className="mt-2 w-full">
        Log in
      </Button>
    </form>
  )
}
