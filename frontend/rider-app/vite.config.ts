import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
      '/ws': { target: 'ws://localhost:8000', ws: true },
      '/ollama': {
        target: 'http://10.151.32.198:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
        timeout: 30000,
      },
    },
  },
  resolve: {
    alias: {
      // TODO: replace with pnpm workspace or npm link once shared/ is packaged
      shared: path.resolve(__dirname, '../shared/src'),
    },
  },
})

