import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base: the hub serves this build under /project5/.
export default defineConfig({ base: './', plugins: [react()], build: { outDir: 'dist' } })
