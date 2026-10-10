import { create } from 'zustand'

/**
 * The same localStorage keys the server-rendered app used, so a key saved there
 * carries over. The value under `KEY_STORAGE` is an encrypted envelope from
 * `lib/crypto` — never the key itself.
 */
const KEY_STORAGE = 'mfmcp_ai_key'
const MODEL_STORAGE = 'mfmcp_ai_model'

export const PRESET_MODELS = [
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'anthropic/claude-3.5-haiku',
  'google/gemini-2.0-flash-001',
] as const

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null // storage disabled, e.g. some private-browsing modes
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Storage disabled: the choice lasts for this page view only.
  }
}

interface AiKeyState {
  /** The encrypted OpenRouter key, or `null` when none is saved. */
  envelope: string | null
  /** An OpenRouter model id, e.g. `openai/gpt-4o-mini`. */
  model: string
  setEnvelope: (envelope: string | null) => void
  setModel: (model: string) => void
}

export const useAiKeyStore = create<AiKeyState>((set) => ({
  envelope: read(KEY_STORAGE),
  model: read(MODEL_STORAGE) || PRESET_MODELS[0],
  setEnvelope: (envelope) => {
    write(KEY_STORAGE, envelope)
    set({ envelope })
  },
  setModel: (model) => {
    write(MODEL_STORAGE, model)
    set({ model })
  },
}))
