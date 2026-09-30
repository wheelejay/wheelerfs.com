import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import content from './plugins/content.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), content()],
})
