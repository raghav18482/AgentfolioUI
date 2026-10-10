import { clsx } from 'clsx'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '@/hooks/useToast'

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const styles = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  info: 'border-brand-500/30 bg-brand-500/10 text-brand-300',
}

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={clsx(
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-slide-up',
              styles[t.type],
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="shrink-0 cursor-pointer opacity-60 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
