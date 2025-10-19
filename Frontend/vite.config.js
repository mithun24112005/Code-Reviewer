import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // or your GitHub Pages subdirectory if using gh-pages
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
  },
  define: {
    // Ensure environment variables are available at build time
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
