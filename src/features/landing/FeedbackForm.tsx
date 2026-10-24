import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { sendFeedback } from '@/api/feedback'

const MAX_FEEDBACK_CHARS = 1000

/** Public feedback → AI-written reply on the sender's WhatsApp. Mirrors the Jinja landing form. */
export function FeedbackForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [feedback, setFeedback] = useState('')
  const [website, setWebsite] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const send = useMutation({
    mutationFn: sendFeedback,
    onSuccess: () => {
      setName('')
      setPhone('')
      setFeedback('')
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!feedback.trim()) return setFormError('Please enter your feedback.')
    if (!phone.trim()) return setFormError('Please enter your WhatsApp number.')
    setFormError(null)
    send.mutate({ name: name.trim(), phone: phone.trim(), feedback: feedback.trim(), website })
  }

  const sent = send.isSuccess
  const error = formError ?? (send.isError ? send.error.message : null)
  const status = send.isPending ? 'Sending…' : sent ? send.data : error

  return (
    <section className="px-4 py-20" aria-labelledby="feedback-title">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-surface-800/60 bg-gradient-to-b from-surface-900/80 to-surface-950 p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-300">
              <MessageCircle className="h-3.5 w-3.5" />
              See the AI live
            </div>
            <h2 id="feedback-title" className="font-display text-3xl font-bold text-white sm:text-4xl">
              Tell us what you think.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-brand-400 bg-clip-text text-transparent">
                Get a reply on WhatsApp.
              </span>
            </h2>
            <p className="mt-4 text-surface-200/60 text-lg max-w-xl mx-auto">
              Drop your feedback below and our AI will craft a personal response and send it
              straight to your WhatsApp — a quick taste of the assistant that powers Agentfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Leave this empty
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name (optional)"
                maxLength={80}
                placeholder="Your name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="WhatsApp number"
                type="tel"
                inputMode="tel"
                required
                placeholder="e.g. +91 81070 37133"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fb-message" className="mb-1.5 block text-sm font-medium text-surface-200/80">
                Your feedback
              </label>
              <textarea
                id="fb-message"
                required
                rows={4}
                maxLength={MAX_FEEDBACK_CHARS}
                placeholder="What do you love, what's missing, what should we build next?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full resize-y rounded-xl border border-surface-700 bg-surface-800/60 px-4 py-2.5 text-sm text-white placeholder:text-surface-200/30 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" loading={send.isPending} disabled={sent}>
                {sent ? 'Sent ✓' : 'Send feedback'}
              </Button>
              <p
                role="status"
                aria-live="polite"
                className={clsx(
                  'text-sm',
                  sent ? 'text-emerald-400' : error && !send.isPending ? 'text-rose-400' : 'text-surface-200/60',
                )}
              >
                {status}
              </p>
            </div>
            <p className="text-xs text-surface-200/40">
              We use your number only to send this one reply. Standard WhatsApp messaging applies.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
