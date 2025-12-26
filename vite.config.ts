import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
// Якщо ваш репозиторій називається інакше, змініть base на відповідне значення
// Наприклад, для репозиторію 'my-repo' використовуйте base: '/my-repo/'
// Для custom domain або username.github.io використовуйте base: '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/pan-zelek/' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  define: {
    // Set API URL for production builds
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://web-production-101aa.up.railway.app'
        : undefined
    ),
  },
})
