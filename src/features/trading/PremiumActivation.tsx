import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Crown } from 'lucide-react'
import { registerPremium } from '@/api/premium'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { AuthConfigGate } from '@/features/auth/AuthConfigGate'
import { sessionQueryKey, useCurrentUser } from '@/hooks/useSession'
import type { AuthConfig, PhoneValue } from '@/types'

export function PremiumActivation() {
  const user = useCurrentUser()

  return (
    <Card>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
        <Crown className="h-4 w-4 text-amber-400" aria-hidden />
        Premium Activation
      </h2>
      {user?.premium.registered ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
          <div>
            <p className="font-medium text-white">Premium is active</p>
            <p className="text-sm text-surface-200/65">
              WhatsApp alerts will be sent to{' '}
              <strong className="text-surface-200/90">{user.premium.whatsapp_number}</strong>.
            </p>
          </div>
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-300">
            ACTIVE
          </span>
        </div>
      ) : (
        <AuthConfigGate>{(config) => <ActivationForm config={config} />}</AuthConfigGate>
      )}
    </Card>
  )
}

function ActivationForm({ config }: { config: AuthConfig }) {
  const queryClient = useQueryClient()
  const [phone, setPhone] = useState<PhoneValue>({ dial: config.default_dial_code, national: '' })

  const activate = useMutation({
    mutationFn: () => registerPremium(phone.dial, phone.national),
    // The session carries premium status; refreshing it unlocks the workspace.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    activate.mutate()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <p className="font-medium text-white">Activate the Premium Trading Agent</p>
        <p className="mt-1 text-sm text-surface-200/60">
          Get trade proposals and approvals delivered to WhatsApp. We use the Angel One credentials from your
          current session, so you only need to share a number.
        </p>
      </div>
      {activate.isError && <Alert variant="error">{activate.error.message}</Alert>}
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[18rem] flex-1">
          <PhoneInput
            label="WhatsApp number"
            countries={config.countries}
            value={phone}
            onChange={setPhone}
            required
            hint="Pick your country code, then the number without it."
          />
        </div>
        <Button type="submit" loading={activate.isPending} className="mb-[1.375rem]">
          Activate
        </Button>
      </div>
    </form>
  )
}
