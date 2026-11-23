import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages has no SPA fallback: serving index.html as 404.html lets deep links such as
// /CS1950U/labs load the app instead of GitHub's 404 page.
const spaFallback = () => {
  let outDir
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  base: '/CS1950U/',
  build: {
    // three.js alone is ~530 kB minified (~133 kB gzip); it lives in its own long-cached chunk.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code so it stays cached across content updates.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          three: ['three'],
        },
      },
    },
  },
})
