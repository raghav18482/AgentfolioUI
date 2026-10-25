/**
 * Build-time prerendering for agentfolio.in (Vercel). Runs after `vite build`:
 *
 * 1. builds `src/entry-server.tsx` for Node,
 * 2. renders every public page to `dist/<path>.html` with its own head tags
 *    (served at `/<path>` by `cleanUrls` in `vercel.json`, and by `vite preview`),
 * 3. renders the not-found page to `dist/404.html` (Vercel serves it with a 404),
 * 4. keeps the empty app shell as `dist/spa.html` (served at `/spa`) for client-only routes (see `vercel.json`),
 * 5. writes `dist/sitemap.xml` and the share images.
 *
 * Pages whose content comes from the backend (the metrics guide) are rendered with
 * data fetched here and embedded in the page; if the backend can't be reached the
 * page is still built, showing its loading state, and the build goes on.
 *
 * Skipped for the FastAPI build (served under `/app/`), which is not what search engines see.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import { renderOgPng } from './og/template.ts'

if (!process.env.VERCEL) {
  console.log('prerender: skipped (runs for the Vercel build only; set VERCEL=1 to run it locally)')
  process.exit(0)
}

const root = join(import.meta.dirname, '..')
const dist = join(root, 'dist')
const ssrOut = join(root, 'dist-ssr')

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrOut, emptyOutDir: true },
})

type HeadMeta = { title: string }
type QuerySeed = { key: readonly unknown[]; data: unknown }
const server = (await import(pathToFileURL(join(ssrOut, 'entry-server.js')).href)) as {
  renderPage: (url: string, seeds?: QuerySeed[]) => Promise<{ html: string; meta?: HeadMeta }>
  QUERY_SEED_ID: string
  glossaryQueryKey: readonly unknown[]
  renderHeadTags: (meta: HeadMeta) => string
  prerenderedPaths: () => string[]
  lessonCards: { slug: string; title: string; minutes: number }[]
  SITE_URL: string
}

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const META_BLOCK = /<!-- page-meta:[\s\S]*?<!-- \/page-meta -->/
const ROOT_DIV = '<div id="root"></div>'
if (!META_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('dist/index.html is missing the page-meta block or the empty root div')
}

/** Where `vercel.json` proxies `/static`: the FastAPI backend. */
const BACKEND = process.env.AGENTFOLIO_BACKEND || 'https://myfinancesmcp.onrender.com'

/** JSON from the backend, or `undefined` (with a warning) if it can't be had; a free-tier cold start can take a minute. */
async function fetchJson(path: string): Promise<unknown> {
  try {
    const res = await fetch(BACKEND + path, { signal: AbortSignal.timeout(90_000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn(`prerender: could not fetch ${BACKEND}${path} (${String(err)}); that page is built without it`)
    return undefined
  }
}

const glossary = await fetchJson('/static/data/metric_glossary.json')
const SEEDS: Record<string, QuerySeed[]> = glossary ? { '/learn/metrics': [{ key: server.glossaryQueryKey, data: glossary }] } : {}

function write(file: string, contents: string | Buffer) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, contents)
}

async function renderToFile(url: string, file: string) {
  const seeds = SEEDS[url] ?? []
  const { html, meta } = await server.renderPage(url, seeds)
  if (!meta) throw new Error(`${url} rendered without <PageMeta>; every prerendered page needs one`)
  // `<` escaped so text inside the data can never close the script element.
  const seedTag = seeds.length
    ? `<script id="${server.QUERY_SEED_ID}" type="application/json">${JSON.stringify(seeds).replace(/</g, '\\u003c')}</script>`
    : ''
  const page = template
    .replace(META_BLOCK, server.renderHeadTags(meta))
    .replace(ROOT_DIV, `<div id="root">${html}</div>${seedTag}`)
  write(file, page)
  console.log(`prerender: ${url} → ${file.slice(root.length + 1)}  (${meta.title})`)
}

// The untouched shell first: `dist/index.html` is about to become the landing page.
write(join(dist, 'spa.html'), template)

const paths = server.prerenderedPaths()
for (const path of paths) {
  await renderToFile(path, path === '/' ? join(dist, 'index.html') : join(dist, `${path}.html`))
}
await renderToFile('/__not-found__', join(dist, '404.html'))

const today = new Date().toISOString().slice(0, 10)
const urls = paths
  .map((p) => `  <url><loc>${server.SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')
write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
console.log(`prerender: sitemap.xml with ${paths.length} URLs`)

write(
  join(dist, 'og-image.png'),
  renderOgPng({
    kicker: 'Portfolio intelligence + MCP',
    title: 'Your portfolio, reimagined.',
    subtitle: 'Track Angel One holdings and P&L, get AI insights, and talk to your portfolio from Claude, ChatGPT or Cursor.',
  }),
)
for (const lesson of server.lessonCards) {
  write(
    join(dist, 'og', 'lessons', `${lesson.slug}.png`),
    renderOgPng({ kicker: `Financial Learning Academy · ${lesson.minutes} min`, title: lesson.title }),
  )
}
console.log(`prerender: ${server.lessonCards.length + 1} share images`)

rmSync(ssrOut, { recursive: true, force: true })
