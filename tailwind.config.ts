import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#09090b',
        paper: '#ece7da',
        muted: '#9a958a',
        muted2: '#6a665e',
        gold: '#c8a24b',
        'gold-hi': '#f3dd9b',
        'gold-lo': '#7a5a22',
        teal: '#1f9c89',
        'teal-hi': '#46cdb6',
        signal: '#b9f23a',
      },
      fontFamily: {
        archivo: ['Archivo', 'system-ui', 'sans-serif'],
        cormorant: ['Cormorant', 'serif'],
        mono: ['Space Mono', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
