import api from './client'

export interface FeedbackPayload {
  name: string
  phone: string
  feedback: string
  /** Honeypot: hidden from people, so anything in it marks a bot. */
  website: string
}

/**
 * Send landing-page feedback; the server replies to it on WhatsApp.
 *
 * A fresh single-use token is minted right before each submit, so a form left
 * open past the token's ten-minute lifetime still goes through.
 */
export async function sendFeedback(payload: FeedbackPayload): Promise<string> {
  const { data: mint } = await api.get<{ token: string }>('/api/feedback/token')
  const { data } = await api.post<{ ok: true; message?: string }>('/api/feedback', {
    ...payload,
    token: mint.token,
  })
  return data.message || 'Sent! Check your WhatsApp.'
}
