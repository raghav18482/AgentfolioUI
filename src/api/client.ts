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

  constructor(message: string, status: number, field?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.field = field
  }
}

let unauthorizedHandler: (() => void) | null = null

/**
 * Register what happens when a signed-in request comes back 401 — the session
 * expired mid-visit. Set once, by the app root, which owns the query cache.
 */
export function onUnauthorized(handler: () => void): void {
  unauthorizedHandler = handler
}

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

type ErrorBody = { error?: unknown; detail?: unknown; field?: unknown }

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
    return Promise.reject(new ApiError(messageFrom(body, status), status, field))
  },
)

export default api
