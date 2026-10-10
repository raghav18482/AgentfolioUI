import { useState, type FormEvent } from 'react'
import { clsx } from 'clsx'
import { ExternalLink, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAiKey } from '@/hooks/useAiKey'
import { useToast } from '@/hooks/useToast'
import { LINKS } from '@/lib/links'
import { PRESET_MODELS } from '@/store/aiKey'

const CUSTOM = '__custom__'

const fieldClass =
  'rounded-xl border border-surface-700 bg-surface-800/60 px-3.5 py-2 text-sm text-white outline-none transition-all placeholder:text-surface-200/30 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30'

function isPreset(model: string): boolean {
  return (PRESET_MODELS as readonly string[]).includes(model)
}

/**
 * Where the user's OpenRouter key is saved (encrypted, in this browser only)
 * and the model chosen. Every AI feature in the app reads both from here.
 */
export function AiKeyBar() {
  const { hasKey, save, clear, model, setModel } = useAiKey()
  const toast = useToast()
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [customMode, setCustomMode] = useState(() => !isPreset(model))
  const [customModel, setCustomModel] = useState(() => (isPreset(model) ? '' : model))

  async function onSave(e: FormEvent) {
    e.preventDefault()
    const key = draft.trim()
    if (!key) return
    setSaving(true)
    try {
      await save(key)
      setDraft('')
      toast.success('Key saved — encrypted in this browser')
    } catch (err) {
      toast.error(`Encryption failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSaving(false)
    }
  }

  function onModelSelect(value: string) {
    if (value === CUSTOM) {
      setCustomMode(true)
      if (customModel.trim()) setModel(customModel.trim())
      return
    }
    setCustomMode(false)
    setModel(value)
  }

  // Persisted on every keystroke: a request can fire before the field ever
  // blurs, and it must use what is typed, not the model before it.
  function onCustomModel(value: string) {
    setCustomModel(value)
    setModel(value.trim() || PRESET_MODELS[0])
  }

  return (
    <Card>
      <form onSubmit={onSave} className="flex flex-wrap items-center gap-3">
        <label htmlFor="ai-key" className="text-sm font-medium text-white">
          OpenRouter API Key
        </label>
        <a
          href={LINKS.openRouterKeys}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300"
        >
          Get your API key <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
        <input
          id="ai-key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="sk-or-v1-..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={clsx(fieldClass, 'min-w-[12rem] flex-1')}
        />
        <Button type="submit" size="sm" loading={saving} disabled={!draft.trim()}>
          Save Key
        </Button>
        <Button size="sm" variant="secondary" onClick={clear} disabled={!hasKey}>
          Clear
        </Button>
        <span
          role="status"
          className={clsx(
            'inline-flex items-center gap-1.5 text-xs',
            hasKey ? 'text-emerald-400' : 'text-surface-200/45',
          )}
        >
          {hasKey && <Lock className="h-3 w-3" aria-hidden />}
          {hasKey ? 'Key saved' : 'No key configured'}
        </span>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor="ai-model" className="text-sm font-medium text-white">
          Model
        </label>
        <select
          id="ai-model"
          value={customMode ? CUSTOM : model}
          onChange={(e) => onModelSelect(e.target.value)}
          className={clsx(fieldClass, 'max-w-[16rem] cursor-pointer')}
        >
          {PRESET_MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
          <option value={CUSTOM}>Other (enter ID)</option>
        </select>
        {customMode && (
          <input
            aria-label="Custom model ID"
            placeholder="provider/model-id"
            autoFocus={!customModel}
            spellCheck={false}
            value={customModel}
            onChange={(e) => onCustomModel(e.target.value)}
            className={clsx(fieldClass, 'min-w-[12rem] max-w-[24rem] flex-1')}
          />
        )}
      </div>
    </Card>
  )
}
