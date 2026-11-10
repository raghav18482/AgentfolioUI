import { describe, expect, it } from 'vitest'
import type { Session } from '@/types'
import { EMPTY_BROKER_CREDENTIALS, brokerFields, homePath, isBrokerageConnected } from './brokerage'

const full = { client_id: ' AB1234 ', api_key: ' KEY ', password: ' 4321 ', totp_secret: ' JBSW Y3DP ' }

function signedIn(brokerage_status: Extract<Session, { authenticated: true }>['brokerage_status']): Session {
  return {
    authenticated: true,
    user_id: 1,
    phone_number: '+919876543210',
    whatsapp_number: '+919876543210',
    client_id: brokerage_status === 'connected' ? 'AB1234' : null,
    brokerage_status,
    available_features: brokerage_status === 'connected' ? ['learning', 'brokerage'] : ['learning'],
    premium: { registered: brokerage_status === 'connected', whatsapp_number: null },
  }
}

describe('brokerFields', () => {
  it('treats an untouched or whitespace-only form as "connect later"', () => {
    expect(brokerFields(EMPTY_BROKER_CREDENTIALS)).toEqual({ kind: 'none' })
    expect(brokerFields({ client_id: ' ', api_key: '', password: '  ', totp_secret: '' })).toEqual({ kind: 'none' })
  })

  it('names the first missing field when only some are filled', () => {
    expect(brokerFields({ ...EMPTY_BROKER_CREDENTIALS, client_id: 'AB1234' })).toEqual({
      kind: 'partial',
      missing: 'api_key',
    })
    expect(brokerFields({ ...full, totp_secret: '' })).toEqual({ kind: 'partial', missing: 'totp_secret' })
  })

  it('trims identifiers but sends the PIN exactly as typed', () => {
    expect(brokerFields(full)).toEqual({
      kind: 'all',
      credentials: { client_id: 'AB1234', api_key: 'KEY', password: ' 4321 ', totp_secret: 'JBSW Y3DP' },
    })
  })
})

describe('session helpers', () => {
  it('counts only "connected" as connected', () => {
    expect(isBrokerageConnected(signedIn('connected'))).toBe(true)
    for (const s of ['not_connected', 'pending', 'expired', 'disconnected', 'failed'] as const) {
      expect(isBrokerageConnected(signedIn(s))).toBe(false)
    }
    expect(isBrokerageConnected({ authenticated: false })).toBe(false)
    expect(isBrokerageConnected(undefined)).toBe(false)
  })

  it('sends connected users to the dashboard and everyone else to learning', () => {
    expect(homePath(signedIn('connected'))).toBe('/dashboard')
    expect(homePath(signedIn('not_connected'))).toBe('/learn')
    expect(homePath(signedIn('expired'))).toBe('/learn')
  })
})
