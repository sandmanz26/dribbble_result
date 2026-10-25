import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base: the hub serves this build under its own /projectN/ path.
export default defineConfig({ base: './', plugins: [react()], build: { outDir: 'dist' } })
