import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { Bell, Clock, RefreshCw, Save, Send } from 'lucide-react'
import { disableBriefingSchedule, saveBriefingSchedule, sendBriefingNow } from '@/api/trading'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Spinner } from '@/components/ui/Spinner'
import { Switch } from '@/components/ui/Switch'
import { useBriefingLogs, useBriefingSchedule } from '@/hooks/useTrading'
import { useCurrentUser } from '@/hooks/useSession'
import { formatIst, istClockTime } from '@/utils/time'
import type { BriefingLog, BriefingSchedule } from '@/types'

const DEFAULT_TIME = '08:30'
/** A manual send runs in the background; its log row lands about this much later. */
const SEND_SETTLE_MS = 35_000

type Message = { text: string; tone: 'info' | 'success' | 'error' } | null

function ScheduleBadge({ schedule }: { schedule: BriefingSchedule }) {
  const [label, tone] =
    schedule.status === 'running'
      ? ['● RUNNING', 'bg-brand-500/15 text-brand-300']
      : schedule.enabled
        ? ['● ACTIVE', 'bg-emerald-500/15 text-emerald-300']
        : ['PAUSED', 'bg-surface-800 text-surface-200/60']
  return <span className={clsx('rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide', tone)}>{label}</span>
}

export function BriefingScheduler() {
  const schedule = useBriefingSchedule()
  const whatsapp = useCurrentUser()?.premium.whatsapp_number

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300">
            <Bell className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">Daily Portfolio Brief</h2>
            <p className="text-sm text-surface-200/60">
              AI briefing with ML signals for every holding, sent to{' '}
              <strong className="text-surface-200/90">{whatsapp ?? 'your WhatsApp'}</strong>
            </p>
          </div>
        </div>
        {schedule.data && <ScheduleBadge schedule={schedule.data} />}
      </div>

      {schedule.isPending ? (
        <Spinner />
      ) : (
        // Mounted only once the schedule has loaded, so it starts from the saved values.
        <ScheduleForm schedule={schedule.data ?? null} />
      )}
      <ActivityLog />
    </Card>
  )
}

function ScheduleForm({ schedule }: { schedule: BriefingSchedule | null }) {
  const queryClient = useQueryClient()
  const [time, setTime] = useState(() => istClockTime(schedule?.next_run) ?? DEFAULT_TIME)
  const [enabled, setEnabled] = useState(schedule?.enabled ?? true)
  const [message, setMessage] = useState<Message>(null)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [sentAt, setSentAt] = useState<number | null>(null)

  // Re-read the log once the background send has had time to finish.
  useEffect(() => {
    if (sentAt === null) return
    const timer = setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey: ['briefing-logs'] })
    }, SEND_SETTLE_MS)
    return () => clearTimeout(timer)
  }, [sentAt, queryClient])

  const save = useMutation({
    mutationFn: () => saveBriefingSchedule(time, enabled),
    onSuccess: (saved) => {
      queryClient.setQueryData(['briefing-schedule'], saved)
      setMessage({ text: `Schedule saved — next send ${formatIst(saved.next_run)}`, tone: 'success' })
    },
    onError: (err) => setMessage({ text: err.message, tone: 'error' }),
  })

  const sendNow = useMutation({
    mutationFn: sendBriefingNow,
    onMutate: () => setMessage({ text: 'Generating briefing and sending to WhatsApp…', tone: 'info' }),
    onSuccess: (text) => {
      setMessage({ text, tone: 'success' })
      setSentAt(Date.now())
    },
    onError: (err) => setMessage({ text: err.message, tone: 'error' }),
  })

  const remove = useMutation({
    mutationFn: disableBriefingSchedule,
    onSuccess: () => {
      setEnabled(false)
      setMessage({ text: 'Schedule removed.', tone: 'info' })
      void queryClient.invalidateQueries({ queryKey: ['briefing-schedule'] })
    },
    onError: (err) => setMessage({ text: err.message, tone: 'error' }),
    onSettled: () => setConfirmRemove(false),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^\d{2}:\d{2}$/.test(time)) {
      setMessage({ text: 'Please pick a valid time.', tone: 'error' })
      return
    }
    save.mutate()
  }

  return (
    <>
      {schedule && (
        <dl className="mb-4 grid grid-cols-3 gap-3 rounded-xl border border-surface-800 bg-surface-900/40 p-3 text-sm">
          {[
            ['Next send', schedule.enabled ? formatIst(schedule.next_run) : '—'],
            ['Last sent', formatIst(schedule.last_run)],
            ['Cadence', 'Daily · IST'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] uppercase tracking-wider text-surface-200/45">{label}</dt>
              <dd className="mt-0.5 font-medium text-white">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-surface-200/80">
            Send time (IST)
            <span className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-200/40" aria-hidden />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-xl border border-surface-700 bg-surface-800/60 py-2 pl-9 pr-3 text-sm text-white outline-none [color-scheme:dark] focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
              />
            </span>
          </label>
          <Switch checked={enabled} onChange={setEnabled} label="Auto-send" className="pb-2" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" loading={save.isPending}>
            <Save className="h-3.5 w-3.5" aria-hidden /> Save Schedule
          </Button>
          <Button
            size="sm"
            className="bg-emerald-500 text-emerald-950 shadow-none hover:bg-emerald-400"
            loading={sendNow.isPending}
            onClick={() => sendNow.mutate()}
          >
            <Send className="h-3.5 w-3.5" aria-hidden /> Send Now
          </Button>
          {schedule?.enabled && (
            <Button size="sm" variant="ghost" onClick={() => setConfirmRemove(true)}>
              Remove
            </Button>
          )}
        </div>

        <p
          role="status"
          className={clsx(
            'min-h-[1.25rem] text-sm',
            message?.tone === 'error' && 'text-rose-300',
            message?.tone === 'success' && 'text-emerald-400',
            message?.tone === 'info' && 'text-surface-200/70',
          )}
        >
          {message?.text}
        </p>
      </form>

      <ConfirmDialog
        open={confirmRemove}
        title="Remove the daily briefing?"
        confirmLabel="Remove schedule"
        tone="danger"
        busy={remove.isPending}
        onConfirm={() => remove.mutate()}
        onCancel={() => setConfirmRemove(false)}
      >
        Automatic sends stop until you save a schedule again. You can still send a briefing manually.
      </ConfirmDialog>
    </>
  )
}

function logTone(status: BriefingLog['status']) {
  if (status === 'success') return 'success'
  if (status === 'running') return 'running'
  return 'failed'
}

const dot = { success: 'bg-emerald-400', running: 'bg-brand-400', failed: 'bg-rose-400' }
const pill = {
  success: 'bg-emerald-500/10 text-emerald-300',
  running: 'bg-brand-500/10 text-brand-300',
  failed: 'bg-rose-500/10 text-rose-300',
}

function ActivityLog() {
  const logs = useBriefingLogs()
  if (!logs.data?.length) return null

  return (
    <div className="mt-2 border-t border-surface-800/60 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-200/50">Recent activity</h3>
        <button
          type="button"
          onClick={() => logs.refetch()}
          className="inline-flex cursor-pointer items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
        >
          <RefreshCw className={clsx('h-3 w-3', logs.isFetching && 'animate-spin')} aria-hidden /> Refresh
        </button>
      </div>
      <ul className="space-y-1.5">
        {logs.data.map((log) => {
          const tone = logTone(log.status)
          const text = (log.message ?? '').replace(/manual send · /, '').slice(0, 72)
          return (
            <li key={log.id} className="flex flex-wrap items-center gap-2 text-xs">
              <span aria-hidden className={clsx('h-1.5 w-1.5 rounded-full', dot[tone])} />
              <span className={clsx('rounded px-1.5 py-0.5 font-medium', pill[tone])}>{log.status}</span>
              <span className="text-surface-200/50">{formatIst(log.created_at)}</span>
              <span className="min-w-0 flex-1 truncate text-surface-200/70">{text}</span>
              {log.duration_ms ? <span className="text-surface-200/40">{(log.duration_ms / 1000).toFixed(1)}s</span> : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
