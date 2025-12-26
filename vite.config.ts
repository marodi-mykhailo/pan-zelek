import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Якщо ваш репозиторій називається інакше, змініть base на відповідне значення
// Наприклад, для репозиторію 'my-repo' використовуйте base: '/my-repo/'
// Для custom domain або username.github.io використовуйте base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/mytest/',
})
