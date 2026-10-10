import { useCallback } from 'react'
import { decryptSecret, encryptSecret } from '@/lib/crypto'
import { useAiKeyStore } from '@/store/aiKey'
import { useCurrentUser } from '@/hooks/useSession'
import type { AiCredentials } from '@/types'

const UNREADABLE_KEY = 'Could not decrypt your API key. Please re-save it on the Dashboard.'

/**
 * The user's OpenRouter key and model choice, shared by every AI feature.
 *
 * The key is encrypted with the Angel One client id as the passphrase, so it is
 * decrypted only at the moment a request needs it and never held in state.
 */
export function useAiKey() {
  const clientId = useCurrentUser()?.clientId ?? null
  const envelope = useAiKeyStore((s) => s.envelope)
  const model = useAiKeyStore((s) => s.model)
  const setEnvelope = useAiKeyStore((s) => s.setEnvelope)
  const setModel = useAiKeyStore((s) => s.setModel)

  const save = useCallback(
    async (plaintext: string) => {
      if (!clientId) throw new Error('Sign in again before saving your key.')
      setEnvelope(await encryptSecret(plaintext, clientId))
    },
    [clientId, setEnvelope],
  )

  const clear = useCallback(() => setEnvelope(null), [setEnvelope])

  /** The decrypted key and chosen model, ready to attach to an AI request. */
  const credentials = useCallback(async (): Promise<AiCredentials> => {
    const apiKey = envelope && clientId ? await decryptSecret(envelope, clientId) : null
    if (!apiKey) throw new Error(UNREADABLE_KEY)
    return { api_key: apiKey, model }
  }, [envelope, clientId, model])

  return {
    hasKey: envelope !== null,
    /**
     * Changes whenever the saved key does. Put it in the query key of any cached
     * AI answer, so a new key never shows an answer fetched with the old one.
     */
    cacheKey: envelope,
    model,
    setModel,
    save,
    clear,
    credentials,
  }
}
