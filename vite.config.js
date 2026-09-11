import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Any request starting with /api gets forwarded to your backend
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        }
      }
    }
  }
})
