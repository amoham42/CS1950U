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
      external: [
        'three', 
        'three/examples/jsm/loaders/GLTFLoader', 
        'three/src/loaders/TextureLoader',
        'noisejs'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
