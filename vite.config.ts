import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Where FastAPI serves the production build. Must match `SPA_MOUNT_PATH` in
 * MyFinancesMCP/web/app.py; the router reads it back as `import.meta.env.BASE_URL`.
 */
const SPA_BASE = '/app/'

export default defineConfig(({ command, mode }) => {
  /**
   * The FastAPI app the dev server forwards to. `npm run dev` reads `.env.development` (local
   * backend), `npm run prod` reads `.env.prod` (hosted backend); a shell variable still wins.
   */
  const env = loadEnv(mode, import.meta.dirname, '')
  const BACKEND = env.AGENTFOLIO_BACKEND || 'http://localhost:8000'

  /**
   * `changeOrigin` rewrites the Host header so name-routed hosts (Render, Cloudflare, ...) accept the
   * request; `cookieDomainRewrite` keeps a hosted backend's session cookie usable on localhost.
   */
  const proxy = { target: BACKEND, changeOrigin: true, cookieDomainRewrite: 'localhost' }

  return {
    // Vercel serves the build from the site root, not under FastAPI's mount path (it sets VERCEL=1).
    base: command === 'build' && !process.env.VERCEL ? SPA_BASE : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': import.meta.dirname + '/src',
      },
    },
    server: {
      port: 3000,
      proxy: {
        // JSON API, including the market-data stream (Server-Sent Events, plain HTTP).
        '/api': proxy,
        // The metric glossary (data/metric_glossary.json) is served from FastAPI's /static/data.
        '/static': proxy,
        // The MCP endpoint the Connect page tells users to paste, so it works under dev too.
        '/mcp': proxy,
      },
    },
  }
})
