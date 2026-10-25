import { createContext } from 'react'
import type { HeadMeta } from './head'

/**
 * Receives a page's head metadata during a server render. Provided only by
 * `entry-server.tsx`; effects don't run there, so `PageMeta` reports here instead.
 */
export const MetaCollectorContext = createContext<((meta: HeadMeta) => void) | null>(null)
