import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg','**/*.PNG'],
    server: {
      port: 5173,
      proxy: {
        '/mailchimp': {
          target: 'https://us3.api.mailchimp.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mailchimp/, '')
        }
      }
    },
    define: {
      __BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL || 'http://localhost:4000')
    }
  }
})