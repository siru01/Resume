import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Dev proxy: rewrites /api/leetcode/* → https://leetcode-api-faisalshohag.vercel.app/*
      // Production: handled by vercel.json rewrites instead
      '/api/leetcode': {
        target: 'https://leetcode-api-faisalshohag.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leetcode/, ''),
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
  }
})