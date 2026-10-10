/**
 * Encryption for the OpenRouter key kept in localStorage.
 *
 * Byte-compatible with the server-rendered app's `static/js/utils/ai-key.js`, so
 * a key saved there still unlocks here. Three things must therefore never
 * change: the envelope shapes (`{v:2,s,i,c}` and `{v:1,d}`), the key derivation
 * (PBKDF2, SHA-256, 100 000 iterations, 16-byte salt → AES-GCM-256 with a 12-byte
 * IV), and the passphrase (the Angel One client id). Changing any of them
 * silently locks every existing user out of their own key.
 *
 * AES-GCM runs wherever `crypto.subtle` exists — HTTPS and localhost. Plain HTTP
 * falls back to XOR, which is not real encryption: it only keeps the key out of
 * a casual glance at localStorage, exactly as the original did.
 */

const PBKDF2_ITERATIONS = 100_000
const SALT_BYTES = 16
const IV_BYTES = 12

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function hasSubtle(): boolean {
  return typeof crypto !== 'undefined' && crypto.subtle !== undefined
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function deriveKey(
  passphrase: string,
  salt: Uint8Array<ArrayBuffer>,
  usage: 'encrypt' | 'decrypt',
): Promise<CryptoKey> {
  const raw = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false,
    [usage],
  )
}

function xor(input: Uint8Array, secret: string): Uint8Array {
  const out = new Uint8Array(input.length)
  for (let i = 0; i < input.length; i++) out[i] = input[i] ^ secret.charCodeAt(i % secret.length)
  return out
}

/** Encrypt `plaintext` into a JSON envelope only `passphrase` can open. */
export async function encryptSecret(plaintext: string, passphrase: string): Promise<string> {
  if (!hasSubtle()) {
    return JSON.stringify({ v: 1, d: toBase64(xor(encoder.encode(plaintext), passphrase)) })
  }
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const key = await deriveKey(passphrase, salt, 'encrypt')
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plaintext))
  return JSON.stringify({ v: 2, s: toBase64(salt), i: toBase64(iv), c: toBase64(new Uint8Array(ct)) })
}

/**
 * Open an envelope from {@link encryptSecret} — or from the old app.
 *
 * Returns `null` rather than throwing for anything unreadable: a wrong
 * passphrase, a tampered envelope, or a v2 envelope on a plain-HTTP page that
 * has no WebCrypto to open it with.
 */
export async function decryptSecret(envelope: string, passphrase: string): Promise<string | null> {
  try {
    const parsed: unknown = JSON.parse(envelope)
    if (typeof parsed !== 'object' || parsed === null) return null
    const env = parsed as Record<string, unknown>

    if (env.v === 2 && hasSubtle()) {
      const salt = fromBase64(String(env.s))
      const key = await deriveKey(passphrase, salt, 'decrypt')
      const pt = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: fromBase64(String(env.i)) },
        key,
        fromBase64(String(env.c)),
      )
      return decoder.decode(pt)
    }
    if (env.v === 1) return decoder.decode(xor(fromBase64(String(env.d)), passphrase))
    return null
  } catch {
    return null
  }
}
