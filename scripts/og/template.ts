/**
 * Share images (Open Graph / Twitter cards), 1200×630, drawn as SVG and
 * rasterised by resvg. Text uses the bundled Space Grotesk files in `fonts/`,
 * so the output doesn't depend on what fonts the build machine has.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const WIDTH = 1200
const HEIGHT = 630
const FONTS_DIR = join(import.meta.dirname, 'fonts')
const FONT_FILES = ['SpaceGrotesk-Bold.ttf', 'SpaceGrotesk-Medium.ttf'].map((f) => join(FONTS_DIR, f))

export interface OgCard {
  /** Small line above the title, e.g. "Financial Learning Academy". */
  kicker: string
  title: string
  subtitle?: string
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Greedy word wrap by character count; Space Grotesk is close enough to even width for this. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'
  }
  return lines
}

/** The logo mark from `src/components/ui/Logo.tsx`, as plain SVG. */
const LOGO_MARK = `
  <defs>
    <linearGradient id="ls" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10b981"/><stop offset=".5" stop-color="#0ea5e9"/><stop offset="1" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="lf" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0d2b2b"/><stop offset="1" stop-color="#1a2347"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="56" height="56" rx="15" fill="url(#lf)" stroke="url(#ls)" stroke-width="3"/>
  <rect x="15" y="34" width="8" height="15" rx="2" fill="#10b981"/>
  <rect x="27.5" y="27" width="8" height="22" rx="2" fill="#0ea5e9"/>
  <rect x="40" y="19" width="8" height="30" rx="2" fill="#6366f1"/>
  <path d="M19 33 L33 24 L43 18 L50 11" stroke="#cbd5e1" stroke-opacity=".75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="50.5" cy="10.5" r="3.5" fill="#10b981"/>`

export function ogSvg({ kicker, title, subtitle }: OgCard): string {
  const titleSize = title.length > 60 ? 58 : 68
  const titleLines = wrap(title, titleSize === 68 ? 27 : 32, 3)
  const lineHeight = titleSize * 1.1
  // Laid out top-down from a fixed kicker line, so a three-line title never reaches the logo.
  const kickerTop = 222
  const titleTop = kickerTop + titleSize + 14
  const subtitleLines = subtitle ? wrap(subtitle, 62, 2) : []
  const subtitleTop = titleTop + (titleLines.length - 1) * lineHeight + 62

  const tspans = (lines: string[], x: number, lineHeight: number) =>
    lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="g1" cx="0.85" cy="0.1" r="0.6"><stop stop-color="#6366f1" stop-opacity=".35"/><stop offset="1" stop-color="#6366f1" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="0.05" cy="0.95" r="0.55"><stop stop-color="#10b981" stop-opacity=".22"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#10b981"/><stop offset=".5" stop-color="#0ea5e9"/><stop offset="1" stop-color="#6366f1"/></linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#09090b"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g1)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g2)"/>
  <svg x="80" y="64" width="64" height="64" viewBox="0 0 64 64">${LOGO_MARK}</svg>
  <text x="160" y="108" font-family="Space Grotesk" font-weight="700" font-size="34" fill="#ffffff">Agent<tspan fill="#38bdf8">folio</tspan></text>
  <text x="80" y="${kickerTop}" font-family="Space Grotesk" font-weight="500" font-size="26" fill="#34d399" letter-spacing="1">${escapeXml(kicker.toUpperCase())}</text>
  <text x="80" y="${titleTop}" font-family="Space Grotesk" font-weight="700" font-size="${titleSize}" fill="#ffffff">${tspans(titleLines, 80, lineHeight)}</text>
  ${subtitleLines.length ? `<text x="80" y="${subtitleTop}" font-family="Space Grotesk" font-weight="500" font-size="28" fill="#a1a1aa">${tspans(subtitleLines, 80, 38)}</text>` : ''}
  <text x="80" y="570" font-family="Space Grotesk" font-weight="500" font-size="24" fill="#71717a">agentfolio.in</text>
  <rect x="0" y="${HEIGHT - 8}" width="${WIDTH}" height="8" fill="url(#bar)"/>
</svg>`
}

export function renderOgPng(card: OgCard): Buffer {
  // resvg skips a missing font silently and falls back to nothing: fail loudly instead.
  for (const f of FONT_FILES) if (!existsSync(f)) throw new Error(`Missing font file ${f}`)
  const resvg = new Resvg(ogSvg(card), {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Space Grotesk' },
    fitTo: { mode: 'width', value: WIDTH },
  })
  return resvg.render().asPng()
}
