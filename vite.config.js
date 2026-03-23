import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // Если 5173 уже занят (старый процесс), Vite поднимет следующий свободный порт.
    strictPort: false
  }
})

