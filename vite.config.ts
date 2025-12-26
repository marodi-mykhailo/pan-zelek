import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// Якщо ваш репозиторій називається інакше, змініть base на відповідне значення
// Наприклад, для репозиторію 'my-repo' використовуйте base: '/my-repo/'
// Для custom domain або username.github.io використовуйте base: '/'
export default defineConfig(({ mode }) => {
  // For GitHub Pages deployment, use /pan-zelek/ base path
  // For local development, use / (root)
  const base = mode === 'production' ? '/pan-zelek/' : '/';

  return {
    plugins: [react()],
    base,
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    define: {
      // Set API URL for production builds (must include /api)
      'import.meta.env.VITE_API_URL': JSON.stringify(
        mode === 'production'
          ? 'https://web-production-101aa.up.railway.app/api'
          : undefined
      ),
    },
  };
})
