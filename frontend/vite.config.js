import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Dev proxy: rewrites /api/leetcode/* → https://alfa-leetcode-api.onrender.com/userProfile/*
      // Production: handled by vercel.json rewrites instead
      // Proxy for alfa-leetcode-api (REST wrapper, rate-limited)
      '/api/leetcode': {
        target: 'https://alfa-leetcode-api.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leetcode/, '/userProfile'),
        secure: false,
      },
      // Proxy for LeetCode's own GraphQL API (no third-party, no rate limits)
      '/api/lc-graphql': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lc-graphql/, '/graphql'),
        secure: true,
      }
    }
  },
  build: {
    outDir: 'dist',
  }
})