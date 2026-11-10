import type { BrokerCredentials, Session } from '@/types'

/** The broker fields in the order the form shows them; the first missing one gets the error. */
export const BROKER_FIELDS = ['client_id', 'api_key', 'password', 'totp_secret'] as const satisfies readonly (keyof BrokerCredentials)[]

export const EMPTY_BROKER_CREDENTIALS: BrokerCredentials = { client_id: '', api_key: '', password: '', totp_secret: '' }

export type BrokerFields =
  | { kind: 'none' }
  | { kind: 'all'; credentials: BrokerCredentials }
  | { kind: 'partial'; missing: keyof BrokerCredentials }

/**
 * Registration takes the Angel One fields all together or not at all, as the
 * server does. Whitespace-only counts as empty; the PIN is sent as typed.
 */
export function brokerFields(c: BrokerCredentials): BrokerFields {
  const filled = BROKER_FIELDS.filter((k) => c[k].trim() !== '')
  if (filled.length === 0) return { kind: 'none' }
  const missing = BROKER_FIELDS.find((k) => c[k].trim() === '')
  if (missing) return { kind: 'partial', missing }
  return {
    kind: 'all',
    credentials: {
      client_id: c.client_id.trim(),
      api_key: c.api_key.trim(),
      password: c.password,
      totp_secret: c.totp_secret.trim(),
    },
  }
}

export function isBrokerageConnected(session: Session | undefined): boolean {
  return session?.authenticated === true && session.brokerage_status === 'connected'
}

/** Where a signed-in user lands by default: their portfolio, or learning until a broker is connected. */
export function homePath(session: Session | undefined): string {
  return isBrokerageConnected(session) ? '/dashboard' : '/learn'
}

