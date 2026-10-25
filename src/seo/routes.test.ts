import { describe, expect, it } from 'vitest'
import appSource from '../App.tsx?raw'
import vercelJson from '../../vercel.json?raw'
import robotsTxt from '../../public/robots.txt?raw'
import { CLIENT_ONLY_PATHS, prerenderedPaths } from './routes'

/**
 * On Vercel a URL is served only if it is a prerendered file or matches a
 * rewrite; everything else is a 404. These checks keep `App.tsx`, the
 * prerender list and `vercel.json` in step, so a new route can't 404 in production.
 */
const rewrites = (JSON.parse(vercelJson) as { rewrites: { source: string; destination: string }[] }).rewrites
const prerendered = prerenderedPaths()

/** Every `path="…"` in the route tree, nested ones included (`lessons/:slug`). */
const routePaths = [...appSource.matchAll(/\bpath="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*')

describe('public routes', () => {
  it('covers every route in App.tsx with a prerendered page or a rewrite', () => {
    for (const path of routePaths) {
      const pattern = new RegExp(`/${path.replace(/:[^/]+/g, '[^/]+')}$`)
      const covered = prerendered.some((p) => pattern.test(p)) || CLIENT_ONLY_PATHS.some((p) => pattern.test(p))
      expect(covered, `route "${path}" is neither prerendered nor in CLIENT_ONLY_PATHS`).toBe(true)
    }
  })

  it('rewrites every client-only path, and its sub-paths, to the app shell', () => {
    for (const path of CLIENT_ONLY_PATHS) {
      expect(rewrites).toContainEqual({ source: path, destination: '/spa.html' })
      expect(rewrites).toContainEqual({ source: `${path}/:path*`, destination: '/spa.html' })
    }
  })

  it('has no catch-all rewrite, so unknown URLs return a real 404', () => {
    expect(rewrites.map((r) => r.source)).not.toContain('/(.*)')
  })

  it('never prerenders a client-only path', () => {
    for (const path of CLIENT_ONLY_PATHS) expect(prerendered).not.toContain(path)
  })

  it('keeps the signed-in app out of robots and points to the sitemap', () => {
    for (const path of CLIENT_ONLY_PATHS.filter((p) => p !== '/login' && p !== '/enroll')) {
      expect(robotsTxt).toContain(`Disallow: ${path}\n`)
    }
    expect(robotsTxt).toContain('Sitemap: https://agentfolio.in/sitemap.xml')
  })
})
