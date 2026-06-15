#!/usr/bin/env node
// Post-build static prerender. Uses Vite's SSR loader + react-dom/server
// (no browser, no Playwright) so it runs cleanly on Vercel's build VM
// with just `npm run build`.
//
// App.tsx defaults layoutMode to 'scroll' (SSR_INITIAL_LAYOUT) and the
// cinematic upgrade for desktop humans happens in a post-hydration
// useLayoutEffect. That means the prerender output matches what React
// renders on the very first commit for every visitor, so hydration is
// mismatch-free across the board.
//
// useEffect / useLayoutEffect bodies don't fire in renderToString, so all
// the window/document/localStorage refs inside effect bodies are harmless.
// We still shim a minimal window/navigator/document/localStorage in case
// any module-top-level code runs during ssrLoadModule.
//
// Output: dist/index.html (replacing the SPA shell with the fully
// rendered scroll-mode HTML). Every visitor now gets real content on
// first byte.

import { createServer } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const OUT = resolve('dist/index.html')
const TEMPLATE = resolve('dist/index.html')

// ─── Shims ───────────────────────────────────────────────────────────────
// Defensive only — no codebase path reads these synchronously during render
// any more (the cinematic decision was moved to a useLayoutEffect). Kept
// in case a future component reads navigator/window in a module-top-level
// expression. Node 21+ defines globalThis.navigator as a non-writable
// getter, so we use Object.defineProperty to replace it.
const noop = () => {}
const classListStub = { add: noop, remove: noop, contains: () => false, toggle: noop }
const define = (key, value) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true })

define('window', {
  innerWidth: 1440,
  innerHeight: 900,
  addEventListener: noop,
  removeEventListener: noop,
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
  location: { href: 'https://whatsnext.digital/', pathname: '/' },
  dataLayer: [],
})
define('navigator', { userAgent: 'Mozilla/5.0 (prerender)' })
define('document', {
  body: { classList: classListStub },
  documentElement: { classList: classListStub, setAttribute: noop },
  addEventListener: noop,
  removeEventListener: noop,
  createElement: () => ({ set src(_) {}, set async(_) {} }),
  head: { appendChild: noop },
})
define('localStorage', { getItem: () => null, setItem: noop, removeItem: noop })
define('sessionStorage', { getItem: () => null, setItem: noop, removeItem: noop })

// ─── Vite SSR + renderToString ───────────────────────────────────────────
console.log('[prerender] booting Vite SSR (no browser)...')
const vite = await createServer({
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  ssr: {
    external: ['react', 'react-dom', 'react-dom/server', 'react-dom/client', 'scheduler'],
  },
  logLevel: 'warn',
})

try {
  const ReactNS = await import('react')
  const ServerNS = await import('react-dom/server')
  const AppMod = await vite.ssrLoadModule('/src/App.tsx')

  const React = ReactNS.default ?? ReactNS
  const renderToString = ServerNS.renderToString ?? ServerNS.default?.renderToString
  const App = AppMod.default

  if (!renderToString) throw new Error('renderToString not exported from react-dom/server')
  if (!App) throw new Error('default export missing from /src/App.tsx')

  const tree = React.createElement(React.StrictMode, null, React.createElement(App))
  const rendered = renderToString(tree)
  console.log(`[prerender] rendered ${rendered.length.toLocaleString()} chars`)

  const template = readFileSync(TEMPLATE, 'utf-8')
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('expected empty <div id="root"></div> in dist/index.html template')
  }
  const out = template.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`)
  writeFileSync(OUT, out)
  console.log(`[prerender] wrote ${OUT} (${out.length.toLocaleString()} bytes)`)

  const required = [
    'AN OPERATOR-LED INVESTMENT',
    'waiting for permission',
    'Numbers we earned',
    'Where we get our hands dirty',
    'Betting on the people building',
    'AI Social Simulator',
  ]
  const missing = required.filter((s) => !out.includes(s))
  if (missing.length) {
    throw new Error('[prerender] missing required strings: ' + missing.join(' / '))
  }
  console.log('[prerender] all required strings present')
} finally {
  await vite.close()
}
