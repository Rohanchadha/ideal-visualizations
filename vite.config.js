import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isPreview }) => ({
  plugins: [react(), tailwindcss()],
  appType: isPreview ? 'mpa' : 'spa',
}))
