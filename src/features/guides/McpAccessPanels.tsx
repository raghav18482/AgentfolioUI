import { useState, type FormEvent } from 'react'
import { KeyRound, PlugZap } from 'lucide-react'
import { ApiError } from '@/api/client'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import {
  useCreateMcpToken,
  useMcpTokens,
  useOAuthConnections,
  useRevokeMcpToken,
  useRevokeOAuthConnection,
} from '@/hooks/useMcpAccess'
import type { McpToken, OAuthConnection } from '@/types'
import { formatIst } from '@/utils/time'
import { GuideNote } from './GuideNote'

const DEFAULT_TTL_DAYS = 30
const MAX_TTL_DAYS = 90

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

/** Apps connected through OAuth sign-in, e.g. a claude.ai custom connector. */
export function ConnectedApps() {
  const connections = useOAuthConnections(true)
  const revoke = useRevokeOAuthConnection()
  const toast = useToast()
  const [pending, setPending] = useState<OAuthConnection | null>(null)

  function confirmRevoke() {
    if (!pending) return
    revoke.mutate(pending.id, {
      onSuccess: () => toast.success(`${pending.client_name} disconnected`),
      onError: (e) => toast.error(errorText(e, 'Could not disconnect the app')),
      onSettled: () => setPending(null),
    })
  }

  const columns: Column<OAuthConnection>[] = [
    { header: 'App', cell: (c) => <span className="font-medium text-white">{c.client_name}</span> },
    { header: 'Access', cell: () => <Badge variant="success">Read-only</Badge>, hideBelow: 'sm' },
    { header: 'Connected', cell: (c) => formatIst(c.created_at), hideBelow: 'md' },
    { header: 'Last used', cell: (c) => formatIst(c.last_used_at) },
    {
      header: 'Disconnect',
      align: 'right',
      cell: (c) => (
        <Button size="sm" variant="danger" onClick={() => setPending(c)}>
          Disconnect
        </Button>
      ),
    },
  ]

  if (connections.isPending) return <Skeleton className="h-16 w-full" />
  if (connections.isError) {
    return <Alert variant="error">{errorText(connections.error, 'Could not load connected apps')}</Alert>
  }

  return (
    <>
      {connections.data.length ? (
        <div className="-mx-1 rounded-xl border border-surface-800">
          <DataTable caption="Connected apps" columns={columns} rows={connections.data} rowKey={(c) => String(c.id)} />
        </div>
      ) : (
        <EmptyState compact icon={PlugZap} title="No apps connected yet" />
      )}
      <ConfirmDialog
        open={pending !== null}
        title="Disconnect this app?"
        confirmLabel="Disconnect"
        tone="danger"
        busy={revoke.isPending}
        onConfirm={confirmRevoke}
        onCancel={() => setPending(null)}
      >
        {pending?.client_name} loses access to your portfolio immediately. You can connect it again at any time.
      </ConfirmDialog>
    </>
  )
}

/** Create, list and revoke personal access tokens. */
export function AccessTokens() {
  const tokens = useMcpTokens(true)
  const create = useCreateMcpToken()
  const revoke = useRevokeMcpToken()
  const toast = useToast()
  const [name, setName] = useState('')
  const [ttl, setTtl] = useState(String(DEFAULT_TTL_DAYS))
  const [password, setPassword] = useState('')
  const [created, setCreated] = useState<string | null>(null)
  const [pending, setPending] = useState<McpToken | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setCreated(null)
    create.mutate(
      { name: name.trim() || 'MCP client', ttl_days: Number(ttl) || DEFAULT_TTL_DAYS, app_password: password },
      {
        onSuccess: (data) => {
          setCreated(data.token)
          setName('')
        },
        // The password is cleared whatever happens: it is never kept in the page.
        onSettled: () => setPassword(''),
      },
    )
  }

  function confirmRevoke() {
    if (!pending) return
    revoke.mutate(pending.id, {
      onSuccess: () => toast.success(`Token "${pending.name}" revoked`),
      onError: (e) => toast.error(errorText(e, 'Could not revoke the token')),
      onSettled: () => setPending(null),
    })
  }

  const passwordError =
    create.error instanceof ApiError && create.error.field === 'app_password' ? create.error.message : undefined
  const formError = create.error && !passwordError ? errorText(create.error, 'Could not create the token') : null

  const columns: Column<McpToken>[] = [
    { header: 'Name', cell: (t) => <span className="font-medium text-white">{t.name}</span> },
    {
      header: 'Token',
      cell: (t) => <code className="text-xs text-surface-200/70">{t.prefix}&hellip;</code>,
      hideBelow: 'sm',
    },
    { header: 'Expires', cell: (t) => formatIst(t.expires_at), hideBelow: 'md' },
    { header: 'Last used', cell: (t) => formatIst(t.last_used_at), hideBelow: 'md' },
    {
      header: 'Status',
      align: 'right',
      cell: (t) =>
        t.active ? (
          <Button size="sm" variant="danger" onClick={() => setPending(t)}>
            Revoke
          </Button>
        ) : (
          <Badge>{t.revoked ? 'Revoked' : 'Expired'}</Badge>
        ),
    },
  ]

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2" autoComplete="off">
        <Input
          label="Token name"
          value={name}
          maxLength={60}
          placeholder="e.g. Cursor on my laptop"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Expires in (days)"
          type="number"
          min={1}
          max={MAX_TTL_DAYS}
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
        <div className="sm:col-span-2">
          <Input
            label="App password (to confirm it is you)"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            error={passwordError}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" loading={create.isPending} disabled={!password}>
            <KeyRound className="h-4 w-4" aria-hidden />
            Create token
          </Button>
        </div>
      </form>

      {formError && <Alert variant="error">{formError}</Alert>}
      {created && (
        <div className="space-y-2">
          <GuideNote tone="danger">
            <strong className="text-white">Copy this token now.</strong> Only a hash is stored, so it cannot be
            shown again.
          </GuideNote>
          <CodeBlock label="Your new token" code={created} />
        </div>
      )}

      {tokens.isPending ? (
        <Skeleton className="h-16 w-full" />
      ) : tokens.isError ? (
        <Alert variant="error">{errorText(tokens.error, 'Could not load tokens')}</Alert>
      ) : tokens.data.length ? (
        <div className="-mx-1 rounded-xl border border-surface-800">
          <DataTable caption="Your access tokens" columns={columns} rows={tokens.data} rowKey={(t) => String(t.id)} />
        </div>
      ) : (
        <EmptyState compact icon={KeyRound} title="No tokens yet" />
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Revoke this token?"
        confirmLabel="Revoke"
        tone="danger"
        busy={revoke.isPending}
        onConfirm={confirmRevoke}
        onCancel={() => setPending(null)}
      >
        Clients using &ldquo;{pending?.name}&rdquo; stop working immediately.
      </ConfirmDialog>
    </div>
  )
}
