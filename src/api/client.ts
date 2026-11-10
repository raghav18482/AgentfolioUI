import axios, { type AxiosError } from 'axios'

/**
 * A failed API call, carrying the server's own message.
 *
 * Every FastAPI endpoint answers errors as `{error: string}`; the auth endpoints
 * add `field` when one input is at fault. `status` is 0 when the request never
 * reached the server.
 */
export class ApiError extends Error {
  readonly status: number
  readonly field?: string
  /** Machine-readable reason, when the server gives one (e.g. `brokerage_not_connected`). */
  readonly code?: string

  constructor(message: string, status: number, field?: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.field = field
    this.code = code
  }
}

let unauthorizedHandler: (() => void) | null = null
let brokerageHandler: (() => void) | null = null

/**
 * Register what happens when a signed-in request comes back 401 — the session
 * expired mid-visit. Set once, by the app root, which owns the query cache.
 */
export function onUnauthorized(handler: () => void): void {
  unauthorizedHandler = handler
}

/**
 * Register what happens when a request is refused for want of a working broker
 * link (403 `brokerage_*`) — it was disconnected or expired mid-visit. Unlike a
 * 401 the user is still signed in; the session just needs re-reading so the
 * brokerage guard can send them to reconnect.
 */
export function onBrokerageRequired(handler: () => void): void {
  brokerageHandler = handler
}

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

type ErrorBody = { error?: unknown; detail?: unknown; field?: unknown; code?: unknown }

function messageFrom(body: ErrorBody | undefined, status: number): string {
  if (body && typeof body.error === 'string' && body.error) return body.error
  if (body && typeof body.detail === 'string' && body.detail) return body.detail
  return status ? `Request failed (${status})` : 'Could not reach the server. Check your connection.'
}

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ErrorBody>) => {
    const status = err.response?.status ?? 0
    const body = err.response?.data
    // A 401 from /api/auth/* is a wrong password, not an expired session.
    if (status === 401 && !err.config?.url?.startsWith('/api/auth/')) unauthorizedHandler?.()
    const field = body && typeof body.field === 'string' ? body.field : undefined
    const code = body && typeof body.code === 'string' ? body.code : undefined
    if (status === 403 && code?.startsWith('brokerage_')) brokerageHandler?.()
    return Promise.reject(new ApiError(messageFrom(body, status), status, field, code))
  },
)

export default api
