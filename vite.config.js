import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build works under /<slug>/ on the hub
export default defineConfig({ base: './', plugins: [react()] })
