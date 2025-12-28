import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  // For GitHub Pages deployment, set the base to your repository name
  // Change '/winter-camp-registration/' to your actual repository name
  base: '/winter-camp-registration/',
})
