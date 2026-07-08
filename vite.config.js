import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path = nom du dépôt GitHub, requis pour GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/Vibe_Coding_KM_Injection/',
})
