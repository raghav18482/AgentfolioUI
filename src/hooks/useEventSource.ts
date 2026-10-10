import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type StreamStatus = 'idle' | 'connecting' | 'open' | 'closed'

type Handlers = Record<string, (payload: unknown) => void>

/**
 * Subscribe to a Server-Sent Events stream while `url` is non-null.
 *
 * Each handler receives its event's parsed JSON. The browser reconnects on its
 * own after a dropped connection; `closed` means the server refused the stream
 * (e.g. a 4xx JSON answer instead of `text/event-stream`). Changing `url` tears
 * the old stream down first, so a late event can never reach the new one.
 *
 * Same-origin, so the session cookie authenticates it — nothing secret goes in
 * the URL.
 */
export function useEventSource(url: string | null, handlers: Handlers): StreamStatus {
  const handlersRef = useRef(handlers)
  useLayoutEffect(() => {
    handlersRef.current = handlers
  })

  // Status is stored with the URL it belongs to, so a new URL reads as
  // `connecting` immediately, without a state reset inside the effect.
  const [state, setState] = useState<{ url: string | null; status: StreamStatus }>({ url: null, status: 'idle' })

  useEffect(() => {
    if (!url) return
    const source = new EventSource(url)
    const eventNames = Object.keys(handlersRef.current)
    const listeners = eventNames.map((name) => {
      const listener = (e: MessageEvent<string>) => {
        let payload: unknown
        try {
          payload = JSON.parse(e.data)
        } catch {
          return
        }
        handlersRef.current[name]?.(payload)
      }
      source.addEventListener(name, listener)
      return [name, listener] as const
    })

    source.onopen = () => setState({ url, status: 'open' })
    source.onerror = () =>
      setState({ url, status: source.readyState === EventSource.CLOSED ? 'closed' : 'connecting' })

    return () => {
      for (const [name, listener] of listeners) source.removeEventListener(name, listener)
      source.close()
    }
  }, [url])

  if (!url) return 'idle'
  return state.url === url ? state.status : 'connecting'
}
