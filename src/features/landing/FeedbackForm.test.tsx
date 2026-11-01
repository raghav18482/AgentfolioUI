import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FeedbackForm } from './FeedbackForm'

function render(replyMode?: boolean) {
  const client = new QueryClient()
  if (replyMode !== undefined) client.setQueryData(['feedback-mode'], replyMode)
  return renderToString(
    <QueryClientProvider client={client}>
      <FeedbackForm />
    </QueryClientProvider>,
  )
}

describe('FeedbackForm', () => {
  it('asks for no phone number before the mode is known (prerender, or a failed fetch)', () => {
    const html = render()
    expect(html).not.toContain('WhatsApp number')
    expect(html).not.toContain('Get a reply on WhatsApp')
    expect(html).toContain('Your feedback')
  })

  it('asks for no phone number when replies are off', () => {
    expect(render(false)).not.toContain('WhatsApp number')
  })

  it('shows the WhatsApp fields only in reply mode, with a placeholder number', () => {
    const html = render(true)
    expect(html).toContain('WhatsApp number')
    expect(html).toContain('+91 00000 00000')
  })
})
