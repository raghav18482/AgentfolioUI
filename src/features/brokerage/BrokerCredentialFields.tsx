import type { BrokerCredentials } from '@/types'
import { Input } from '@/components/ui/Input'

interface BrokerCredentialFieldsProps {
  value: BrokerCredentials
  onChange: (key: keyof BrokerCredentials, value: string) => void
  /** Required when connecting; optional on the registration form, where all four may be left empty. */
  required?: boolean
  /** The server's message for one field, when it names one. */
  errorFor?: (field: keyof BrokerCredentials) => string | undefined
}

/** The four Angel One inputs, shared by registration and the connect page. */
export function BrokerCredentialFields({ value, onChange, required = false, errorFor }: BrokerCredentialFieldsProps) {
  return (
    <>
      <Input
        label="Client ID"
        required={required}
        autoComplete="off"
        placeholder="e.g. AB1234"
        value={value.client_id}
        onChange={(e) => onChange('client_id', e.target.value)}
        error={errorFor?.('client_id')}
      />
      <Input
        label="API Key"
        required={required}
        autoComplete="off"
        placeholder="Your Angel One API key"
        value={value.api_key}
        onChange={(e) => onChange('api_key', e.target.value)}
        error={errorFor?.('api_key')}
      />
      <Input
        label="PIN / Password"
        type="password"
        required={required}
        autoComplete="off"
        placeholder="Your trading PIN"
        value={value.password}
        onChange={(e) => onChange('password', e.target.value)}
        error={errorFor?.('password')}
      />
      <Input
        label="TOTP Secret"
        type="password"
        required={required}
        autoComplete="off"
        placeholder="Base32 TOTP secret from Angel One"
        value={value.totp_secret}
        onChange={(e) => onChange('totp_secret', e.target.value)}
        error={errorFor?.('totp_secret')}
        hint="The secret behind your authenticator app, not a six-digit code."
      />
    </>
  )
}
