import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { ApiError } from '@/api/client'
import { PageMeta } from '@/components/layout/PageMeta'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Collapsible } from '@/components/ui/Collapsible'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useConnectBrokerage, useDisconnectBrokerage } from '@/hooks/useBrokerage'
import { useSession } from '@/hooks/useSession'
import { EMPTY_BROKER_CREDENTIALS } from '@/lib/brokerage'
import type { BrokerCredentials, BrokerageStatus } from '@/types'
import { AuthCard } from '@/features/auth/AuthCard'
import { BrokerCredentialFields } from './BrokerCredentialFields'

/** What to tell the user about where their link stands, before the form. */
function StatusNotice({ status }: { status: BrokerageStatus }) {
  switch (status) {
    case 'expired':
      return (
        <Alert variant="warning" title="Reconnect Angel One">
          Angel One stopped accepting your saved credentials &mdash; usually after a PIN or TOTP change.
          Enter them again to restore your portfolio pages.
        </Alert>
      )
    case 'failed':
      return (
        <Alert variant="error" title="The last attempt was not accepted">
          Angel One rejected those credentials, so nothing was saved. Check them and try again.
        </Alert>
      )
    case 'disconnected':
      return (
        <Alert variant="info">
          You disconnected Angel One and its credentials were deleted. Connect it again any time.
        </Alert>
      )
    default:
      return (
        <Alert variant="info">
          Learning works without a broker. Connect Angel One to unlock your dashboard, positions, research,
          news, the agent and daily briefings.
        </Alert>
      )
  }
}

export function ConnectBrokeragePage() {
  const { data } = useSession()
  // ProtectedRoute renders this only for a signed-in session.
  if (!data?.authenticated) return null

  const connected = data.brokerage_status === 'connected'
  return (
    <AuthCard
      wide
      title={connected ? 'Your brokerage' : 'Connect your brokerage'}
      sub={
        connected
          ? 'Angel One is connected. Replace the saved credentials after changing your PIN, or disconnect to delete them.'
          : 'Enter your four Angel One credentials once. We verify them with Angel One before saving anything, and store them encrypted.'
      }
    >
      <PageMeta title="Connect your brokerage" noindex />
      {connected ? (
        <ConnectedPanel clientId={data.client_id} />
      ) : (
        <div className="space-y-5">
          <StatusNotice status={data.brokerage_status} />
          <ConnectForm />
        </div>
      )}
      <p className="mt-6 text-center text-sm text-surface-200/60">
        Not sure where to find these? Follow the{' '}
        <Link to="/setup" className="font-semibold text-brand-400 hover:text-brand-300">
          setup guide
        </Link>
        .
      </p>
    </AuthCard>
  )
}

function ConnectedPanel({ clientId }: { clientId: string | null }) {
  const disconnect = useDisconnectBrokerage()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="space-y-5">
      <Alert variant="success" title="Connected">
        Angel One account <strong>{clientId}</strong> is linked to your Agentfolio account.
      </Alert>
      <div className="flex flex-wrap gap-3">
        <ButtonLink to="/dashboard">Go to dashboard</ButtonLink>
        <Button variant="danger" onClick={() => setConfirming(true)}>
          Disconnect
        </Button>
      </div>
      {disconnect.error && <Alert variant="error">{disconnect.error.message}</Alert>}

      <Collapsible title="Replace saved credentials">
        <ConnectForm submitLabel="Verify & replace" />
      </Collapsible>

      <ConfirmDialog
        open={confirming}
        title="Disconnect Angel One?"
        confirmLabel="Disconnect"
        tone="danger"
        busy={disconnect.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={() => disconnect.mutate(undefined, { onSettled: () => setConfirming(false) })}
      >
        Your saved Angel One credentials are deleted and portfolio pages, the agent, MCP access and daily
        briefings stop working. Your account and learning progress stay. You can connect again later.
      </ConfirmDialog>
    </div>
  )
}

function ConnectForm({ submitLabel = 'Verify & connect' }: { submitLabel?: string }) {
  const connect = useConnectBrokerage()
  const navigate = useNavigate()
  const location = useLocation()
  const [credentials, setCredentials] = useState<BrokerCredentials>(EMPTY_BROKER_CREDENTIALS)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    connect.mutate(credentials, {
      onSuccess: () => {
        // Back to the page that sent the user here, or the dashboard.
        const from = (location.state as { from?: Location } | null)?.from
        navigate(from ? `${from.pathname}${from.search}${from.hash}` : '/dashboard', { replace: true })
      },
    })
  }

  const error = connect.error
  const field = error instanceof ApiError ? (error.field as keyof BrokerCredentials | undefined) : undefined
  const formError = error && !field ? error.message : null

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {formError && <Alert variant="error">{formError}</Alert>}
      <BrokerCredentialFields
        required
        value={credentials}
        onChange={(key, value) => setCredentials((c) => ({ ...c, [key]: value }))}
        errorFor={(name) => (name === field ? error?.message : undefined)}
      />
      <Button type="submit" loading={connect.isPending} className="w-full">
        {connect.isPending ? 'Verifying with Angel One…' : submitLabel}
      </Button>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-surface-200/55">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden />
        Credentials are checked with Angel One first; a rejected attempt saves nothing and leaves an existing
        connection as it was. They are encrypted at rest and never shown back to you.
      </p>
    </form>
  )
}
