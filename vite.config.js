import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/CS1950U/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          spline: ['@splinetool/react-spline', '@splinetool/runtime'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
