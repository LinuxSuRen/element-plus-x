import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  // In CI, externalize the library to prevent bundling issues
  build: {
    ...(process.env.CI ? {
      rollupOptions: {
        external: ['element-plus-x', /^element-plus-x\/.*/]
      }
    } : {})
  },
  // Base path for GitHub Pages - change 'element-plus-x' to your repo name
  base: process.env.NODE_ENV === 'production' ? '/element-plus-x/' : '/',
  server: {
    port: 3000,
    open: true
  },
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false
})
