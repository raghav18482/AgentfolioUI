import api from './client'

export interface FeedbackInput {
  name: string
  phone: string
  feedback: string
  /** Honeypot: hidden from people, so anything in it marks a bot. */
  website: string
}

interface TokenResponse {
  token: string
  /** True only when the server will reply on WhatsApp; absent on older servers. */
  whatsapp_reply?: boolean
}

/**
 * Whether the server replies to feedback on WhatsApp. Anything but an explicit
 * `true` means no: the form then never asks for a phone number.
 */
export function parseWhatsappReply(data: Partial<TokenResponse> | undefined): boolean {
  return data?.whatsapp_reply === true
}

/** The request body. The phone number and name are sent only in reply mode. */
export function buildFeedbackBody(input: FeedbackInput, whatsappReply: boolean, token: string) {
  const base = { feedback: input.feedback, website: input.website, channel: 'react' as const, token }
  return whatsappReply ? { ...base, name: input.name, phone: input.phone } : base
}

/** Asks the server which mode it is in. Mints a throwaway token as a side effect. */
export async function fetchFeedbackMode(): Promise<boolean> {
  const { data } = await api.get<TokenResponse>('/api/feedback/token')
  return parseWhatsappReply(data)
}

/**
 * Send landing-page feedback. In reply mode the server answers it on WhatsApp;
 * otherwise it is stored.
 *
 * A fresh single-use token is minted right before each submit, so a form left
 * open past the token's ten-minute lifetime still goes through. The mode is
 * read from that same response, so a server switched off mid-session is never
 * sent a phone number.
 */
export async function sendFeedback(input: FeedbackInput): Promise<string> {
  const { data: mint } = await api.get<TokenResponse>('/api/feedback/token')
  const body = buildFeedbackBody(input, parseWhatsappReply(mint), mint.token)
  const { data } = await api.post<{ ok: true; message?: string }>('/api/feedback', body)
  return data.message || 'Thanks for your feedback!'
}
