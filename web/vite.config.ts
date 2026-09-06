import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/chat': {
        target: 'https://integrate.api.nvidia.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: () => '',
        headers: {
          Authorization: `Bearer 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`,
        },
      },
    },
  },
})

