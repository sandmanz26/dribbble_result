import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Two versions of the same brief, side by side: v1 at the root, v2 at /v2/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html'), v2: resolve(__dirname, 'v2/index.html') },
    },
  },
})
