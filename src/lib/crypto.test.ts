import { describe, expect, it } from 'vitest'
import { decryptSecret, encryptSecret } from './crypto'

/**
 * Envelopes produced by the server-rendered app's own `static/js/utils/ai-key.js`
 * (its `encryptKey`, run once with WebCrypto and once without). If these stop
 * decrypting, users who saved a key in the old UI have lost it.
 */
const LEGACY = {
  clientId: 'AB1234',
  key: 'sk-or-v1-legacy-fixture-0123456789abcdef',
  v2: '{"v":2,"s":"IGnMTv+CyO8SD2DexMUSyw==","i":"qMz3bR/1pmPJOBtD","c":"ybB+tgERGyUL5OONfSWlgFpn+869t/e5IvkXW/IAab9qfFmowKMP+wUrb2h6J/Inolf+zqIL9vI="}',
  v1: '{"v":1,"d":"MikcXUEZN3McXlZTICFIH1VdOTZEQFYZcXMDAQcBd3UJC1JWIiZUVA=="}',
}

describe('compatibility with keys saved by the server-rendered app', () => {
  it('opens a legacy AES-GCM envelope', async () => {
    expect(await decryptSecret(LEGACY.v2, LEGACY.clientId)).toBe(LEGACY.key)
  })

  it('opens a legacy XOR envelope', async () => {
    expect(await decryptSecret(LEGACY.v1, LEGACY.clientId)).toBe(LEGACY.key)
  })
})

describe('encryptSecret', () => {
  it('round-trips through decryptSecret', async () => {
    const envelope = await encryptSecret('sk-or-v1-abc', 'XY9876')
    expect(await decryptSecret(envelope, 'XY9876')).toBe('sk-or-v1-abc')
  })

  it('writes the v2 envelope shape the old app reads', async () => {
    const env = JSON.parse(await encryptSecret('sk-or-v1-abc', 'XY9876'))
    expect(Object.keys(env)).toEqual(['v', 's', 'i', 'c'])
    expect(env.v).toBe(2)
    expect(atob(env.s)).toHaveLength(16)
    expect(atob(env.i)).toHaveLength(12)
  })

  it('salts every envelope, so equal keys never look equal at rest', async () => {
    const a = await encryptSecret('same', 'XY9876')
    const b = await encryptSecret('same', 'XY9876')
    expect(a).not.toBe(b)
  })

  it('never stores the plaintext', async () => {
    const envelope = await encryptSecret('sk-or-v1-plaintext', 'XY9876')
    expect(envelope).not.toContain('plaintext')
  })
})

describe('decryptSecret fails closed', () => {
  it.each([
    ['the wrong passphrase', LEGACY.v2, 'ZZ0000'],
    ['malformed JSON', '{"v":2,', LEGACY.clientId],
    ['a JSON non-object', '"just a string"', LEGACY.clientId],
    ['an unknown version', '{"v":9}', LEGACY.clientId],
    ['a tampered ciphertext', LEGACY.v2.replace('ybB', 'xbB'), LEGACY.clientId],
  ])('returns null for %s', async (_label, envelope, passphrase) => {
    expect(await decryptSecret(envelope, passphrase)).toBeNull()
  })
})
