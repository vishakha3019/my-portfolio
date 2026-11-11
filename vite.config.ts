import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js alone is ~950 kB minified (256 kB gzipped). It sits in its own lazy chunk that loads
    // after the page is idle, so it never blocks first paint; the default 500 kB warning doesn't apply.
    chunkSizeWarningLimit: 1000,
  },
})
