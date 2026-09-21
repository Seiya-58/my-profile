// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ← この行を追加・確認する

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← ここでプラグインを使用する
  ],
})
