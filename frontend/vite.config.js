import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg','**/*.PNG'],
  server: {
    port: 5173,
    proxy: {
      '/mailchimp': {
        target: 'https://us3.api.mailchimp.com', // Your Mailchimp API endpoint
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mailchimp/, '')
      }
    }
  }
})